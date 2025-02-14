import type { Observable } from 'rxjs';
import type { HttpResponse } from '@angular/common/http';
import type { QueryParams } from './read-only-http-query.service';
import { ReadOnlyQueryService } from './read-only-http-query.service';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export abstract class ReadWriteQueryService<
  D,
  C,
  Q extends QueryParams,
> extends ReadOnlyQueryService<D, Q> {
  public create(dto: C): Observable<D> {
    return this.http.post<D>(this.url, dto, {
      headers: this.tokenService.getHeadersForRequest(),
    });
  }

  public update(id: number, dto: C): Observable<D> {
    return this.http.put<D>(`${this.url}/${id}`, dto, {
      headers: this.tokenService.getHeadersForRequest(),
    });
  }

  public delete(id: number): Observable<HttpResponse<null>> {
    return this.http.delete<null>(`${this.url}/${id}`, {
      observe: 'response',
      headers: this.tokenService.getHeadersForRequest(),
    });
  }
}
