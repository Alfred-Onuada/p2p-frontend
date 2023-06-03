import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WalletService } from '../services/wallet.service';

@Component({
  standalone: true,
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
})
export class TransferComponent {

  receiver: string =  "";
  amount: number = 0;
  note: string = "";
  error: string = "";
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TransferComponent>,
    private walletService: WalletService
  ) {}

  transfer(): void {
    this.loading = true;

    this.walletService.transfer(this.receiver, this.amount, this.note)
      .subscribe({
        next: (response: string) => {
          this.dialogRef.close(parseInt(response))
        },
        error: (error: Error) => {
          this.error = error.message;
          this.loading = false;

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
