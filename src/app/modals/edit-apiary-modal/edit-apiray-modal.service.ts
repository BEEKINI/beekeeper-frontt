import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  EditApiaryModalComponent,
  EditApiaryModel,
} from './edit-apiary-modal.component';

@Injectable({
  providedIn: 'root',
})
export class EditApiaryModalService {
  protected readonly dialog = inject(MatDialog);

  public open(
    data: EditApiaryModel,
  ): MatDialogRef<EditApiaryModalComponent, any> {
    return this.dialog.open(EditApiaryModalComponent, {
      width: '400px',
      data,
      autoFocus: false,
      disableClose: true,
    });
  }
}
