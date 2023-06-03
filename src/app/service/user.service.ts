import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getInfo(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');

    return this.http.get(`${environment.apiUrl}/user/info`, 
      {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    )
  }
}
