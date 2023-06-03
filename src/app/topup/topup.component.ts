import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Angular4PaystackModule } from 'angular4-paystack';
import { v4 as uuidv4 } from 'uuid';
import { WalletService } from '../services/wallet.service';

interface ITopupData {
  email: string
}

@Component({
  standalone: true,
  selector: 'app-topup',
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.css'],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, Angular4PaystackModule],
})
export class TopupComponent {

  error: string = '';
  amount: number = 0;
  loading: boolean = false;
  channels: string[] = ['card', 'bank', 'bank_transfer']
  ref: string = uuidv4();

  constructor (
    public dialogRef: MatDialogRef<TopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITopupData,
    private walletService: WalletService
  ) {}

  updateRef(): void {
    this.ref = uuidv4();

    this.loading = true;
  }

  paymentCancel(): void {
    alert("Payment cancelled");
  }

  paymentDone(event: any) {
    this.walletService.verify(event.reference)
      .subscribe({
        next: (response) => {
          this.dialogRef.close(parseInt(response))
        },
        error: () => {
          this.error = "Something went wrong";

          setTimeout(() => {
            this.error = "";
          }, 5000)
        },
        complete: () => {
          this.loading = false;
        }
      })
  }
}
