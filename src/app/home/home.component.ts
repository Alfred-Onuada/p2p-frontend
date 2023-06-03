import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, MatButtonModule, MatDialogModule]
})
export class HomeComponent {

  constructor (
    private dialog: MatDialog
  ) {}

  openLoginDialog(): void {
    this.dialog.open(LoginComponent)
  }

  openRegisterDialog(): void {
    this.dialog.open(RegisterComponent)
  }
}
