import { Injectable } from '@angular/core';
import { CompleteQueryService } from './complete-http-query.service';
import { QueryParams } from './read-only-http-query.service';
import { BASE_URL } from '../consts/consts';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface InterventionModel {
  id: number;
  name: string;
  description: string;
  date: string;
  apiaryId: number;
}

@Injectable({
  providedIn: 'root',
})
export class InterventionQueries extends CompleteQueryService<
  InterventionModel,
  QueryParams
> {
  protected static readonly URL = `${BASE_URL}/interventions`;

  public constructor(http: HttpClient) {
    super(http, InterventionQueries.URL);
  }

  public getForApiary(apiaryId: number): Observable<InterventionModel[]> {
    return this.http
      .get<{ interventions: InterventionModel[] }>(
        `${InterventionQueries.URL}/all/${apiaryId}`,
        {
          headers: this.tokenService.getHeadersForRequest(),
        },
      )
      .pipe(
        map((response) => {
          return response.interventions;
        }),
      );
  }
}
