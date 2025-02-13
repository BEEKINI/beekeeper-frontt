import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import * as L from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { MapAddApiaryComponent } from '../../modals/map-add-apiary/map-add-apiary.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiariesModel, ApiariesQueries } from '../../queries/apiaries.queries';
import { of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  protected map: L.Map | null = null;
  protected readonly dialog = inject(MatDialog);
  protected readonly destroy = inject(DestroyRef);
  protected readonly apiariesQueries = inject(ApiariesQueries);
  protected readonly router = inject(Router);

  public ngAfterViewInit(): void {
    this.initMap();
  }

  protected initMap(): void {
    setTimeout(() => {
      this.map = L.map('map', {
        center: [45.7492, 4.8441],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
        this.map,
      );

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
            this.addMarker(
              apiary.id!,
              apiary.latitude,
              apiary.longitude,
              apiary.name,
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
              .create({ latitude: lat, longitude: lng, name: result.name })
              .pipe(
                tap((created) => {
                  this.addMarker(created.id!, lat, lng, result.name);
                }),
              );
          }
          return of(undefined);
        }),
      )
      .subscribe();
  }

  protected addMarker(
    id: number,
    lat: number,
    lng: number,
    name: string,
  ): void {
    const icon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.marker([lat, lng], { icon })
      .addTo(this.map as L.Map)
      .on('click', () => this.goToApiaryView(id));
  }

  protected goToApiaryView(id: number): void {
    this.router.navigateByUrl(`/dashboard/apiaries/${id}`);
  }
}
