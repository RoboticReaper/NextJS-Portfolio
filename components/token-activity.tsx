"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { buildCalendar, formatTokens, normalizeSnapshot, type UsageDay } from "@/lib/token-usage.mjs";

type Mode = "daily" | "weekly" | "cumulative";
type Dataset = { days: UsageDay[]; updatedAt: string | null };
const dateText = (date: string) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" }).format(new Date(date + "T00:00:00Z"));

export function TokenActivity() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [mode, setMode] = useState<Mode>("daily");
  const [selected, setSelected] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number; below: boolean } | null>(null);
  const tooltipId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const scroll = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/token-usage", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]) });
        if (!response.ok) throw new Error("Unavailable");
        const payload = await response.json();
        if (!Array.isArray(payload.days)) throw new Error("Invalid activity data");
        const days = payload.days.length ? normalizeSnapshot(payload) : [];
        if (!controller.signal.aborted) setData({ days, updatedAt: typeof payload.updatedAt === "string" ? payload.updatedAt : null });
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    load();
    return () => controller.abort();
  }, [attempt]);

  const calendar = useMemo(() => buildCalendar(data?.days ?? [], mode), [data, mode]);
  useEffect(() => {
    // Keep recent activity visible when the calendar is wider than the screen.
    if (scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth;
  }, [data, mode]);
  const positive = calendar.cells.map((cell) => cell.tokensApprox ?? 0).filter((n) => n > 0).sort((a, b) => a - b);
  const thresholds = [0.25, 0.5, 0.75].map((fraction) => positive[Math.floor((positive.length - 1) * fraction)] ?? 0);
  const level = (value: number | null) => value === null ? "missing" : value === 0 ? "0" : String(1 + thresholds.filter((threshold) => value > threshold).length);
  const focusIndex = Math.min(selected ?? calendar.cells.length - 1, calendar.cells.length - 1);
  const current = calendar.cells[focusIndex];
  const describe = (cell: typeof current) => `${dateText(cell.date)}${mode === "weekly" ? ` – ${dateText(cell.endDate)}` : ""} · ${cell.tokensDisplay}${cell.status === "provisional" ? " · In progress" : ""}${cell.incomplete ? " · Partial data" : ""}`;
  const showTooltip = (element: HTMLButtonElement, index: number) => {
    const bounds = element.getBoundingClientRect();
    const below = bounds.top < 110;
    setSelected(index);
    setTooltip({ index, x: Math.max(150, Math.min(window.innerWidth - 150, bounds.left + bounds.width / 2)), y: below ? bounds.bottom + 10 : bounds.top - 10, below });
  };
  const total = data?.days.reduce((sum, day) => sum + day.tokensApprox, 0) ?? 0;
  const months: { label: string; column: number }[] = [];
  let previousMonth = "";
  for (let column = 0; column < 52; column++) {
    const date = new Date(calendar.start + "T00:00:00Z");
    date.setUTCDate(date.getUTCDate() + column * 7);
    const month = date.toISOString().slice(0, 7);
    if (month !== previousMonth) months.push({ label: date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }), column });
    previousMonth = month;
  }

  return (
    <section className="section container token-section" aria-labelledby="token-activity-heading">
      <div className="token-heading">
        <div>
          <p className="eyebrow">Building with AI</p>
          <h2 id="token-activity-heading">Token activity</h2>
        </div>
        <div className="token-modes" role="group" aria-label="Activity view">
          {(["daily", "weekly", "cumulative"] as const).map((view) => (
            <button key={view} type="button" aria-pressed={mode === view} onClick={() => { setMode(view); setSelected(null); setTooltip(null); }}>
              {view[0].toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {error ? (
        <div className="token-message" role="status">
          <p>Token activity is temporarily unavailable.</p>
          <button className="text-button" onClick={() => { setError(false); setData(null); setAttempt((n) => n + 1); }}>Try again <span aria-hidden="true">↻</span></button>
        </div>
      ) : !data ? (
        <div className="token-message" role="status"><span className="skeleton-line" /><p>Loading token activity…</p></div>
      ) : !data.days.length ? (
        <p className="token-message" role="status">No activity has been synced yet.</p>
      ) : (
        <>
          <div className="token-summary"><strong>{formatTokens(total)}</strong><span>tokens recorded</span><span className="token-summary-divider" /><span>{data.days.filter((day) => day.tokensApprox > 0).length} active days</span></div>
          <div className="token-scroll" ref={scroll} onScroll={() => setTooltip(null)} role="group" aria-label={`${mode} token activity`}>
            <div className="token-calendar">
              <div className={`token-grid${mode === "weekly" ? " token-grid-weekly" : ""}`}>
                {calendar.cells.map((cell, index) => (
                  <button
                    key={cell.date}
                    type="button"
                    className="token-cell"
                    data-date={cell.date}
                    data-level={level(cell.tokensApprox)}
                    aria-label={describe(cell)}
                    aria-describedby={tooltip?.index === index ? tooltipId : undefined}
                    tabIndex={index === focusIndex ? 0 : -1}
                    ref={(element) => { buttons.current[index] = element; }}
                    onPointerEnter={(event) => showTooltip(event.currentTarget, index)}
                    onPointerLeave={() => setTooltip(null)}
                    onFocus={(event) => showTooltip(event.currentTarget, index)}
                    onBlur={() => setTooltip(null)}
                    onClick={(event) => showTooltip(event.currentTarget, index)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") { setTooltip(null); return; }
                      const step = mode === "weekly" ? 1 : 7;
                      const offset = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -step, ArrowRight: step }[event.key];
                      if (offset !== undefined) { event.preventDefault(); buttons.current[Math.max(0, Math.min(calendar.cells.length - 1, index + offset))]?.focus(); }
                    }}
                  />
                ))}
              </div>
              <div className="token-months" aria-hidden="true">
                {months.map(({ label, column }) => <span key={`${label}-${column}`} style={{ gridColumn: column + 1 }}>{label}</span>)}
              </div>
            </div>
          </div>
          <div className="token-detail" role="status" aria-live="polite" aria-atomic="true">{describe(current)}</div>
          <div className="token-footnote">
            <p>Approximate token totals{data.updatedAt && Number.isFinite(Date.parse(data.updatedAt)) ? ` · Synced ${new Date(data.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Chicago" })}` : ""}</p>
            <div className="token-legend" aria-label="Tile intensity: less to more usage; patterned tiles mean not recorded"><span>Less</span>{[0, 1, 2, 3, 4].map((n) => <span key={n} className="token-cell" data-level={n} />)}<span>More</span></div>
          </div>
        </>
      )}
      {tooltip && createPortal(
        <div id={tooltipId} role="tooltip" className="token-tooltip" data-below={tooltip.below} style={{ left: tooltip.x, top: tooltip.y }}>
          <span>{dateText(calendar.cells[tooltip.index].date)}{mode === "weekly" ? ` – ${dateText(calendar.cells[tooltip.index].endDate)}` : ""}</span>
          <strong>{calendar.cells[tooltip.index].tokensDisplay}</strong>
          {(calendar.cells[tooltip.index].status === "provisional" || calendar.cells[tooltip.index].incomplete) && <span>{calendar.cells[tooltip.index].status === "provisional" ? "In progress" : "Partial data"}</span>}
        </div>, document.body
      )}
      <noscript><p>Enable JavaScript to view token activity.</p></noscript>
    </section>
  );
}
