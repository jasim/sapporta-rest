# @sapporta/rest-core

Sapporta-maintained core contract and inference package forked from `@ts-rest/core` v4.

This package keeps the contract DSL and runtime/type helpers Sapporta uses, with Zod 4 plus Standard Schema-compatible core contracts such as Valibot and no-validator routes.

It includes `initClient`, the lightweight fetch-based client used by Sapporta UI code to call browser `fetch` from the same contracts used by the server.

Build with:

```bash
pnpm nx build sapporta-rest-core
```

Test with:

```bash
pnpm nx test sapporta-rest-core
```
