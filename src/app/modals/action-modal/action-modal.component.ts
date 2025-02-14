import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { ButtonComponent } from '../../../app/shared/components/button/button.component';
import { MatDividerModule } from '@angular/material/divider';

export interface ActionModalData {
  elementLabel: string;
  callback: () => void;
}

@Component({
  selector: 'app-action-modal',
  standalone: true,
  imports: [ButtonComponent, MatDialogModule, MatDividerModule],
  templateUrl: './action-modal.component.html',
  styleUrl: './action-modal.component.scss',
})
export class ActionModalComponent {
  public constructor(
    protected dialogRef: MatDialogRef<ActionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActionModalData,
  ) {}

  protected close(): void {
    this.dialogRef.close();
  }

  protected confirm(): void {
    if (this.data.callback) {
      this.data.callback();
    }
    this.dialogRef.close();
  }
}
