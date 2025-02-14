import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  protected markers = new Map<number, L.Marker>();
  public initMap(): L.Map {
    this.markers.clear();
    return L.map('map', {
      center: [45.7492, 4.8441],
      zoom: 13,
    });
  }

  public initTitle(map: L.Map): void {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      map,
    );
  }

  public addMarker(
    id: number,
    lat: number,
    lng: number,
    name: string,
    map: L.Map,
    callback?: () => void,
  ): void {
    const icon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const marker = L.marker([lat, lng], { icon })
      .addTo(map)
      .on('click', () => (callback ? callback() : null));
    this.markers.set(id, marker);
  }

  public removeMarker(id: number, map: L.Map): void {
    const marker = this.markers.get(id);
    if (marker) {
      map.removeLayer(marker);
      this.markers.delete(id);
    }
  }
}
