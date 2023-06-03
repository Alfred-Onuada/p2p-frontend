import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IAuthResponse } from './interfaces/authResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  login(email: string, password: string): Observable<string> {
    return this.http.post<IAuthResponse>(
      `${environment.apiUrl}/auth/login`,
      { email, password },
      {
        headers: { 
          "Content-Type": "application/json",
        }
      }
    )
    .pipe(
      map((response: IAuthResponse): string => {
        this.setTokens(response.data.accessToken, response.data.refreshToken);

        return response.message;
      }),
      catchError(this.handleError)
    )
  }

  setTokens(refreshToken: string, accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    // handle this like invalid fields etc.
    return throwError(() => new Error(error.error.message))
  }
}
