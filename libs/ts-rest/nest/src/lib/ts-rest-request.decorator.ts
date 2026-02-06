import { AppRoute, ServerInferRequest } from '@ts-rest/core';
import type { Request } from 'express';

export type TsRestRequestShape<TRoute extends AppRoute> = ServerInferRequest<
  TRoute,
  Request['headers']
>;
