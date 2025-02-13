import type { QueryParams } from './read-only-http-query.service';
import { ReadWriteQueryService } from './read-write-http-query.service';

export abstract class CompleteQueryService<
  D,
  Q extends QueryParams,
> extends ReadWriteQueryService<D, D, Q> {}
