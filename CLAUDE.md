# ec-signature

## Architecture

This project adopts **hexagonal architecture (ports & adapters)** in TypeScript, and follows **TypeScript strict mode** conventions.

- Use the `hexagonal-architecture` skill for every code change — not only architecture work — including new features, transport/SDK swaps, bug fixes, or small business-rule changes. Load it alongside TDD, never instead of it, and follow its "Before You Write Code" section before editing.
- Use the `typescript-strict` skill when writing TypeScript code, defining types or schemas, or reviewing type safety.

## Planning

- Use the `writing-plans` skill whenever there is a spec or requirements for a multi-step task, before touching code.

## Diagrams

- Use the `diagrams` skill whenever a diagram (sequence, state, hierarchy, dependency, or quantitative comparison) would be materially clearer than prose.

## Git

- Use the `semantic-commits` skill for every commit message (Conventional Commits: `type(scope): description`).
- Use the `git-workflow` skill when choosing a branching strategy, deciding merge vs rebase, or resolving conflicts.
- Never add Claude as co-author in commit messages (already enforced via `.claude/settings.local.json` `attribution.commit`).
