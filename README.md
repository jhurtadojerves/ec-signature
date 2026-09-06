# ec-signature

## Setup

```bash
nvm use          # Node 24.20.0 (see .nvmrc)
corepack enable   # or: npm install -g pnpm@12.3.4 if corepack's pnpm shim doesn't work in your environment
pnpm install
```

## Scripts

- `pnpm run typecheck` — TypeScript strict type-check (`tsc --noEmit`)
- `pnpm run test` — run the test suite once
- `pnpm run test:coverage` — run tests with coverage (90% minimum on lines/functions/branches/statements)
- `pnpm run lint` — Biome lint check
- `pnpm run format` — Biome format (writes)

## Git hooks

Husky installs a `pre-commit` hook (lint-staged → typecheck → test:coverage) and a `commit-msg` hook (commitlint, Conventional Commits) automatically via `pnpm install`'s `prepare` script.
