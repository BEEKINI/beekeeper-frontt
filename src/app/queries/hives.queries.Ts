import { Injectable } from "@angular/core";
import { CompleteQueryService } from "./complete-http-query.service";
import { QueryParams } from "./read-only-http-query.service";
import { HttpClient } from "@angular/common/http";
import { BASE_URL } from "../consts/consts";

export interface HivesModel {
  id?: number;
  apiary_id: number;
  name: string;
  installation_date: string;
  in_use: boolean;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: "root",
})
export class HivesQueries extends CompleteQueryService<
  HivesModel,
  QueryParams
> {
  protected static readonly URL = `${BASE_URL}/hives`;

  public constructor(http: HttpClient) {
    super(http, HivesQueries.URL);
  }
}
