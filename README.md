# Baoren Liu’s portfolio

A responsive portfolio built with Next.js 16.3.8 and React 19.3. Includes light/dark mode, a typography intro, project stories, and live Clash of Clans / Spotify cards. The first intro lasts about 1.8 seconds; later document loads take about 0.25 seconds. Internal navigation does not replay it. Reduced-motion visitors skip it, and content works without JavaScript.

The compact homepage flows from the introduction to highlighted projects, combined experience/research, skills with icons, and games/music. Project previews distinguish details from live apps; role titles link to matching About entries, and All skills opens the complete skills section on About. About links back to the recent projects. Dedicated Projects, About, and Résumé pages are linked in the desktop and mobile navigation. Projects and About use the same compact spacing as Home. About contains education, experience, complete technical skills, and awards. Résumé shows only a faithful vector preview of the supplied document and its PDF open/download controls on every screen. The homepage shows three Spotify tracks; About keeps the full list.

Profile content and the downloadable PDF reflect the supplied October 2026 software engineering résumé. OtherWise and RideList are highlighted, with LHS Schedule alongside them on Projects; earlier apps remain in the same compact project grid. Shared experience and technical skills live in `config/profile.ts`. Additional skill glyphs come from the [Simple Icons project](https://simpleicons.org/); the SQL icon is a local SVG.

The public LinkedIn profile supplies the introduction and current NOBE role, alongside the résumé details. The homepage uses a Fourier sketchpad instead of a headshot: draw a loop with mouse or touch, watch rotating circles reconstruct it, adjust the circle count, or reload the sample. Controls work with the keyboard; reduced-motion visitors get a static example until they choose Play. Animation suspends offscreen and in hidden tabs. The larger drawing area uses compact controls and keeps the project link beside Play. Completed drawings fit when the viewport narrows. Drawings stay in the browser. The transform follows the [standard discrete Fourier transform convention](https://numpy.org/doc/stable/reference/routines.fft.html), with normalization in the forward transform. Navbar and footer share the original transparent SVG monogram, rendered light in dark mode and dark in light mode.

The sketchpad’s default and reset example follows the navbar’s `public/logo.svg` outline. Regenerate its equal-distance sample with `node scripts/sample-logo.mjs` after changing that asset; the browser regression compares the example directly with the SVG geometry.

## Development

Use Node 24 LTS (minimum 22.12).

```sh
npm ci
cp .env.example .env   # only if you do not already have .env
npm run dev
```

All work for this refresh is on `codex/dev-portfolio-redesign`. This repository’s production branch is `master`, not `main`; neither production ref is changed by the refresh.

## Checks and merge protection

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`.github/workflows/ci.yml` runs on development/production pushes, pull requests targeting `main` or `master`, merge queues, and manual dispatch. The aggregate **Quality gate** passes only when lint, types, API regression tests, the production build, and desktop/mobile browser tests succeed. Tests isolate upstream API responses and require no real credentials. The production branch now requires **Quality gate** with strict status checks and admin enforcement. A workflow file alone does not enforce merge restrictions; repository settings must also require the check.

The browser tests cover intro timing, reduced motion, theme persistence, navigation and case studies, mobile overflow, integration failure/retry, disabled JavaScript, unavailable browser storage, and sketchpad keyboard/mouse/touch controls and offscreen suspension. Unit tests also verify equal-distance sampling and Fourier reconstruction. API tests cover missing credentials, expired Spotify authorization, upstream failures/rate limits, malformed responses, missing league/album art, empty history, and cron authorization.

## Clash of Clans

Set `COC_API_KEY` and optionally `COC_PLAYER_TAG` (default `#LY8L20QQR`). Create the key at [the official developer portal](https://developer.clashofclans.com/) and allow RoyaleAPI’s proxy IP `45.79.218.79`, as documented in [RoyaleAPI’s proxy guide](https://docs.royaleapi.com/proxy.html). The proxy supports Vercel’s changing outbound IP addresses. Player data is validated and cached for five minutes; a missing league is legitimately **Unranked**.

## Spotify reconnection

The previous token returned `invalid_grant` during diagnosis. Code changes cannot restore a revoked or expired OAuth grant. Spotify top tracks require `user-top-read`; `short_term` means approximately the past four weeks, not one week. See [Spotify’s top items reference](https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks) and [refresh token lifecycle](https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens).

1. Put `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in the ignored `.env` file.
2. Add `http://127.0.0.1:8888/callback` as an exact Redirect URI in the app’s Spotify dashboard.
3. Run `npm run spotify:authorize`, open `http://127.0.0.1:8888`, and approve access. The helper binds to loopback, validates OAuth state, and saves the replacement refresh token locally without printing it.
4. Update `SPOTIFY_REFRESH_TOKEN` in the Vercel environment used by the development/preview deployment. Local `.env` changes do not update Vercel.
5. Restart the local server after changing credentials, then run `npm run check:integrations` while the site is running. It exits nonzero for an unhealthy integration and prints no secrets. To check a preview, set `INTEGRATION_BASE_URL` to its URL.

Spotify tracks are cached for an hour and do not use the database. A daily Vercel cron validates a fresh Spotify response before invalidating the cache. Set `CRON_SECRET` in Vercel; the cron refuses all requests when it is absent. A failed refresh leaves the existing cache intact. Visitors get a clear error and retry control if no valid cached result exists.

## Codex token activity

The homepage heatmap reads `/api/token-usage`, which reads the existing Neon PostgreSQL database. Set server-only `POSTGRES_URL` (or `DATABASE_URL`) in both the ignored local `.env` and the Vercel environment for the deployed site. Changing local `.env` does not change Vercel. The API is read-only and cached for five minutes; there is no public upload endpoint. Connection errors never expose credentials. The calendar includes Daily, Weekly, and Cumulative views, keyboard/touch details, theme support, and horizontal scrolling on narrow screens. Unknown dates are patterned rather than reported as zero. Totals are approximations because the source tooltips round counts; partial weeks and today's provisional reading are labeled.

The local snapshot at `public/data/codex-activity.json` is a scrape checkpoint and recovery copy. The website does not load that file or fall back to it. Initialize the additive table and upload a verified snapshot with:

```sh
npm run codex:upload -- --initialize
```

Subsequent runs use `npm run codex:upload`. Every batch is validated before writing. Upserts keyed by profile and date preserve unrelated tables and historical records, skip repeated/older snapshots, and prevent provisional data from replacing recorded data. The uploader reads the rows back to verify persistence. Credentials and database errors are never logged.

The existing **Sync portfolio token activity** Codex automation runs at 9:00 a.m. America/Chicago. It uses the signed-in in-app browser to inspect source tooltips for yesterday plus missing past dates, saves verified source values, and runs the uploader. Database records determine missing dates, so failed uploads are recoverable even if the local scrape completed. `npm run codex:pending -- --start YYYY-MM-DD --end YYYY-MM-DD` reports the dates needing collection; it works without a local snapshot when explicit source boundaries are supplied. Zero usage is a real record; color-only rows are insufficient. The local computer, Codex scheduler, and signed-in browser must be available for collection. If they are unavailable, the next successful run catches up within the source calendar's available range.

Never put credentials in `NEXT_PUBLIC_*` variables, commit `.env`, or supply production credentials to PR workflows. No production deployment or production merge is performed as part of this refresh.

## Optional interactive additions

A cohesive set of future features:

- **Project decision explorer:** let visitors inspect a project’s challenge, tradeoffs, and measured result. Helps employers see engineering judgment alongside the finished work.
- **Recruiter quick tour:** a keyboard-accessible command menu that jumps to the most relevant project, experience, résumé, or contact link in a few keystrokes.

The résumé preview preserves the PDF's appearance with an SVG, plus a selectable text layer and accessible links extracted from the same PDF. After replacing `public/Baoren Liu Resume.pdf`, run `python3 scripts/generate-resume-preview.py` to regenerate both `public/resume.svg` and `lib/generated/resume-overlay.json`. The generator requires `pdfplumber` and Poppler's `pdftocairo`; no PDF processing runs in the browser. The original PDF remains available to open and download.
