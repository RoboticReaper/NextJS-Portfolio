# Portfolio refresh

## Intent and visual direction

Baoren wants a personal portfolio that impresses employers and guests, stays mobile friendly, fixes two personal API integrations, and prevents merging untested changes into production. Confirmed direction: clean tech-company landing page styling with light and dark modes. Work stays on `codex/dev-portfolio-redesign`; production branch `master` and any `main` remain unchanged.

## Website

Use a responsive shared navigation, theme toggle, large name hero, concise introduction, selected project cards, impact metrics, experience, skills, personal integrations, and contact CTA. Preserve real biography, project claims, resume, existing case studies and URLs; replace links to nonexistent case studies with real project destinations. Use neutral surfaces, green accent, fine borders, restrained gradients, generous space, and accessible contrast. First-visit name animation lasts about 1.8 seconds; subsequent visits about 0.25 seconds. Respect reduced motion and storage failures. Server-rendered content remains available without JavaScript. No internal navigation replay, blocking API load, or forced artificial wait for live integrations.

## Integrations

Clash proxy currently succeeds but omits league. Validate responses and supply Unranked fallback. Credentials stay server-only. Handle missing configuration, upstream errors, malformed data, rate limits, and timeouts. Spotify currently rejects the refresh token with invalid_grant. Replace deprecated database dependency and destructive refresh job with cached server-side Spotify top tracks. Preserve `{rows}` public response shape. Protect cron with a configured secret, invalidate cached tracks only on successful refresh, and provide a localhost reauthorization helper. Explain the external credential step without claiming live Spotify works until verified.

## Verification and delivery

Pin current npm stable Next.js and compatible React, update MDX and tooling, add reproducible lockfile. API regression tests use isolated upstream responses and no real secrets. Browser tests cover desktop/mobile, navigation, theme persistence, intro speed and reduced motion, and integration error recovery. CI triggers on pushes, pull requests to main/master, and merge queues, and gates lint/typecheck/unit/browser/build checks. Require aggregate CI status via GitHub branch protection without moving production refs. Live API checks are explicit local commands and do not send secrets to pull requests. Suggest a small cohesive set of optional interactive features; do not invent credentials or experiences.
