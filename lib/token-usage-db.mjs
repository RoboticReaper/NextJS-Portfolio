// Import this module only from server routes and local scripts.
import postgres from 'postgres';
import { normalizeSnapshot } from './token-usage.mjs';
export const USERNAME = 'roboticreaper';
let connection;
export function database() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('Token usage database is not configured');
  connection ??= postgres(url, { max: 2, idle_timeout: 20, connect_timeout: 10, ssl: { rejectUnauthorized: true }, connection: { statement_timeout: 15000 } });
  return connection;
}

/** @returns {Promise<import('./token-usage.mjs').UsageDay[]>} */
export async function readUsage(sql = database()) {
  const rows = await sql`
    SELECT usage_date::text AS date, tokens_display AS "tokensDisplay",
      tokens_approx::text AS "tokensApprox", source_level AS level, status,
      collected_at AS "collectedAt"
    FROM portfolio_codex_usage WHERE username = ${USERNAME} ORDER BY usage_date
  `;
  return rows.map((row) => ({ date: row.date, tokensDisplay: row.tokensDisplay, tokensApprox: Number(row.tokensApprox), level: row.level, status: row.status, collectedAt: new Date(row.collectedAt).toISOString() }));
}

export async function uploadUsage(snapshot, sql = database()) {
  // Validate the entire batch before making any write.
  const days = normalizeSnapshot(snapshot);
  const rows = days.map((day) => ({ username: USERNAME, usage_date: day.date, tokens_display: day.tokensDisplay, tokens_approx: day.tokensApprox, source_level: day.level, status: day.status, collected_at: day.collectedAt }));
  const written = await sql`
    INSERT INTO portfolio_codex_usage ${sql(rows, 'username', 'usage_date', 'tokens_display', 'tokens_approx', 'source_level', 'status', 'collected_at')}
    ON CONFLICT (username, usage_date) DO UPDATE SET
      tokens_display = EXCLUDED.tokens_display, tokens_approx = EXCLUDED.tokens_approx,
      source_level = EXCLUDED.source_level, status = EXCLUDED.status,
      collected_at = EXCLUDED.collected_at, updated_at = now()
    WHERE EXCLUDED.collected_at > portfolio_codex_usage.collected_at
      AND NOT (portfolio_codex_usage.status = 'recorded' AND EXCLUDED.status = 'provisional')
    RETURNING usage_date::text AS date
  `;
  return { submitted: days.length, written: written.length, dates: written.map((row) => row.date) };
}

export async function closeDatabase() {
  if (connection) { await connection.end({ timeout: 5 }); connection = undefined; }
}
