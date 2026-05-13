# sapporta-rest

`sapporta-rest` is a Sapporta-maintained fork of the `v4` branch of [`ts-rest`](https://github.com/ts-rest/ts-rest).

The upstream `ts-rest` project remains the canonical general-purpose project and documentation source. Use the upstream documentation at <https://ts-rest.com> for the broad contract DSL model, then account for the narrower Sapporta package surface described here.

## Packages

This repository publishes two public npm packages:

- `@sapporta/rest-core`
- `@sapporta/rest-open-api`

The package versions track the upstream `ts-rest` v4 versioning line.

## Scope

This fork keeps the contract DSL, inference helpers, runtime helpers, client helpers, route traversal, and OpenAPI generation used by Sapporta. It intentionally removes framework adapters and OpenAPI validator branches Sapporta does not use.

Supported:

- Zod 4 schemas
- Standard Schema-compatible core contracts, including Valibot and no-validator contracts
- `initContract`
- `initClient`
- the lightweight fetch-based browser/client API from core, returning `{ status, body }`
- core route and response inference types
- `generateOpenApi`
- `generateOpenApiAsync`
- caller-provided Zod 4 schema transformers, including transformers based on `z.toJSONSchema`

Not supported:

- Zod 3
- `@anatine/zod-openapi`
- non-Zod OpenAPI schema transformation
- Express, Fastify, Nest, Next, Serverless, React Query, Solid Query, or Vue Query adapters
- Prisma integration
- upstream docs app and examples
- upstream multi-validator test projects

## Browser Client

Sapporta UI code can import `initClient` from `@sapporta/rest-core` and call browser `fetch` through the same contracts used by the server:

```ts
import { initClient } from '@sapporta/rest-core';

const client = initClient(contract, {
  baseUrl: 'http://localhost:3000',
});

const result = await client.getPokemon({
  params: { id: '1' },
});
```

The removed client packages are framework/query-cache adapters such as React Query, Vue Query, and Solid Query. They are separate from the core fetch client and are not required for Sapporta's browser contract calls.

## OpenAPI

`@sapporta/rest-open-api` does not ship a default Anatine transformer. Callers must pass a schema transformer:

```ts
import { generateOpenApi } from '@sapporta/rest-open-api';
import { z } from 'zod';

const zodV4SchemaTransformer = ({ schema }) => {
  if (!schema || typeof schema !== 'object' || !('_zod' in schema)) {
    return null;
  }

  const { $schema, ...jsonSchema } = z.toJSONSchema(schema);
  return jsonSchema;
};

const document = generateOpenApi(router, apiDoc, {
  schemaTransformer: zodV4SchemaTransformer,
});
```

## License And Upstream Credit

This fork preserves the upstream MIT license. The original project is [`ts-rest`](https://github.com/ts-rest/ts-rest), and its documentation is available at <https://ts-rest.com>.
