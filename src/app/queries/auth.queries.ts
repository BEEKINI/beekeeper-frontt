import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from '../services/token.service';

type UserRole = 'ADMIN' | 'USER';

export interface User {
  id?: number;
  lastname: string;
  firstname: string;
  email: string;
  role?: UserRole;
  password: string;
}

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

  public login(user: UserLogin): Observable<Token> {
    return this.http.post<Token>(`${this.baseUrl}/login`, user);
  }
}
