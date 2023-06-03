import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IAuthResponse } from '../interfaces/authResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
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

  rotateTokens(): Observable<null> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken === null) {
      return of(null);
    }

    return this.http.post<IAuthResponse>(`${environment.apiUrl}/auth/rotate`, {}, {
      headers: {
        authorization: `Bearer ${refreshToken}`
      }
    }).pipe(
      map((response: IAuthResponse): null => {
        this.setTokens(response.data.accessToken, response.data.refreshToken)
        return null
      }),
      catchError(() => of(null))
    )
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    // handle this like invalid fields etc.
    return throwError(() => new Error(error.error.message))
  }
}
