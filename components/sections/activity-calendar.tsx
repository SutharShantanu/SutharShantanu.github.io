"use client";

/**
 * GitHub activity calendar, adapted from Elements (tryelements.dev/docs/github/github-activity-calendar).
 * Changes: real server data only (no random fallback), "Last 12 months" + per-year filter (HeroUI Tabs,
 * vertical on desktop), fluid cells that fill the card, CSS-grid aligned labels, monochrome glass
 * levels, framer-motion column stagger and a single live hover readout (no native title tooltips).
 */
import React, { useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Tabs } from "@heroui/react";

type Day = { date: string; count: number; level: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Ink-on-glass levels (status colours stay reserved for meaning, per DESIGN.md).
const LEVELS = ["bg-foreground/[0.07]", "bg-foreground/25", "bg-foreground/45", "bg-foreground/70", "bg-foreground"];
// Fluid gap so 53 week columns always fit the card (no horizontal scroll, even on phones).
const GAP = "clamp(1px, 0.22vw, 3px)";
const DAY_MS = 86_400_000;

const toISO = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const utc = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const fmtDay = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const fmt = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Desktop gets vertical tabs; read the media query without a hydration mismatch. */
const subscribeWide = (cb: () => void) => {
    const mq = window.matchMedia("(min-width: 1024px)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
};
const useIsWide = () => useSyncExternalStore(subscribeWide, () => window.matchMedia("(min-width: 1024px)").matches, () => true);

function buildWeeks(days: Day[]) {
    const weeks: (Day | null)[][] = [];
    const monthLabels: { label: string; col: number }[] = [];
    let week: (Day | null)[] = [];
    let lastMonth = -1;
    if (days.length) for (let i = 0; i < new Date(utc(days[0].date)).getUTCDay(); i++) week.push(null);
    for (const d of days) {
        const dt = new Date(utc(d.date));
        if (dt.getUTCDay() === 0 && week.length) {
            weeks.push(week);
            week = [];
        }
        if (dt.getUTCDay() === 0 && dt.getUTCMonth() !== lastMonth) {
            monthLabels.push({ label: MONTHS[dt.getUTCMonth()], col: weeks.length });
            lastMonth = dt.getUTCMonth();
        }
        week.push(d);
    }
    if (week.length) {
        // Pad the final partial week so its rows don't stretch (stretched rows enlarge the square cells).
        while (week.length < 7) week.push(null);
        weeks.push(week);
    }
    if (monthLabels.length > 1 && monthLabels[1].col - monthLabels[0].col < 3) monthLabels.shift();
    return { weeks, monthLabels };
}

export function ActivityCalendar({
    history,
    yearTotals,
}: {
    history: { start: string; days: number[] };
    yearTotals: Record<string, number>;
}) {
    const reduce = useReducedMotion();
    const wide = useIsWide();
    const [range, setRange] = useState<string>("all");
    const [hovered, setHovered] = useState<Day | null>(null);

    // Decode the compact history once: day i = start + i, value = count * 5 + level.
    const all = useMemo<Day[]>(() => {
        const start = utc(history.start);
        return history.days.map((v, i) => ({ date: toISO(start + i * DAY_MS), count: Math.floor(v / 5), level: v % 5 }));
    }, [history]);

    const years = useMemo(() => {
        const fromData = new Set(all.map((d) => d.date.slice(0, 4)));
        return [...fromData].sort((a, b) => b.localeCompare(a));
    }, [all]);

    // "All": one Jan–Dec year where each date sums that day across every year (laid out on a leap
    // year so 29 Feb exists). Levels are rescaled to the combined max.
    const combined = useMemo<Day[]>(() => {
        const sums = new Map<string, number>();
        for (const d of all) sums.set(d.date.slice(5), (sums.get(d.date.slice(5)) ?? 0) + d.count);
        const max = Math.max(1, ...sums.values());
        const start = utc("2024-01-01");
        return Array.from({ length: 366 }, (_, i) => {
            const date = toISO(start + i * DAY_MS);
            const count = sums.get(date.slice(5)) ?? 0;
            return { date, count, level: count ? Math.min(4, Math.max(1, Math.ceil((count / max) * 4))) : 0 };
        });
    }, [all]);
    const days = useMemo(() => (range === "all" ? combined : all.filter((d) => d.date.startsWith(range))), [all, combined, range]);
    const stats = range === "all" ? all : days;
    const total = stats.reduce((s, d) => s + d.count, 0);
    const activeDays = stats.filter((d) => d.count > 0).length;
    const best = stats.reduce<Day | null>((b, d) => (!b || d.count > b.count ? d : b), null);
    const rangeLabel = range === "all" ? `since ${years[years.length - 1] ?? ""}` : `in ${range}`;

    if (!all.length) return <p className="text-sm text-muted">Contribution data unavailable right now.</p>;

    return (
        <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-6">
            <Tabs
                orientation={wide ? "vertical" : "horizontal"}
                selectedKey={range}
                onSelectionChange={(k) => {
                    setRange(String(k));
                    setHovered(null);
                }}
                className="min-w-0 max-w-full overflow-x-auto [scrollbar-width:none]"
            >
                <Tabs.ListContainer className="max-w-full">
                    <Tabs.List aria-label="Contribution range">
                        <Tabs.Tab id="all">
                            <span className="flex w-full items-center justify-between gap-3">
                                All
                                <span className="font-mono text-[11px] text-muted tabular-nums">{Object.values(yearTotals).reduce((a, b) => a + b, 0)}</span>
                            </span>
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        {years.map((y) => (
                            <Tabs.Tab key={y} id={y}>
                                <span className="flex w-full items-center justify-between gap-3">
                                    {y}
                                    <span className="font-mono text-[11px] text-muted tabular-nums">{yearTotals[y] ?? "—"}</span>
                                </span>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>

            <div className="grid min-w-0 gap-3">
                <p className="text-sm text-muted">
                    <span className="font-display font-semibold text-foreground tabular-nums">{total.toLocaleString()}</span> contributions{" "}
                    {rangeLabel} · <span className="tabular-nums">{activeDays}</span> active days
                    {best && best.count > 0 && (
                        <>
                            {" "}
                            · best day <span className="text-foreground tabular-nums">{best.count}</span>
                        </>
                    )}
                </p>

                <div className="min-w-0">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={range}
                            initial={reduce ? false : { opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={reduce ? undefined : { opacity: 0, x: -12 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="grid min-w-0"
                        >
                            <YearGrid days={days} combined={range === "all"} hovered={hovered} onHover={setHovered} reduce={!!reduce} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted">
                    <span aria-live="polite" className="min-h-4">
                        {hovered
                            ? `${hovered.count} contribution${hovered.count === 1 ? "" : "s"} · ${range === "all" ? `${fmtDay(hovered.date)}, all years` : fmt(hovered.date)}`
                            : "Hover a day for details"}
                    </span>
                    <span className="flex items-center gap-1" aria-hidden="true">
                        Less
                        {LEVELS.map((c) => (
                            <span key={c} className={`size-[11px] rounded-[2px] sm:rounded-[3px] ${c}`} />
                        ))}
                        More
                    </span>
                </div>
            </div>
        </div>
    );
}

/** One year as a GitHub-style week grid: fluid square cells, month + weekday labels. */
function YearGrid({
    days,
    combined,
    hovered,
    onHover,
    reduce,
}: {
    days: Day[];
    /** Aggregated across years: weekday rows don't line up across years, so hide weekday labels. */
    combined?: boolean;
    hovered: Day | null;
    onHover: (d: Day | null) => void;
    reduce: boolean;
}) {
    const { weeks, monthLabels } = useMemo(() => buildWeeks(days), [days]);
    const columns = `repeat(${weeks.length}, minmax(0, 1fr))`;
    const sum = days.reduce((s, d) => s + d.count, 0);
    return (
        <div className="grid">
            <div
                className="grid"
                style={{ gridTemplateColumns: "auto minmax(0, 1fr)", columnGap: 8, rowGap: 6 }}
                role="img"
                aria-label={`${sum} GitHub contributions${combined ? " across all years, by day of year" : ""}`}
            >
                <span />
                <div className="grid font-mono text-[10px] text-muted" style={{ gridTemplateColumns: columns, columnGap: GAP }}>
                    {monthLabels.map(({ label: m, col }) => (
                        <span key={`${m}-${col}`} style={{ gridColumnStart: col + 1 }} className="whitespace-nowrap">
                            {m}
                        </span>
                    ))}
                </div>
                <div className="grid font-mono text-[10px] leading-none text-muted" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))", rowGap: GAP }}>
                    {(combined ? ["", "", "", "", "", "", ""] : ["", "Mon", "", "Wed", "", "Fri", ""]).map((d, i) => (
                        <span key={i} className="flex items-center">
                            {d}
                        </span>
                    ))}
                </div>
                <div className="grid" style={{ gridTemplateColumns: columns, columnGap: GAP }} onPointerLeave={() => onHover(null)}>
                    {weeks.map((week, wi) => (
                        <motion.div
                            key={wi}
                            className="grid"
                            style={{ gridTemplateRows: "repeat(7, auto)", rowGap: GAP }}
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: wi * 0.006, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {week.map((d, di) =>
                                d ? (
                                    <motion.span
                                        key={d.date}
                                        onPointerEnter={() => onHover(d)}
                                        whileHover={{ scale: 1.35 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                        className={`aspect-square w-full rounded-[2px] sm:rounded-[3px] ${LEVELS[d.level]} ${hovered?.date === d.date ? "ring-1 ring-foreground/60" : ""}`}
                                    />
                                ) : (
                                    <span key={`pad-${di}`} className="aspect-square w-full" />
                                )
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
