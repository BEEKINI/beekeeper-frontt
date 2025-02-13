import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { InputComponent } from '../../shared/components/input/input.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';

export interface MapAddApiaryDataInput {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map-add-apiary',
  standalone: true,
  imports: [
    MatDialogModule,
    InputComponent,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './map-add-apiary.component.html',
  styleUrl: './map-add-apiary.component.scss',
})
export class MapAddApiaryComponent {
  protected readonly form = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: MapAddApiaryDataInput,
    protected readonly dialogRef: MatDialogRef<MapAddApiaryComponent>,
  ) {}

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        name: this.form.value,
        lat: this.data.lat,
        lng: this.data.lng,
      });
    }
  }
}
