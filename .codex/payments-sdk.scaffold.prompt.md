# Payments SDK Package

You are building a TypeScript SDK for Fanno Payments. Scaffold:

- `src/index.ts` exporting:
  - A `createPaymentsClient(config)` factory.
  - Methods `createCheckoutSession(...)` and `handleWebhook(body)`.
- Zod models under `src/models/` for `SessionRequest`, `SessionResponse`, `WebhookEvent`.
- `package.json` entries:
  - `"main": "dist/index.js"`, `"types": "dist/index.d.ts"`.
  - `build` script to run `tsc`.
- A `README.md` with usage examples.

Output TypeScript code only under `src/` and `package.json` changes.