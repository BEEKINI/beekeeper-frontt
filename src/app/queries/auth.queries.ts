import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../services/user.service';

interface UserRegister extends User {
  password_confirmation: string;
}

interface UserLogin {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthQueries {
  protected readonly baseUrl = 'http://127.0.0.1/api';
  protected readonly http = inject(HttpClient);

  public register(user: UserRegister): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }

  public login(user: UserLogin): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, user);
  }
}
