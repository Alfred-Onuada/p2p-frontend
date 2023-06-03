import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  username: string = '';

  loading: boolean = false;
  error: string = '';

  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  register(): boolean {
    this.loading = true;
    
    this.authService
      .register(
        this.email,
        this.password,
        this.firstName,
        this.lastName,
        this.username
      )
      .subscribe({
        next: (resp: string) => {
          this.dialogRef.close();
          this.router.navigate(['/profile'])
        },
        error: (error: Error) => {          
          this.error = error.message;
          this.loading = false;
  
          setTimeout(() => {
            this.error = "";
          }, 5000);
        },
        complete: () => this.loading = false
      })
      
    return false
  }
}
