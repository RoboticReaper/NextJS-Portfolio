import { describe, expect, it } from "vitest";
import {
  normalizeSnapshot,
  pendingDates,
  buildCalendar,
} from "../lib/token-usage.mjs";

const day = (date: string, tokensDisplay = "25.4M tokens", status: "recorded" | "provisional" = "recorded") => ({
  date, tokensDisplay, tokensApprox: tokensDisplay === "0 tokens" ? 0 : 25_400_000,
  collectedAt: "2026-10-09T22:15:54.467Z", status, level: 2,
});

describe("token snapshot validation", () => {
  it("preserves rounded source totals and explicit zero days", () => {
    expect(normalizeSnapshot({ days: [day("2026-10-07", "0 tokens"), day("2026-10-08")] }))
      .toMatchObject([{ date: "2026-10-07", tokensApprox: 0 }, { date: "2026-10-08", tokensApprox: 25_400_000 }]);
  });
  it.each([
    { days: [day("2026-02-30")] },
    { days: [{ ...day("2026-10-08"), tokensApprox: 1 }] },
    { days: [{ ...day("2026-10-08"), tokensDisplay: "unknown" }] },
    { days: [{ ...day("2026-10-08"), tokensApprox: -1 }] },
    { days: [day("2026-10-08"), day("2026-10-08")] },
    { days: [{ ...day("2026-10-08"), status: "complete" }] },
    { days: [{ ...day("2026-10-08"), collectedAt: "yesterday" }] },
    { days: [{ date: "2026-10-08", level: 4 }] },
    { days: [] },
  ])("rejects malformed snapshots before any upload: %j", (snapshot) => {
    expect(() => normalizeSnapshot(snapshot)).toThrow();
  });
});

describe("missed-day recovery", () => {
  it("includes holes and yesterday even when newer records already exist", () => {
    expect(pendingDates([day("2026-10-05"), day("2026-10-07"), day("2026-10-08")], "2026-10-05", "2026-10-09", "2026-10-09"))
      .toEqual(["2026-10-06", "2026-10-08"]);
  });
  it("rechecks provisional past records and handles leap days", () => {
    expect(pendingDates([day("2024-02-28", "0 tokens", "provisional")], "2024-02-28", "2024-03-01", "2024-03-01"))
      .toEqual(["2024-02-28", "2024-02-29"]);
  });
});

describe("calendar aggregation", () => {
  const rows = [day("2026-10-04", "0 tokens"), day("2026-10-05"), day("2026-10-07")];
  it("distinguishes missing dates from verified zero usage", () => {
    const { cells } = buildCalendar(rows, "daily", "2026-10-09");
    expect(cells.find((cell) => cell.date === "2026-10-04")?.tokensApprox).toBe(0);
    expect(cells.find((cell) => cell.date === "2026-10-06")?.tokensApprox).toBeNull();
  });
  it("sums a week once and marks gaps as incomplete", () => {
    const { cells } = buildCalendar(rows, "weekly", "2026-10-09");
    expect(cells.at(-1)).toMatchObject({ date: "2026-10-04", tokensApprox: 50_800_000, incomplete: true });
    expect(cells).toHaveLength(52);
  });
  it("accumulates verified usage while preserving unknown days", () => {
    const { cells } = buildCalendar(rows, "cumulative", "2026-10-09");
    expect(cells.find((cell) => cell.date === "2026-10-06")?.tokensApprox).toBeNull();
    expect(cells.find((cell) => cell.date === "2026-10-07")).toMatchObject({ tokensApprox: 50_800_000, incomplete: true });
  });
  it("retains gap information from history before the visible window", () => {
    const visible = Array.from({ length: 363 }, (_, index) => day(new Date(Date.UTC(2025, 9, 12 + index)).toISOString().slice(0, 10)));
    const history = [day("2025-10-10"), ...visible];
    expect(buildCalendar(history, "cumulative", "2026-10-09").cells[0])
      .toMatchObject({ date: "2025-10-12", tokensApprox: 50_800_000, incomplete: true });
    expect(buildCalendar([...history, day("2025-10-11")], "cumulative", "2026-10-09").cells[0])
      .toMatchObject({ tokensApprox: 76_200_000, incomplete: false });
  });
});
