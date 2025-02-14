import { Component, Inject } from '@angular/core';
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
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BEE_QUEEN_COLOR } from '../../consts/bee-queen-color.const';
import { HiveModel } from '../../queries/hive.queries';

export interface MapAddHiveForm {
  name: FormControl<string>;
  sensorId: FormControl<string>;
  beeQueenColor: FormControl<string>;
  inUse: FormControl<boolean>;
}

export interface MapAddHiveDataInput {
  lat: number;
  lng: number;
  mode: 'create' | 'edit';
  hive?: HiveModel;
}

@Component({
  selector: 'app-map-add-hive',
  standalone: true,
  imports: [
    MatDialogModule,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './map-add-hive.component.html',
  styleUrl: './map-add-hive.component.scss',
})
export class MapAddHiveComponent {
  protected readonly title =
    this.data.mode === 'create' ? 'Ajouter une ruche' : 'Modifier une ruche';

  protected readonly form = new FormGroup<MapAddHiveForm>({
    name: new FormControl(this.data.hive ? this.data.hive.name : '', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    sensorId: new FormControl(this.data.hive ? this.data.hive.sensor_id : '', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    beeQueenColor: new FormControl(
      this.data.hive ? this.data.hive.bee_queen_color : '',
      {
        validators: [Validators.required],
        nonNullable: true,
      },
    ),
    inUse: new FormControl(this.data.hive ? this.data.hive.in_use : false, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  protected readonly beeQueenColorOptions: SelectOptionModel<string>[] =
    BEE_QUEEN_COLOR.map((color) => {
      return {
        value: color,
        label: color,
      };
    });

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: MapAddHiveDataInput,
    protected readonly dialogRef: MatDialogRef<MapAddHiveComponent>,
  ) {
    console.log(data);
  }

  protected showSwarmHistory(): void {
    // todo
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }
}
