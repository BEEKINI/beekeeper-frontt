import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../consts/consts';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

export interface HoneyProdModel {
  id: number;
  value: number;
  apiary_id: number;
  created_at: string;
  updated_at: string;
}

export interface HoneyProductionApiary {
  honey_production: HoneyProdModel[];
}

@Injectable({
  providedIn: 'root',
})
export class HoneyProdQueries {
  protected readonly tokenService = inject(TokenService);
  protected readonly httpClient = inject(HttpClient);

  public declareProduction(
    qty: number,
    apiaryId: number,
  ): Observable<HoneyProdModel> {
    return this.httpClient.post<HoneyProdModel>(
      `${BASE_URL}/honey-prod`,
      {
        value: qty,
        apiary_id: apiaryId,
      },
      {
        headers: this.tokenService.getHeadersForRequest(),
      },
    );
  }

  public getProductionForApiary(
    apiary: number,
  ): Observable<HoneyProductionApiary> {
    return this.httpClient.get<HoneyProductionApiary>(
      `${BASE_URL}/honey-prod/${apiary}`,
      {
        headers: this.tokenService.getHeadersForRequest(),
      },
    );
  }
}
