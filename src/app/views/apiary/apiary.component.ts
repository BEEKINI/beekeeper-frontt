import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ApiariesModel, ApiariesQueries } from '../../queries/apiaries.queries';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ActionModalService } from '../../modals/action-modal/action-modal.service';
import { EditApiaryModalService } from '../../modals/edit-apiary-modal/edit-apiray-modal.service';
import { MapService } from '../../services/map.service';
import { MatCardModule } from '@angular/material/card';
import { MapAddHiveComponent } from '../../modals/map-add-hive/map-add-hive.component';
import { MatDialog } from '@angular/material/dialog';
import { HiveModel, HiveQueries } from '../../queries/hive.queries';
import { of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-apiary',
  standalone: true,
  imports: [
    MatDividerModule,
    MatIconModule,
    ButtonComponent,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './apiary.component.html',
  styleUrl: './apiary.component.scss',
})
export class ApiaryComponent implements OnInit, AfterViewInit {
  protected map: L.Map | null = null;
  protected readonly apiariesQueries = inject(ApiariesQueries);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly actionModal = inject(ActionModalService);
  protected readonly editApiaryModal = inject(EditApiaryModalService);
  protected readonly router = inject(Router);
  protected readonly mapService = inject(MapService);
  protected readonly dialog = inject(MatDialog);
  protected readonly hiveQueries = inject(HiveQueries);

  protected apiary!: ApiariesModel;

  public ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const apiaryId = +params.get('id')!;

        this.apiariesQueries
          .read(apiaryId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((apiary) => {
            this.apiary = apiary;
          });
      });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.map = this.mapService.initMap();
      this.mapService.initTitle(this.map);

      this.map.on('click', (event: unknown) => {
        const { lat, lng } = (event as any).latlng;
        this.openDialog(lat, lng, 'create');
      });
      this.initMarkers();
    }, 1000);
  }

  protected openDialog(
    lat: number,
    lng: number,
    mode: 'create' | 'edit',
    hive?: HiveModel,
  ): void {
    this.dialog
      .open(MapAddHiveComponent, {
        data: { lat: Number(lat), lng: Number(lng), mode, hive },
        disableClose: true,
        width: '500px',
      })
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            const object: HiveModel = {
              apiary_id: this.apiary.id!,
              bee_queen_color: result.beeQueenColor,
              name: result.name,
              sensor_id: result.sensorId,
              in_use: result.inUse,
              installation_date:
                mode === 'create'
                  ? new Date().toISOString()
                  : hive?.installation_date!,
              latitude: lat,
              longitude: lng,
            };
            if (mode === 'edit') {
              return this.hiveQueries.update(hive!.id!, object).pipe(
                tap((updated) => {
                  this.mapService.removeMarker(hive!.id!, this.map!);
                  this.mapService.addMarker(
                    result.id!,
                    lat,
                    lng,
                    result.name,
                    this.map!,
                  );

                  const index = this.apiary.hives?.findIndex(
                    (h) => h.id === hive!.id,
                  );
                  this.apiary.hives![index!] = updated;
                }),
              );
            } else {
              return this.hiveQueries.create(object).pipe(
                tap((created) => {
                  this.mapService.addMarker(
                    created.id!,
                    lat,
                    lng,
                    created.name,
                    this.map!,
                  );
                  this.apiary.hives?.push(created);
                }),
              );
            }
          }
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected initMarkers(): void {
    this.apiary.hives?.forEach((hive) => {
      this.mapService.addMarker(
        hive.id!,
        hive.latitude,
        hive.longitude,
        hive.name,
        this.map!,
      );
    });
  }

  protected editApiary(): void {
    this.editApiaryModal.open({
      name: this.apiary.name,
      hives: this.apiary.hives ?? [],
    });
  }

  protected deleteApiary(): void {
    this.actionModal.open({
      elementLabel: this.apiary.name,
      callback: () => {
        this.apiariesQueries
          .delete(this.apiary.id!)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(['/dashboard/apiaries']);
          });
      },
    });
  }

  protected editHive(id: number): void {
    const hive = this.apiary.hives?.find((h) => h.id === id);
    this.openDialog(hive!.latitude, hive!.longitude, 'edit', hive);
  }

  protected deleteHive(id: number): void {
    this.actionModal.open({
      elementLabel: this.apiary.hives?.find((h) => h.id === id)?.name!,
      callback: () => {
        this.hiveQueries
          .delete(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.apiary.hives = this.apiary.hives?.filter((h) => h.id !== id);
            this.mapService.removeMarker(id, this.map!);
          });
      },
    });
  }
}
