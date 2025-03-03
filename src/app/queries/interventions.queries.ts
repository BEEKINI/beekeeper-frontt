import { Injectable } from '@angular/core';
import { CompleteQueryService } from './complete-http-query.service';
import { QueryParams } from './read-only-http-query.service';
import { BASE_URL } from '../consts/consts';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InverventionModel {
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
  InverventionModel,
  QueryParams
> {
  protected static readonly URL = `${BASE_URL}/interventions`;

  public constructor(http: HttpClient) {
    super(http, InterventionQueries.URL);
  }

  public getForApiary(apiaryId: number): Observable<InverventionModel[]> {
    return this.http.get<InverventionModel[]>(
      `${InterventionQueries.URL}/apiary/${apiaryId}`,
    );
  }
}
