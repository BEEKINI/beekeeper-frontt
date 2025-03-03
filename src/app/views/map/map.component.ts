import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import * as L from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { MapAddApiaryComponent } from '../../modals/map-add-apiary/map-add-apiary.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiariesModel, ApiariesQueries } from '../../queries/apiaries.queries';
import { of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MapService } from '../../services/map.service';
import {
  NotificationModel,
  NotificationService,
} from '../../service/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnInit {
  protected map: L.Map | null = null;
  protected readonly dialog = inject(MatDialog);
  protected readonly destroy = inject(DestroyRef);
  protected readonly apiariesQueries = inject(ApiariesQueries);
  protected readonly router = inject(Router);
  protected readonly mapService = inject(MapService);
  protected readonly notificationService = inject(NotificationService);

  protected notifications: NotificationModel[] = [];

  public ngOnInit(): void {
    this.notificationService.notifications
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((notifications) => {
        this.notifications = notifications;
      });

    this.notificationService
      .fetchNotifications()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((notifications) => {
        this.notifications = notifications;
        this.notificationService.startPolling();
      });
    this.destroy.onDestroy(() => {
      this.notificationService.stopPolling();
    });
  }

  public ngAfterViewInit(): void {
    this.initMap();
  }

  protected initMap(): void {
    setTimeout(() => {
      this.map = this.mapService.initMap();
      this.mapService.initTitle(this.map);

      this.map.on('click', (event: unknown) => {
        const { lat, lng } = (event as any).latlng;
        this.openDialog(lat, lng);
      });
      this.initMarkers();
    }, 1000);
  }

  protected initMarkers(): void {
    this.apiariesQueries
      .list()
      .pipe(
        takeUntilDestroyed(this.destroy),
        tap((apiaries) => {
          apiaries.forEach((apiary) => {
            this.mapService.addMarker(
              apiary.id!,
              apiary.latitude,
              apiary.longitude,
              apiary.name,
              this.map!,
              () => this.goToApiaryView(apiary.id!),
            );
          });
        }),
      )
      .subscribe();
  }

  protected openDialog(lat: number, lng: number): void {
    const dialogRef = this.dialog.open(MapAddApiaryComponent, {
      data: { lat, lng },
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroy),
        switchMap((result: ApiariesModel) => {
          if (result) {
            return this.apiariesQueries
              .create({
                latitude: lat,
                longitude: lng,
                name: result.name,
                hives: [],
              })
              .pipe(
                tap((created) => {
                  this.mapService.addMarker(
                    created.id!,
                    lat,
                    lng,
                    result.name,
                    this.map!,
                    () => this.goToApiaryView(created.id!),
                  );
                }),
              );
          }
          return of(undefined);
        }),
      )
      .subscribe();
  }

  protected goToApiaryView(id: number): void {
    this.router.navigateByUrl(`/dashboard/apiaries/${id}`);
  }

  protected deleteNotification(notifId: number): void {
    this.notificationService
      .deleteNotification(notifId)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(() => {
        this.notifications = this.notifications.filter(
          (notification) => notification.id !== notifId,
        );
      });
  }
}
