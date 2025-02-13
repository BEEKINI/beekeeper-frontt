import { Injectable } from '@angular/core';
import { CompleteQueryService } from './complete-http-query.service';
import { QueryParams } from './read-only-http-query.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../consts/consts';

export interface ApiariesModel {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiariesQueries extends CompleteQueryService<
  ApiariesModel,
  QueryParams
> {
  protected static readonly URL = `${BASE_URL}/apiaries`;

  public constructor(http: HttpClient) {
    super(http, ApiariesQueries.URL);
  }
}
