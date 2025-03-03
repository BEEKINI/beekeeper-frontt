import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SwarmStatesModel } from '../../queries/swarm.queries';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgClass } from '@angular/common';

export interface SensorStatesModalData {
  states: SwarmStatesModel[];
}

@Component({
  selector: 'app-sensor-states-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    ButtonComponent,
    MatCardModule,
    MatIconModule,
    DatePipe,
    NgClass,
  ],
  templateUrl: './sensor-states-modal.component.html',
  styleUrl: './sensor-states-modal.component.scss',
})
export class SensorStatesModalComponent {
  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: SensorStatesModalData,
    protected readonly dialogRef: MatDialogRef<SensorStatesModalComponent>,
  ) {}

  protected close(): void {
    this.dialogRef.close();
  }
}
