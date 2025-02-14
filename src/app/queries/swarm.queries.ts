import { Injectable } from '@angular/core';
import { CompleteQueryService } from './complete-http-query.service';
import { HiveModel } from './hive.queries';
import { QueryParams } from './read-only-http-query.service';
import { BASE_URL } from '../consts/consts';
import { HttpClient } from '@angular/common/http';

export interface SwarmModel {
  id?: number;
  name: string;
  hive: HiveModel;
  is_alive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SwarmQueries extends CompleteQueryService<
  SwarmModel,
  QueryParams
> {
  protected static readonly URL = `${BASE_URL}/swarms`;

  public constructor(http: HttpClient) {
    super(http, SwarmQueries.URL);
  }
}
