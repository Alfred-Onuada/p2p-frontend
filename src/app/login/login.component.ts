import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthService,
    private router: Router
  ) { }

  login(): boolean {
    this.loading = true;

    this.authService
      .login(this.email, this.password)
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
    return false;
  }

}
