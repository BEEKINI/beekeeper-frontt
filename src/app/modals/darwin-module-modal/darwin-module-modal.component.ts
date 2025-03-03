import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SwarmModel, SwarmQueries } from '../../queries/swarm.queries';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';

interface DarwinModuleInput {
  swarmId: number;
}

@Component({
  selector: 'app-darwin-module-modal',
  standalone: true,
  imports: [MatDialogModule, ButtonComponent, MatCardModule, NgClass],
  templateUrl: './darwin-module-modal.component.html',
  styleUrl: './darwin-module-modal.component.scss',
})
export class DarwinModuleModalComponent implements OnInit {
  protected readonly swarmQueries = inject(SwarmQueries);
  protected readonly destroyRef = inject(DestroyRef);

  protected swarms: SwarmModel[] = [];

  public constructor(
    protected dialogRef: MatDialogRef<DarwinModuleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DarwinModuleInput,
  ) {}

  public ngOnInit(): void {
    this.swarmQueries
      .getSwarmHistory(this.data.swarmId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.swarms = result;
      });
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
