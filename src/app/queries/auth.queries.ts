import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthQueries {
  protected readonly baseUrl = 'http://localhost:8081/auth';
  protected readonly http = inject(HttpClient);

  public register(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }  
  
  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, {
      email,
      password,
    });
  }
}
