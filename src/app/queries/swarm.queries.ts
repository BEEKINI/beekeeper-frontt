import { Injectable } from '@angular/core';
import { CompleteQueryService } from './complete-http-query.service';
import { HiveModel } from './hive.queries';
import { QueryParams } from './read-only-http-query.service';
import { BASE_URL } from '../consts/consts';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SwarmStatesModel {
  activity_level: string;
  alert: boolean;
  co2_level: number;
  created_at: string;
  detected_state: string;
  humidity: number;
  id: number;
  sound_level: number;
  sound_signature: string;
  swarm_id: number;
  temperature: number;
  updated_at: string;
  vibration_level: number;
  weight: number;
}

export interface SwarmModel {
  id?: number;
  name: string;
  hive: HiveModel;
  is_alive: boolean;
  states: SwarmStatesModel[];
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

  public clone(originSwarmId: number, swarm: SwarmModel): Observable<void> {
    return this.http.post<void>(
      `${SwarmQueries.URL}/clone/${originSwarmId}`,
      swarm,
      {
        headers: this.tokenService.getHeadersForRequest(),
      },
    );
  }

  public getSwarmHistory(swarmId: number): Observable<SwarmModel[]> {
    return this.http.get<SwarmModel[]>(
      `${SwarmQueries.URL}/${swarmId}/ascendant`,
      {
        headers: this.tokenService.getHeadersForRequest(),
      },
    );
  }
}
