import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TopupComponent } from '../topup/topup.component';
import { TransferComponent } from '../transfer/transfer.component';

interface IGetUserResponse {
  message: string,
  data: IUser
}
@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    NgxSkeletonLoaderModule,
    MatDialogModule
  ]
})
export class ProfileComponent implements OnInit {
  pageIsLoading: boolean = true;
  balance: number = 0;
  firstName: string = "";
  username: string = "";
  email: string = "";

  constructor (
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.getInfo().subscribe({
      next: (response: IGetUserResponse) => {
        this.updatePage(response.data)
      },
      error: (error: HttpErrorResponse) => {
        // rotate tokens and retry (only once before redirecting the user back to the login page)
        if (error.status === 401) {
          this.authService.rotateTokens().subscribe(({
            next: () => {
              this.userService.getInfo().subscribe({
                next: (response: IGetUserResponse) => {
                  this.updatePage(response.data)
                },
                error: () => {
                  this.router.navigate(['/']);
                }
              })
            },
            error: () => {
              this.router.navigate(['/']);
            }
          }))
        }
      }
    })
  }

  updatePage(data: IUser | null): void {
    if (data === null) {
      this.router.navigate(['/'])
      return;
    }

    this.balance = data.walletBalance;
    this.firstName = data.firstName;
    this.username = data.username;
    this.email = data.email;

    this.pageIsLoading = false;
  }

  addMoney(): void {
    this.dialog.open(TopupComponent, {
      data: {
        email: this.email
      }
    })
      .afterClosed()
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.balance = data;
          }
        }
      })
  }

  transferMoney(): void {
    this.dialog.open(TransferComponent)
      .afterClosed()
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.balance = data;
          }
        }
      })
  }
}
