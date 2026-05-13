import { SchemaObject } from 'openapi3-ts';
import { z } from 'zod';
import { SchemaTransformerAsync, SchemaTransformerSync } from '../types';

const stripJsonSchemaMetadata = (schema: unknown): SchemaObject => {
  if (!schema || typeof schema !== 'object') {
    return schema as SchemaObject;
  }

  const { $schema, ...rest } = schema as Record<string, unknown>;
  return rest as SchemaObject;
};

export const zodV4SchemaTransformer: SchemaTransformerSync = ({ schema }) => {
  if (!schema || typeof schema !== 'object' || !('_zod' in schema)) {
    return null;
  }

  return stripJsonSchemaMetadata(z.toJSONSchema(schema as z.ZodTypeAny));
};

export const ZOD_SYNC = zodV4SchemaTransformer;

export const ZOD_ASYNC: SchemaTransformerAsync = async (args) => {
  return zodV4SchemaTransformer(args);
};
