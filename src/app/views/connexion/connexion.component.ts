import { Component, DestroyRef, inject } from '@angular/core';
import { InputComponent } from "../../shared/components/input/input.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { AuthQueries } from '../../queries/auth.queries';
import { UserService } from '../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ConnexionForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent {

  public readonly form = new FormGroup<ConnexionForm>({
    email: new FormControl<string>('', {
      nonNullable: true, 
      validators: [
        Validators.email, 
        Validators.required,
      ],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.minLength(8), 
        Validators.required,
      ],
    }),
  });

  protected readonly router = inject(Router);  
  protected readonly authQueries = inject(AuthQueries);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly userService = inject(UserService);

  public connexion(): void {
    this.authQueries
    .login(this.form.controls.email.value, this.form.controls.password.value)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((result) => {
      if (result) {
        this.userService.setCurrentUser(result);
        this.router.navigateByUrl('/dashbord');
      }
    });
  }

  public newAccount(): void {
    this.router.navigateByUrl('/inscription');
  }
}
