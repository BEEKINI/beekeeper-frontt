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
import { DarwinModuleModalComponent } from '../../modals/darwin-module-modal/darwin-module-modal.component';
import { ActionModalComponent } from '../../modals/action-modal/action-modal.component';

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
      label: `Etes-vous sur de vouloir supprimer ${swarm.name} ?`,
      colorAction: 'danger',
      labelAction: 'Supprimer',
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

  protected showHistory(swarmId: number): void {
    this.dialog
      .open(DarwinModuleModalComponent, {
        width: '400px',
        disableClose: true,
        data: { swarmId },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected cloneSwarm(swarmId: number): void {
    const swarm = this.swarms.find((s) => s.id === swarmId)!;
    this.actionModal.open({
      label: `Vous êtes sur le point de cloner  ${swarm.name}`,
      colorAction: 'primary',
      labelAction: 'Cloner',
      callback: () =>
        this.swarmQueries
          .clone(swarmId, {
            ...swarm,
            name: `${swarm.name} - clone`,
          })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.refresh();
          }),
    });
  }
}
