import type { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';

import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

export type DataSourceFilters = Record<
  string,
  string | number | boolean | ReadonlyArray<string | number | boolean>
>;

export type QueryParams = DataSourceFilters & {
  orderBy?: string | ReadonlyArray<string>;
  offset?: number;
  limit?: number;
};

const TOTAL_COUNT = 'total-count';
const RESPONSE = 'response';

export abstract class ReadOnlyQueryService<D, Q extends QueryParams> {
  protected readonly tokenService = inject(TokenService);

  protected constructor(
    protected readonly http: HttpClient,
    protected readonly url: string,
  ) {}

  public count(params?: Q | HttpParams): Observable<number> {
    return this.http
      .head(this.url, {
        observe: RESPONSE,
        params,
        headers: this.tokenService.getHeadersForRequest(),
      })
      .pipe(
        map((response) => {
          return parseInt(response.headers.get(TOTAL_COUNT)!, 10);
        }),
      );
  }

  public list(params?: Q | HttpParams): Observable<D[]> {
    return this.http
      .get<D>(this.url, {
        observe: RESPONSE,
        params,
        headers: this.tokenService.getHeadersForRequest(),
      })
      .pipe(
        map((response) => {
          return response.body! as D[];
        }),
      );
  }

  public read(id: number): Observable<D> {
    return this.http.get<D>(`${this.url}/${id}`, {
      headers: this.tokenService.getHeadersForRequest(),
    });
  }
}
