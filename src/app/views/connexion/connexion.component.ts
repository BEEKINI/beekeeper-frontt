import { Component, DestroyRef, inject } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { AuthQueries } from '../../queries/auth.queries';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TokenService } from '../../services/token.service';

interface ConnexionForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss',
})
export class ConnexionComponent {
  public readonly form = new FormGroup<ConnexionForm>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(8), Validators.required],
    }),
  });

  protected readonly router = inject(Router);
  protected readonly authQueries = inject(AuthQueries);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly tokenService = inject(TokenService);

  protected connexion(): void {
    this.authQueries
      .login({
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.tokenService.setToken(result);
          this.router.navigateByUrl('/dashboard');
        }
      });
  }

  protected newAccount(): void {
    this.router.navigateByUrl('/inscription');
  }
}
