# Database-backed token activity

The portfolio will show the daily Codex usage collected from the public roboticreaper profile. PostgreSQL is the website's source of truth; the local JSON is a scrape checkpoint and upload input, not a website fallback. Reuse the project's existing Neon connection through server-only POSTGRES_URL (or DATABASE_URL).

Store one row per username and calendar date, retaining the source's displayed total, its numeric approximation, collection timestamp, and recorded/provisional status. A newer reading may update the same date, but a stale upload or provisional reading must not overwrite a newer completed reading. Missing dates remain distinguishable from verified zeros. Import the verified 363-day snapshot without touching existing tables.

Add a read-only API and a homepage calendar with blue tiles, month labels, Daily/Weekly/Cumulative controls, accessible date/usage details, mobile scrolling, light/dark themes, and explicit loading/empty/error states. Reads must come from PostgreSQL and errors must not disclose connection details. Rounded totals remain labeled approximate.

Provide a local uploader using the ignored .env credentials and an additive migration. The daily browser task checks yesterday and missing historical dates against database records, saves verified readings locally, and runs the uploader. Failed uploads leave the snapshot available for retry; database gaps determine catch-up even when local records already exist. No credentials enter browser code or public write endpoint.

Validate normalization and aggregation, stale/idempotent uploads, read API failure handling, desktop/mobile controls and layout, and a live database import/read. The user refreshed the local Neon credentials, and the 363-day import and repeated-upload verification succeeded.
