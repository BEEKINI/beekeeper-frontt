import { inject, Injectable } from '@angular/core';
import { TokenService } from '../services/token.service';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  protected readonly tokenService = inject(TokenService);
  protected readonly router = inject(Router);

  public canActivate(): Observable<boolean | UrlTree> {
    return this.tokenService.currentToken$.pipe(
      map((token) => {
        if (token) {
          return true;
        }
        return this.router.createUrlTree(['/connexion']);
      }),
    );
  }
}
