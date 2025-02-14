import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'app-apiary-decla-prod',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './apiary-decla-prod.component.html',
  styleUrl: './apiary-decla-prod.component.scss',
})
export class ApiaryDeclaProdComponent {
  protected readonly form = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.min(0), Validators.required],
  });

  public constructor(
    protected dialogRef: MatDialogRef<ApiaryDeclaProdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: unknown,
  ) {}

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close({ qty: this.form.getRawValue() });
    }
  }
}
