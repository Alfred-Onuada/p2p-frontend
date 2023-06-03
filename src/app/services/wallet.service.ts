import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

interface ITransferResp {
  message: string,
  data: {
    ref: string,
    walletBalance: number
  }
}

interface IResponse {
  message: string,
  data: number
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private http: HttpClient
  ) { }

  verify(ref: string): Observable<string> {  
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null) {
      return of('');
    }

    return this.http.post<IResponse>(`${environment.apiUrl}/wallet/verify/${ref}`, {}, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
    .pipe(
      map((response: IResponse): string => {
        return response.data.toString();
      }),
      catchError(() => '')
    )
  }

  transfer(receiver: string, amount: number, note: string): Observable<string> {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null) {
      return of('');
    }

    return this.http.post<ITransferResp>(`${environment.apiUrl}/wallet/transfer`, 
      {
        receiver,
        amount,
        note
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    )
    .pipe(
      map((response: ITransferResp): string => {
        return response.data.walletBalance.toString();
      }),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.error.message))
  }

}
