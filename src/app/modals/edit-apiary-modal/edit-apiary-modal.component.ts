import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { InputComponent } from '../../shared/components/input/input.component';
import {
  SelectComponent,
  SelectOptionModel,
} from '../../shared/components/select/select.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HiveModel, HiveQueries } from '../../queries/hive.queries';

export interface EditApiaryForm {
  name: FormControl<string>;
  hives: FormControl<HiveModel[]>;
}

export interface EditApiaryModel {
  name: string;
  hives: HiveModel[];
}

@Component({
  selector: 'app-edit-apiary-modal',
  standalone: true,
  imports: [
    InputComponent,
    SelectComponent,
    MatDialogModule,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-apiary-modal.component.html',
  styleUrl: './edit-apiary-modal.component.scss',
})
export class EditApiaryModalComponent implements OnInit {
  protected readonly hivesQueries = inject(HiveQueries);
  protected readonly destroyRef = inject(DestroyRef);

  protected readonly form: FormGroup<EditApiaryForm>;
  protected hivesOptions: SelectOptionModel<HiveModel>[] = [];

  public constructor(
    protected dialogRef: MatDialogRef<EditApiaryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditApiaryModel,
  ) {
    this.form = new FormGroup({
      name: new FormControl(data.name ?? '', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      hives: new FormControl(data.hives ?? [], {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  public ngOnInit(): void {
    this.hivesQueries
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((hives) => {
        this.hivesOptions = hives.map((hive) => ({
          value: hive,
          label: hive.name,
        }));
      });
  }

  protected close(): void {
    this.dialogRef.close();
  }

  protected confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  protected compareWithRuche(a: HiveModel, b: HiveModel): boolean {
    return a.id === b.id;
  }
}
