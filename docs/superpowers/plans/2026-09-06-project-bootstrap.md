# ec-signature Project Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the toolchain foundation for ec-signature — pinned Node LTS, latest stable TypeScript in strict mode, Biome for lint/format, Husky-driven git hooks enforcing Conventional Commits and a 90% test-coverage gate — validated end-to-end by one real shared-kernel module (a `Result` type).

**Architecture:** Hexagonal architecture (ports & adapters), per the `hexagonal-architecture` skill this project has adopted. No business capability exists yet, so this plan only lays shared-kernel code and tooling — not domain/adapter code, which arrives with the first real feature plan.

**Tech Stack:**
- Node **24.20.0** (LTS codename "Krypton", the actively-supported LTS as of 2026-09-06) via nvm
- TypeScript **7.0.2** (latest stable — the native/Go-ported compiler; strict mode)
- Biome **2.5.12** (lint + format, replacing ESLint/Prettier)
- Vitest **5.0.0** + `@vitest/coverage-v8` **5.0.0** (test runner + coverage)
- Husky **9.1.7**, commitlint **21.2.2** + `@commitlint/config-conventional` **21.2.2**, lint-staged **17.5.0** (git hooks)
- Package manager: pnpm **12.3.4**, enabled via Corepack (bundled with Node 24, no manual global install)

**Spec:** No separate spec document exists. Requirements were given directly in conversation on 2026-09-06: Node LTS via nvm, latest stable TypeScript, and pre-commit hooks for Biome, semantic commits, and tests with 90% coverage. They are captured verbatim below in Global Constraints.

## Global Constraints

