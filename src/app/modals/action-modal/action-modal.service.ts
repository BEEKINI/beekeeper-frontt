import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActionModalComponent,
  ActionModalData,
} from './action-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ActionModalService {
  protected readonly dialog = inject(MatDialog);

  public open(data: ActionModalData): void {
    this.dialog.open(ActionModalComponent, {
      width: '400px',
      data,
      autoFocus: false,
      disableClose: true,
    });
  }
}
