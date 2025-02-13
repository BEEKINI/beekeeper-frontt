import { Component, DestroyRef, inject } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthQueries } from '../../queries/auth.queries';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface InscriptionForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  password_confirmation: FormControl<string>;
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ButtonComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss',
})
export class InscriptionComponent {
  protected readonly form = new FormGroup<InscriptionForm>({
    firstname: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastname: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    password_confirmation: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  protected readonly router = inject(Router);
  protected readonly authQueries = inject(AuthQueries);
  protected readonly destroyRef = inject(DestroyRef);

  protected register(): void {
    this.authQueries
      .register({
        firstname: this.form.controls.firstname.value,
        lastname: this.form.controls.lastname.value,
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
        password_confirmation: this.form.controls.password_confirmation.value,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.router.navigateByUrl('/connexion');
        }
      });
  }

  protected goToConnexion(): void {
    this.router.navigateByUrl('/connexion');
  }
}
