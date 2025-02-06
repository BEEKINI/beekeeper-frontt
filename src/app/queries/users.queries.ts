import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './auth.queries';
import { Observable } from 'rxjs';
import { BASE_URL } from '../consts/consts';
import { TokenService } from '../services/token.service';

export interface UserAccount extends Omit<User, 'role'> {}

@Injectable({
  providedIn: 'root',
})
export class UsersQueries {
  protected readonly http = inject(HttpClient);
  protected readonly tokenService = inject(TokenService);

  public getUser(): Observable<UserAccount> {
    const type = this.tokenService.getToken()?.token_type;
    const token = this.tokenService.getToken()?.access_token;
    return this.http.get<User>(`${BASE_URL}/user`, {
      headers: {
        Authorization: `${type} ${token}`,
      },
    });
  }
}
