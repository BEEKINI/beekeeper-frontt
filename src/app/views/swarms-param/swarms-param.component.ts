import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SwarmParamsModalComponent } from '../../modals/swarm-params-modal/swarm-params-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwarmModel, SwarmQueries } from '../../queries/swarm.queries';
import { of, switchMap } from 'rxjs';
import { ActionModalService } from '../../modals/action-modal/action-modal.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-swarms-param',
  standalone: true,
  imports: [ButtonComponent, MatCardModule, MatIconModule],
  templateUrl: './swarms-param.component.html',
  styleUrl: './swarms-param.component.scss',
})
export class SwarmsParamComponent implements OnInit {
  protected readonly dialog = inject(MatDialog);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly swarmQueries = inject(SwarmQueries);
  protected readonly actionModal = inject(ActionModalService);

  protected swarms: SwarmModel[] = [];

  public ngOnInit(): void {
    this.refresh();
  }

  protected refresh(): void {
    this.swarmQueries
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.swarms = result;
      });
  }

  protected addSwarm(): void {
    this.openDialog('create');
  }

  protected editSwarm(swarm: SwarmModel): void {
    this.openDialog('edit', swarm);
  }

  protected deleteSwarm(swarm: SwarmModel): void {
    this.actionModal.open({
      elementLabel: swarm.name,
      callback: () =>
        this.swarmQueries
          .delete(swarm.id!)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.refresh();
          }),
    });
  }

  protected openDialog(mode: 'create' | 'edit', swarm?: SwarmModel): void {
    this.dialog
      .open(SwarmParamsModalComponent, {
        width: '400px',
        data: { mode, swarm },
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            if (mode === 'create') {
              return this.swarmQueries.create(result);
            } else {
              return this.swarmQueries.update(swarm?.id!, result);
            }
          }
          return of(undefined);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.refresh();
      });
  }
}
