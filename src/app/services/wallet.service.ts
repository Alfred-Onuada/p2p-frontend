import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

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
}
