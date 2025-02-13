import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersQueries } from '../../queries/users.queries';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputComponent } from '../../shared/components/input/input.component';
import { MatDivider } from '@angular/material/divider';
export interface AccountForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  password_confirmation: FormControl<string>;
}
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule, MatDivider],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  protected form!: FormGroup<AccountForm>;

  protected readonly userQueries = inject(UsersQueries);
  protected readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.userQueries
      .getUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.form = new FormGroup<AccountForm>({
          firstname: new FormControl<string>(
            { value: user.firstname, disabled: true },
            {
              nonNullable: true,
              validators: [Validators.required],
            },
          ),
          lastname: new FormControl<string>(
            { value: user.lastname, disabled: true },
            {
              nonNullable: true,
              validators: [Validators.required],
            },
          ),
          email: new FormControl<string>(
            { value: user.email, disabled: true },
            {
              nonNullable: true,
              validators: [Validators.required],
            },
          ),
          password: new FormControl<string>(
            { value: user.password, disabled: true },
            {
              nonNullable: true,
              validators: [Validators.required],
            },
          ),
          password_confirmation: new FormControl<string>(
            { value: user.password, disabled: true },
            {
              nonNullable: true,
              validators: [Validators.required],
            },
          ),
        });
      });
  }
}
