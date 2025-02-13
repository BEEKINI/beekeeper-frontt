import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Token {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  #currentTokenSubject = new BehaviorSubject<Token | null>(null);

  public readonly currentToken$: Observable<Token | null> =
    this.#currentTokenSubject.asObservable();

  public setToken(token: Token | null): void {
    this.#currentTokenSubject.next(token);
  }

  public getToken(): Token | null {
    return this.#currentTokenSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.#currentTokenSubject.value;
  }

  public getHeadersForRequest(): Record<string, string> {
    return {
      Authorization: `${this.getToken()?.token_type} ${this.getToken()?.access_token}`,
    };
  }
}
