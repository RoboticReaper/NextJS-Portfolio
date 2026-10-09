import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { database, readUsage, uploadUsage, closeDatabase } from '../lib/token-usage-db.mjs';
import { normalizeSnapshot, pendingDates, chicagoToday } from '../lib/token-usage.mjs';

const args = process.argv.slice(2);
const option = (flag) => args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined;
try {
  const path = option('--file') || fileURLToPath(new URL('../public/data/codex-activity.json', import.meta.url));
  if (args.includes('--pending')) {
    let snapshot;
    try { snapshot = JSON.parse(await readFile(path, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const rows = await readUsage();
    const today = chicagoToday();
    const start = option('--start') || snapshot?.sourceRange?.start || rows[0]?.date;
    const end = option('--end') || snapshot?.sourceRange?.end || today;
    const pending = pendingDates(rows, start, end, today);
    console.log(JSON.stringify({ today, start, end, pending, databaseRecords: rows.length }));
  } else {
    const snapshot = JSON.parse(await readFile(path, 'utf8'));
    const days = normalizeSnapshot(snapshot);
    const sql = database();
    if (args.includes('--initialize')) {
      const schema = await readFile(new URL('../db/token-usage.sql', import.meta.url), 'utf8');
      await sql.unsafe(schema);
    }
    const result = await uploadUsage({ days }, sql);
    const stored = await readUsage(sql);
    const byDate = new Map(stored.map((row) => [row.date, row]));
    for (const day of days) {
      const row = byDate.get(day.date);
      if (row?.status === 'recorded' && day.status === 'provisional') continue;
      if (!row || Date.parse(row.collectedAt) < Date.parse(day.collectedAt) || (row.collectedAt === day.collectedAt && (row.tokensApprox !== day.tokensApprox || row.tokensDisplay !== day.tokensDisplay))) throw new Error('Upload verification failed');
    }
    console.log(JSON.stringify({ submitted: result.submitted, written: result.written, databaseRecords: stored.length, verified: true }));
  }
} catch (error) {
  // Provider errors can contain connection strings. Only print a safe category.
  console.error(JSON.stringify({ error: 'Token usage database operation failed. Check the local snapshot, database credentials, and migration.', code: typeof error.code === 'string' && /^[A-Z0-9_]+$/.test(error.code) ? error.code : 'VALIDATION_OR_CONNECTION_ERROR' }));
  process.exitCode = 1;
} finally { await closeDatabase(); }
