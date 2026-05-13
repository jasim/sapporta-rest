import { z } from 'zod';
import { getQueryParameterSchema } from './query-params';
import { ZOD_SYNC, ZOD_ASYNC } from './test-helpers';

describe('query-params', () => {
  describe('zod', () => {
    it('sync - single required param ', async () => {
      const res = getQueryParameterSchema.sync({
        transformSchema: ZOD_SYNC,
        appRoute: {
          method: 'GET',
          path: '/',
          query: z.object({
            name: z.string(),
          }),
          responses: {
            200: z.object({
              name: z.string(),
            }),
          },
        },
        id: 'testFunc',
        concatenatedPath: 'testFunc',
      });

      expect(res).toEqual([
        {
          name: 'name',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ]);
    });

    it('sync - single optional param', async () => {
      const res = getQueryParameterSchema.sync({
        transformSchema: ZOD_SYNC,
        appRoute: {
          method: 'GET',
          path: '/',
          query: z.object({
            name: z.string().optional(),
          }),
          responses: {
            200: z.object({
              name: z.string(),
            }),
          },
        },
        id: 'testFunc',
        concatenatedPath: 'testFunc',
      });

      expect(res).toEqual([
        {
          name: 'name',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
      ]);
    });

    it('async - single required param ', async () => {
      const res = await getQueryParameterSchema.async({
        transformSchema: ZOD_ASYNC,
        appRoute: {
          method: 'GET',
          path: '/',
          query: z.object({
            name: z.string(),
          }),
          responses: {
            200: z.object({
              name: z.string(),
            }),
          },
        },
        id: 'testFunc',
        concatenatedPath: 'testFunc',
      });

      expect(res).toEqual([
        {
          name: 'name',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ]);
    });

    it('async - single optional param', async () => {
      const result = await getQueryParameterSchema.async({
        transformSchema: ZOD_ASYNC,
        appRoute: {
          method: 'GET',
          path: '/',
          query: z.object({
            name: z.string().optional(),
          }),
          responses: {
            200: z.object({
              name: z.string(),
            }),
          },
        },
        id: 'testFunc',
        concatenatedPath: 'testFunc',
      });

      expect(result).toEqual([
        {
          name: 'name',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
      ]);
    });
  });
});
