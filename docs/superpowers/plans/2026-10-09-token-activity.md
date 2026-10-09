# Token Activity Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Display collected token usage from PostgreSQL and upload daily scrape results automatically.

**Architecture:** A shared validated record format connects the local uploader and read API. A client calendar reads that API and derives Daily, Weekly, and Cumulative views. The existing daily browser automation uploads verified date-keyed records and checks database gaps.

**Tech Stack:** Existing Next.js/React/TypeScript, Postgres.js, Vitest, Playwright.

**Spec:** docs/superpowers/specs/2026-10-09-token-activity.md

## Global Constraints

- Use the existing Neon database and server-only connection variables.
- Preserve rounded source totals, explicit zeros, unknown gaps, and provisional status.
- Never expose database credentials or add a public write endpoint.
- Preserve all unrelated website behavior and database tables.

## Review Focus

- Stale snapshots cannot roll back newer or recorded data.
- Invalid dates and mismatched token strings cannot enter the database.
- Database failures return a useful public error without secrets.
- Skipped uploads are recoverable even if the local scrape succeeded.
- Narrow screens retain usable tiles without page overflow.

### Task 1: Validated storage and uploader

Files: lib/token-usage.mjs, lib/token-usage-db.mjs, scripts/codex-usage.mjs, db/token-usage.sql, tests/token-usage.test.ts.

- [x] Add failing tests for rounded usage, invalid records, zero/missing distinctions, and yesterday-plus-gap selection; run them.
- [x] Implement normalization and idempotent timestamp-guarded upserts with an additive migration.
- [x] Add upload/pending npm commands; validate the full snapshot before any write.
- [x] Import and verify database records when authentication is available.

### Task 2: Read API and calendar

Files: app/api/token-usage/route.ts, components/token-activity.tsx, app/page.tsx, styles/globals.css, tests/token-usage-api.test.ts, tests/e2e/token-activity.spec.ts.

- [x] Add failing API and aggregation tests for sparse dates, weekly sums, and cumulative totals.
- [x] Add the read-only API and responsive calendar, with functional controls and keyboard/touch details.
- [x] Run desktop/mobile tests for values, mode changes, errors/retry, themes, and overflow.

### Task 3: Daily integration and verification

Files: README.md, .env.example; existing Sync portfolio token activity automation.

- [x] Configure the existing task to consult database gaps and upload every verified scrape.
- [x] Document database setup, credential handling, and retry commands.
- [x] Run lint, typecheck, full unit tests, production build, and appropriate browser checks; verify saved automation configuration.

## Verification results

- 363 database rows imported and read back; repeated uploads wrote zero rows. A freshly checked October 8 tooltip uploaded one update successfully.
- Live production API returned 200 with 363 days and a total approximation of 3,766,332,600 tokens.
- Temporary-table database checks passed for idempotency, stale readings, provisional downgrade protection, and newer corrections.
- Lint, typecheck, production build, and all 44 unit tests passed. All 48 desktop/mobile browser checks passed; the six activity checks passed again after review fixes.
- Review fixes preserve cumulative gap information from older retained history and provide 24px mobile/coarse-pointer tiles. Recent dates appear first within the scroll region.
- Existing daily 9:00 a.m. America/Chicago automation was updated and its saved configuration verified.
- Deployment remains separate; refreshed database credentials must also be configured in Vercel.