- Node version: 24.20.0 exactly, pinned via `.nvmrc` and `package.json` `engines`.
- TypeScript version: 7.0.2, strict mode with every strictness flag the `typescript-strict` / `typescript-best-practices` skills call for (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`).
- Coverage threshold: 90% minimum on lines, functions, branches, and statements — enforced in `vitest.config.ts` AND re-run in the pre-commit hook.
- Commit messages: Conventional Commits, enforced by commitlint on every commit via a `commit-msg` hook.
- Linting/formatting: Biome only — no ESLint, no Prettier.
- Never commit directly to `main` — all work happens on `feature/project-bootstrap` (per the user's rule, documented in `CLAUDE.md` and the `git-workflow` skill's GitHub Flow).
- Package manager: pnpm 12.3.4 via Corepack; `pnpm-lock.yaml` is committed.

**A note on TDD ordering:** Tasks 1–2 are necessarily config-first — there is no test runner yet to write a failing test against. Task 3 installs the test harness itself and retroactively proves the Task 2 kernel module with real tests (not a placeholder). From the first real feature plan onward, use true test-first TDD per the `test-driven-development` skill.

---

### Task 1: Node version pin, feature branch, and package.json baseline

**Files:**
- Create: `.nvmrc`
- Create: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `package.json` with `name: "ec-signature"`, `type: "module"`, `engines.node: ">=24.20.0 <25.0.0"`, `packageManager: "pnpm@12.3.4"`, `scripts: {}` (later tasks add scripts).

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b feature/project-bootstrap
```

Expected: `Switched to a new branch 'feature/project-bootstrap'`

- [ ] **Step 2: Pin the Node version**

Create `.nvmrc`:

```
24.20.0
```

- [ ] **Step 3: Install and switch to that Node version**

```bash
nvm install 24.20.0
nvm use 24.20.0
node -v
```

Expected: `v24.20.0`

- [ ] **Step 4: Enable Corepack and pin pnpm**

```bash
corepack enable
corepack use pnpm@12.3.4
pnpm -v
```

Expected: `12.3.4`

- [ ] **Step 5: Initialize package.json**

```bash
pnpm init
```

Then replace its content with:

```json
{
  "name": "ec-signature",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=24.20.0 <25.0.0"
  },
  "packageManager": "pnpm@12.3.4",
  "scripts": {}
}
```

- [ ] **Step 6: Extend .gitignore**

Replace `.gitignore` content with (keeps the existing entry, adds tooling output):

```
.claude/settings.local.json
node_modules/
dist/
coverage/
```

- [ ] **Step 7: Verify**

```bash
node -v && pnpm -v && cat package.json
```

Expected: `v24.20.0`, `12.3.4`, and the package.json content above.

- [ ] **Step 8: Commit**

```bash
git add .nvmrc package.json .gitignore
git commit -m "chore: pin Node 24.20.0 LTS and pnpm 12.3.4, initialize package.json"
```

---

### Task 2: TypeScript strict configuration + shared-kernel Result type

**Files:**
- Create: `tsconfig.json`
- Create: `src/shared/kernel/result.ts`
- Modify: `package.json` (add `typecheck` script and `typescript` devDependency)

**Interfaces:**
- Consumes: `package.json` from Task 1 (adds to its `scripts`, does not replace it).
- Produces: `Result<T, E>` discriminated union; `ok<T>(value: T): Result<T, never>`; `err<E>(error: E): Result<never, E>`; `isOk<T, E>(result: Result<T, E>): result is { status: "ok"; value: T }`; `isErr<T, E>(result: Result<T, E>): result is { status: "error"; error: E }`. Future features import these from `src/shared/kernel/result.ts`.

- [ ] **Step 1: Install TypeScript**

```bash
pnpm add -D typescript@7.0.2
```

- [ ] **Step 2: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

- [ ] **Step 3: Write the Result kernel module**

`src/shared/kernel/result.ts`:

```typescript
export type Result<T, E> =
  | { readonly status: "ok"; readonly value: T }
  | { readonly status: "error"; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { status: "ok", value };
}

export function err<E>(error: E): Result<never, E> {
  return { status: "error", error };
}

export function isOk<T, E>(result: Result<T, E>): result is { status: "ok"; value: T } {
  return result.status === "ok";
}

export function isErr<T, E>(result: Result<T, E>): result is { status: "error"; error: E } {
  return result.status === "error";
}
```

- [ ] **Step 4: Add the typecheck script**

Update `package.json`'s `scripts` to:

```json
"scripts": {
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 5: Run typecheck**

```bash
pnpm run typecheck
```

Expected: no output, exit code 0.

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json src/shared/kernel/result.ts package.json pnpm-lock.yaml
git commit -m "feat(kernel): add Result type and strict TypeScript config"
```

---

### Task 3: Vitest with a 90% coverage gate, testing the Result kernel

**Files:**
- Create: `vitest.config.ts`
- Create: `src/shared/kernel/result.test.ts`
- Modify: `package.json` (add `test`/`test:coverage` scripts and devDependencies)

**Interfaces:**
- Consumes: `ok`, `err`, `isOk`, `isErr` from `src/shared/kernel/result.ts` (Task 2).
- Produces: none new (test infrastructure only).

- [ ] **Step 1: Install Vitest and the coverage provider**

```bash
pnpm add -D vitest@5.0.0 @vitest/coverage-v8@5.0.0
```

- [ ] **Step 2: Write vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
```

- [ ] **Step 3: Write the Result test**

`src/shared/kernel/result.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { err, isErr, isOk, ok } from "./result";

describe("Result", () => {
  it("ok() produces a status 'ok' result carrying the value", () => {
    const result = ok(42);
    expect(result).toEqual({ status: "ok", value: 42 });
  });

  it("err() produces a status 'error' result carrying the error", () => {
    const result = err("boom");
    expect(result).toEqual({ status: "error", error: "boom" });
  });

  it("isOk() narrows an ok result to true", () => {
    expect(isOk(ok(1))).toBe(true);
  });

  it("isOk() returns false for an error result", () => {
    expect(isOk(err("boom"))).toBe(false);
  });

  it("isErr() narrows an error result to true", () => {
    expect(isErr(err("boom"))).toBe(true);
  });

  it("isErr() returns false for an ok result", () => {
    expect(isErr(ok(1))).toBe(false);
  });
});
```

- [ ] **Step 4: Add test scripts**

Update `package.json`'s `scripts` to:

```json
"scripts": {
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

- [ ] **Step 5: Run tests with coverage**

```bash
pnpm run test:coverage
```

Expected: `6 passed`, coverage summary at 100% for `src/shared/kernel/result.ts` (comfortably above the 90% gate), exit code 0.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts src/shared/kernel/result.test.ts package.json pnpm-lock.yaml
git commit -m "test(kernel): add Result unit tests with 90% coverage gate"
```

---

### Task 4: Biome lint + format

**Files:**
- Create: `biome.json`
- Modify: `package.json` (add `lint`/`format` scripts and devDependency)

**Interfaces:** none (tooling only).

- [ ] **Step 1: Install Biome**

```bash
pnpm add -D @biomejs/biome@2.5.12
```

- [ ] **Step 2: Write biome.json**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.12/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error"
      },
      "style": {
        "noEnum": "error",
        "useImportType": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all"
    }
  }
}
```

- [ ] **Step 3: Add lint/format scripts**

Update `package.json`'s `scripts` to:

```json
"scripts": {
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:coverage": "vitest run --coverage",
  "lint": "biome check .",
  "format": "biome format --write ."
}
```

- [ ] **Step 4: Run lint**

```bash
pnpm run lint
```

Expected: `Checked N files. No fixes applied.` exit code 0 (existing files already conform).

- [ ] **Step 5: Commit**

```bash
git add biome.json package.json pnpm-lock.yaml
git commit -m "chore(tooling): add Biome for lint and format"
```

---

### Task 5: commitlint — enforce Conventional Commits

**Files:**
- Create: `commitlint.config.js`
- Modify: `package.json` (devDependencies)

**Interfaces:** none.

- [ ] **Step 1: Install commitlint**

```bash
pnpm add -D @commitlint/cli@21.2.2 @commitlint/config-conventional@21.2.2
```

- [ ] **Step 2: Write commitlint.config.js**

```javascript
export default {
  extends: ["@commitlint/config-conventional"],
};
```

- [ ] **Step 3: Verify a compliant message passes**

```bash
echo "feat: add example" | pnpm exec commitlint
```

Expected: no output, exit code 0.

- [ ] **Step 4: Verify a non-compliant message fails**

```bash
echo "bad message" | pnpm exec commitlint
```

Expected: exit code 1, output listing `subject-empty`/`type-empty` errors.

- [ ] **Step 5: Commit**

```bash
git add commitlint.config.js package.json pnpm-lock.yaml
git commit -m "chore(tooling): add commitlint with Conventional Commits config"
```

---

### Task 6: Husky git hooks — wire Biome + typecheck + coverage + commitlint

**Files:**
- Create: `.husky/pre-commit`
- Create: `.husky/commit-msg`
- Modify: `package.json` (add `prepare` script and `lint-staged` config, devDependencies)

**Interfaces:** none.

- [ ] **Step 1: Install husky and lint-staged**

```bash
pnpm add -D husky@9.1.7 lint-staged@17.5.0
```

- [ ] **Step 2: Initialize husky**

```bash
pnpm exec husky init
```

This creates `.husky/pre-commit` with default placeholder content and adds `"prepare": "husky"` to `package.json`'s `scripts`.

- [ ] **Step 3: Add lint-staged config**

Add this top-level key to `package.json` (sibling of `scripts`):

```json
"lint-staged": {
  "*.{ts,js,json}": ["biome check --write --no-errors-on-unmatched"]
}
```

- [ ] **Step 4: Replace .husky/pre-commit content**

```bash
pnpm exec lint-staged
pnpm run typecheck
pnpm run test:coverage
```

- [ ] **Step 5: Write .husky/commit-msg**

```bash
pnpm exec commitlint --edit "$1"
```

- [ ] **Step 6: Make hooks executable**

```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

- [ ] **Step 7: Verify pre-commit blocks bad code**

```bash
echo 'var x = 1;' > src/scratch.ts
git add src/scratch.ts
git commit -m "test: scratch"
```

Expected: commit rejected — Biome reports a `noVar` violation.

Clean up:

```bash
git reset HEAD src/scratch.ts
rm src/scratch.ts
```

- [ ] **Step 8: Verify commit-msg blocks a non-conventional message**

```bash
git add package.json
git commit -m "bad message"
```

Expected: rejected by commitlint with `subject-empty`/`type-empty` errors.

```bash
git reset HEAD package.json
```

- [ ] **Step 9: Commit the real setup**

```bash
git add .husky package.json pnpm-lock.yaml
git commit -m "chore(tooling): wire Husky pre-commit (biome+typecheck+coverage) and commit-msg (commitlint)"
```

Expected: `lint-staged`, `typecheck`, and `test:coverage` all run and pass; commitlint accepts the message; commit succeeds.

---

## Self-Review

**1. Spec coverage:** Node LTS via nvm → Task 1. Latest stable TypeScript → Task 2. Biome pre-commit → Task 4 + Task 6. Semantic-commits pre-commit → Task 5 + Task 6. Tests with 90% coverage pre-commit → Task 3 + Task 6. All four requirements have a task producing a testable deliverable.

**2. Placeholder scan:** No "TBD"/"add error handling"/"similar to Task N" patterns — every step shows the literal file content or command, including full `package.json` script blocks per step (not diffs), so each task is readable standalone.

**3. Type consistency:** `Result<T, E>`, `ok`, `err`, `isOk`, `isErr` are defined once in Task 2 and consumed with identical names/signatures in Task 3's test — no drift.

## Next Steps After This Plan

No git remote is configured yet. Once `feature/project-bootstrap` is complete:
1. Create the remote (e.g., a GitHub repo) and `git remote add origin <url>`.
2. `git push -u origin feature/project-bootstrap`.
3. Open a PR into `main` (per the `git-workflow` GitHub Flow this project uses) — do not merge directly.
