/** @typedef {{date:string, tokensDisplay:string, tokensApprox:number, collectedAt:string, status:'recorded'|'provisional', level?:number|null}} UsageDay */
/** @typedef {{date:string,endDate:string,tokensApprox:number|null,tokensDisplay:string,status:string,incomplete:boolean}} CalendarCell */
const DAY = 86_400_000;

/** Calendar dates are source labels, never converted through a browser's timezone. */
export function dateValue(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Invalid calendar date');
  const ms = Date.parse(value + 'T00:00:00Z');
  if (!Number.isFinite(ms) || new Date(ms).toISOString().slice(0, 10) !== value) throw new Error('Invalid calendar date');
  return ms;
}
const dateLabel = (ms) => new Date(ms).toISOString().slice(0, 10);

export function parseTokens(display) {
  if (typeof display !== 'string') throw new Error('Missing token usage');
  const match = display.match(/^(\d+(?:\.\d+)?)([KMB]?) tokens?$/);
  if (!match) throw new Error('Invalid token usage');
  const value = Math.round(Number(match[1]) * ({ '': 1, K: 1e3, M: 1e6, B: 1e9 }[match[2]]));
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid token total');
  return value;
}

/** @returns {UsageDay[]} */
export function normalizeSnapshot(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.days) || !snapshot.days.length || snapshot.days.length > 10_000) throw new Error('Expected daily token records');
  const seen = new Set();
  return snapshot.days.map((row) => {
    dateValue(row.date);
    if (seen.has(row.date)) throw new Error('Duplicate usage date');
    seen.add(row.date);
    const tokensApprox = parseTokens(row.tokensDisplay);
    if (tokensApprox !== row.tokensApprox) throw new Error('Token string and numeric total disagree');
    if (!['recorded', 'provisional'].includes(row.status)) throw new Error('Invalid recording status');
    if (typeof row.collectedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(row.collectedAt) || !Number.isFinite(Date.parse(row.collectedAt))) throw new Error('Invalid collection timestamp');
    dateValue(row.collectedAt.slice(0, 10));
    if (row.level != null && (!Number.isInteger(row.level) || row.level < 0 || row.level > 4)) throw new Error('Invalid source level');
    return { date: row.date, tokensDisplay: row.tokensDisplay, tokensApprox, status: row.status, collectedAt: new Date(row.collectedAt).toISOString(), level: row.level ?? null };
  }).sort((a, b) => a.date.localeCompare(b.date));
}

/** A gap means no verified token record, including a failed upload after a successful scrape. */
export function pendingDates(records, start, end, today) {
  const first = dateValue(start), last = Math.min(dateValue(end), dateValue(today) - DAY);
  if (dateValue(end) < first || dateValue(end) - first > 10_000 * DAY) throw new Error('Invalid source window');
  const known = new Map(records.map((row) => [row.date, row]));
  const pending = [];
  for (let ms = first; ms <= last; ms += DAY) {
    const date = dateLabel(ms), row = known.get(date);
    if (ms === dateValue(today) - DAY || !row || row.status !== 'recorded' || !Number.isSafeInteger(row.tokensApprox) || row.tokensApprox < 0 || typeof row.tokensDisplay !== 'string') pending.push(date);
  }
  return pending;
}

export function chicagoToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (name) => parts.find((p) => p.type === name)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function formatTokens(value) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

/** @param {UsageDay[]} records @param {'daily'|'weekly'|'cumulative'} mode @returns {{cells:CalendarCell[],start:string,columns:number}} */
export function buildCalendar(records, mode, end = chicagoToday()) {
  const last = dateValue(end);
  const start = last - (new Date(last).getUTCDay() + 51 * 7) * DAY;
  const known = new Map(records.map((row) => [row.date, row]));
  let total = 0, missing = false;
  // Cumulative means lifetime recorded usage, including retained history before this window.
  const history = records.filter((row) => dateValue(row.date) < start).sort((a, b) => a.date.localeCompare(b.date));
  let expected = history.length ? dateValue(history[0].date) : start;
  for (const row of history) {
    const ms = dateValue(row.date);
    if (ms !== expected) missing = true;
    total += row.tokensApprox;
    expected = ms + DAY;
  }
  if (expected < start) missing = true;
  /** @type {CalendarCell[]} */
  const daily = [];
  for (let ms = start; ms <= last; ms += DAY) {
    const date = dateLabel(ms), row = known.get(date);
    if (!row) missing = true;
    else total += row.tokensApprox;
    daily.push({ date, endDate: date, tokensApprox: row ? (mode === 'cumulative' ? total : row.tokensApprox) : null, tokensDisplay: row ? (mode === 'cumulative' ? `${formatTokens(total)} tokens` : row.tokensDisplay) : 'Not recorded', status: row?.status ?? 'missing', incomplete: mode === 'cumulative' && missing });
  }
  if (mode !== 'weekly') return { cells: daily, start: dateLabel(start), columns: 52 };
  /** @type {CalendarCell[]} */
  const weekly = [];
  for (let i = 0; i < daily.length; i += 7) {
    const week = daily.slice(i, i + 7), present = week.filter((day) => day.tokensApprox !== null);
    const sum = present.reduce((sum, day) => sum + (day.tokensApprox ?? 0), 0);
    weekly.push({ date: week[0].date, endDate: week.at(-1).date, tokensApprox: present.length ? sum : null, tokensDisplay: present.length ? `${formatTokens(sum)} tokens` : 'Not recorded', status: week.some((day) => day.status === 'provisional') ? 'provisional' : present.length ? 'recorded' : 'missing', incomplete: present.length !== week.length || week.length < 7 });
  }
  return { cells: weekly, start: dateLabel(start), columns: 52 };
}
