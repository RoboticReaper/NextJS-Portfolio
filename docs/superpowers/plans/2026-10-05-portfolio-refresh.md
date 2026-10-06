# Portfolio Refresh Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for native execution in this session.

**Goal:** Deliver a modern, accessible portfolio with reliable personal integrations and required merge checks on a development branch.
**Architecture:** Keep App Router and existing MDX stories. Separate server integration clients, API handlers, and client interaction components; use native semantic controls and shared CSS for the redesign.
**Tech Stack:** Current stable Next.js, React, TypeScript, Vitest, Playwright, GitHub Actions.
**Spec:** docs/superpowers/specs/2026-10-05-portfolio-design.md

## Global Constraints

- Only codex/dev-portfolio-redesign changes; main/master refs remain unchanged.
- Tech-company landing page style; both light and dark themes; responsive mobile navigation.
- No secrets in client code, logs, fixtures, or CI pull request contexts.
- First intro about 1.8 seconds, repeat intro about 0.25 seconds; reduced motion skips animation.
- Preserve existing content, URLs, and honest project claims.

## Review Focus

- Missing/expired credentials: honest recoverable UI and safe HTTP errors.
- API rate limits/HTML/network failure: bounded requests and controlled responses.
- Empty Spotify history/missing art and Clash league: valid fallbacks.
- Browser storage blocked/JavaScript disabled/reduced motion: visible usable content.
- Small screens/keyboard navigation/theme persistence: accessible controls and no overflow.

### Task 1: Integrations and framework

Files: package.json, next.config.js, lib/integrations.ts, app/api/**, tests/api.test.ts, vitest.config.ts.
Interface: routes expose validated Clash profile or `{rows: Song[]}`; safe errors contain `error` and `code`.

- [x] Run regression tests against existing routes and confirm meaningful failures.
- [x] Upgrade to verified stable Next.js and matching MDX, React/types; remove obsolete UI/database packages as their consumers are replaced.
- [x] Implement cached server integrations, schema checks, timeouts, public error responses, secure cron.
- [x] Re-run regression tests and typecheck.

### Task 2: Portfolio presentation and interactions

Files: app pages/layouts, components/navigation.tsx, components/intro.tsx, components/live-interests.tsx, styles/globals.css, config/site.ts, MDX stories.
Interface: shared shell renders routes, theme persists locally, intro runs on browser document load only, interest cards fetch independently and retry.

- [x] Add browser tests for navigation, themes, repeat/reduced-motion intro, mobile overflow, and error recovery.
- [x] Replace legacy presentation with shared responsive design and semantic controls; preserve content.
- [x] Verify desktop/mobile appearance and run browser suite.

### Task 3: Merge gates and owner setup

Files: .github/workflows/ci.yml, scripts/spotify-authorize.mjs, scripts/check-integrations.mjs, .env.example, README.md.

- [x] Add test/build/lint/typecheck workflow and aggregate `Quality gate` status on push/PR/merge-group.
- [x] Add secret-safe live checks and local Spotify reauthorization instructions.
- [x] Run all checks and production build; review final diff.
- [x] Require Quality gate on actual production branch using GitHub protection; report any platform constraint accurately.
- [x] Commit development branch changes; leave production untouched.
