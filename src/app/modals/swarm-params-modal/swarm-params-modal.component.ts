import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { SwarmModel, SwarmQueries } from '../../queries/swarm.queries';
import { ApiariesModel, ApiariesQueries } from '../../queries/apiaries.queries';
import { HiveModel, HiveQueries } from '../../queries/hive.queries';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

export interface SwarmParamForm {
  name: FormControl<string>;
  apiary: FormControl<ApiariesModel | null>;
  hive: FormControl<HiveModel | null>;
  is_alive: FormControl<boolean>;
}

export interface SwarmParamsModel {
  mode: 'create' | 'edit';
  swarm?: SwarmModel;
}

@Component({
  selector: 'app-swarm-params-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    ButtonComponent,
  ],
  templateUrl: './swarm-params-modal.component.html',
  styleUrl: './swarm-params-modal.component.scss',
})
export class SwarmParamsModalComponent implements OnInit {
  protected readonly apiariesQueries = inject(ApiariesQueries);
  protected readonly hivesQueries = inject(HiveQueries);
  protected readonly swarmQueries = inject(SwarmQueries);
  protected readonly destroyRef = inject(DestroyRef);

  protected readonly form = new FormGroup<SwarmParamForm>({
    apiary: new FormControl<ApiariesModel | null>(null, { nonNullable: true }),
    hive: new FormControl<HiveModel | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>(
      this.data.mode === 'edit' ? this.data.swarm?.name! : '',
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    is_alive: new FormControl<boolean>(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected apiariesOptions: SelectOptionModel<ApiariesModel>[] = [];
  protected hivesOptions: SelectOptionModel<HiveModel>[] = [];
  protected allHivesOptions: SelectOptionModel<HiveModel>[] = [];
  protected occupiedHives: Set<number> = new Set();

  public constructor(
    protected dialogRef: MatDialogRef<SwarmParamsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SwarmParamsModel,
  ) {}

  public ngOnInit(): void {
    forkJoin({
      apiaries: this.apiariesQueries.list(),
      hives: this.hivesQueries.list(),
      swarms: this.swarmQueries.list(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.apiariesOptions = result.apiaries.map((apiary) => ({
          value: apiary,
          label: apiary.name,
        }));

        this.allHivesOptions = result.hives.map((hive) => ({
          value: hive,
          label: hive.name,
        }));

        this.occupiedHives = new Set(
          result.swarms.map((swarm) => swarm.hive.id!),
        );

        this.updateAvailableHives();
      });

    this.form.controls.apiary.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateAvailableHives();
      });
  }

  protected updateAvailableHives(): void {
    const selectedApiary = this.form.controls.apiary.value;
    if (selectedApiary) {
      this.hivesOptions = this.allHivesOptions.filter(
        (hive) =>
          hive.value.apiary_id === selectedApiary.id &&
          !this.occupiedHives.has(hive.value.id!),
      );
    } else {
      this.hivesOptions = [];
    }
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        name: this.form.controls.name.value,
        hive_id: this.form.controls.hive.value?.id!,
        is_alive: this.form.controls.is_alive.value,
      });
    }
  }
}
