import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type UserRole = 'ADMIN' | 'USER';

export interface User {
  id?: number;
  lastname: string;
  firstname: string;
  email: string;
  role?: UserRole;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #currentUserSubject = new BehaviorSubject<User | null>(null);

  public readonly currentUser$: Observable<User | null> =
    this.#currentUserSubject.asObservable();

  public setCurrentUser(user: User | null): void {
    this.#currentUserSubject.next(user);
  }

  public getCurrentUser(): User | null {
    return this.#currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.#currentUserSubject.value;
  }

  public isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  public isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'USER';
  }
}
