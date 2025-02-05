import type { HttpClient, HttpParams } from '@angular/common/http';

import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  protected constructor(
    protected readonly http: HttpClient,
    protected readonly url: string,
  ) {}

  public count(params?: Q | HttpParams): Observable<number> {
    return this.http
      .head(this.url, {
        observe: RESPONSE,
        params,
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
      })
      .pipe(
        map((response) => {
          return response.body! as D[];
        }),
      );
  }

  public read(id: number): Observable<D> {
    return this.http.get<D>(`${this.url}/${id}`);
  }
}
