"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
    GitCommitVertical,
    GitPullRequestArrow,
    Github,
    Linkedin,
    Terminal,
    Users,
    FolderGit2,
    ArrowUpRight,
    MessageSquare,
} from "lucide-react";
import {
    SocialProps,
} from "./types/social.types";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart";
import { formatDistanceToNow } from "date-fns";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Social({ github, linkedin }: SocialProps) {
    const isMounted = useSyncExternalStore(
        emptySubscribe,
        getClientSnapshot,
        getServerSnapshot
    );

    const {
        html_url = "https://github.com/SutharShantanu",
        public_repos = 35,
        followers = 18,
        contributions = [],
        recentActivities = [],
        topLanguages = {},
    } = github || {};

    const {
        linkedin_url = "https://linkedin.com/in/shantanu-suthar",
        connection_count = 500,
        recommendations_received = [],
    } = linkedin || {};

    const [selectedYear, setSelectedYear] = useState<string>("all");

    // Year options from activity
    const yearSet = new Set(
        (contributions || []).map((day) =>
            new Date(day.date).getFullYear().toString()
        )
    );
    const years = ["all", ...Array.from(yearSet).sort((a, b) => +b - +a)];

    const filteredDays =
        !contributions || contributions.length === 0
            ? []
            : selectedYear === "all"
            ? contributions
            : contributions.filter(
                  (day) => new Date(day.date).getFullYear().toString() === selectedYear
              );

    const totalCommitsCount = filteredDays.reduce(
        (acc, curr) => acc + (curr.count || 0),
        0
    );

    // Monthly aggregates for area chart
    const monthlyCounts: Record<string, number> = {};
    MONTH_NAMES.forEach((m) => (monthlyCounts[m] = 0));

    filteredDays.forEach((day) => {
        const date = new Date(day.date);
        if (!isNaN(date.getTime())) {
            const month = date.toLocaleString("default", { month: "short" });
            monthlyCounts[month] = (monthlyCounts[month] || 0) + (day.count || 0);
        }
    });

    const areaChartData = MONTH_NAMES.map((month) => ({
        month,
        commits: monthlyCounts[month] || 0,
    }));

    const chartConfig = {
        commits: {
            label: "Commits",
            color: "var(--foreground)",
        },
    } satisfies ChartConfig;

    // Filter valid recent activities
    const validActivities = (recentActivities || [])
        .filter(
            (act) =>
                act &&
                act.created_at &&
                !isNaN(new Date(act.created_at).getTime())
        )
        .slice(0, 5);

    // Language list sorted
    const languageEntries = Object.entries(topLanguages || {}).sort(
        (a, b) => b[1] - a[1]
    );
    const totalLangRepos = languageEntries.reduce((sum, [, count]) => sum + count, 0) || 1;

    return (
        <section id="activity" className="w-full py-12 scroll-mt-24 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-sm tabular-nums">05</span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                        Developer activity
                    </h2>
                </div>

                {/* Quick Profile Links */}
                <div className="flex items-center gap-2 font-mono text-xs">
                    <Link
                        href={html_url || "https://github.com/SutharShantanu"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-pill px-3 py-1.5 rounded-xl hover:bg-foreground hover:text-background text-foreground transition-all flex items-center gap-1.5"
                    >
                        <Github className="size-3.5" />
                        <span>GitHub</span>
                        <ArrowUpRight className="size-3 text-muted-foreground" />
                    </Link>
                    <Link
                        href={linkedin_url || "https://linkedin.com/in/shantanu-suthar"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-subtle px-3 py-1.5 rounded-xl hover:bg-muted text-foreground transition-all flex items-center gap-1.5"
                    >
                        <Linkedin className="size-3.5" />
                        <span>LinkedIn</span>
                        <ArrowUpRight className="size-3 text-muted-foreground" />
                    </Link>
                </div>
            </div>

            {/* Dashboard Container */}
            <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
                {/* Telemetry Header */}
                <div className="p-4 border-b border-border/70 flex items-center justify-between font-mono text-xs bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Terminal className="size-3.5 text-primary" />
                        <span className="font-semibold text-foreground uppercase tracking-wider">
                            Telemetry // GitHub Activity
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Connected</span>
                    </div>
                </div>

                {/* Metrics Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border/70 font-mono divide-x divide-border/70">
                    <div className="p-5">
                        <div className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <FolderGit2 className="size-3.5 text-primary" />
                            <span>Repositories</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold font-sans text-foreground">
                            {public_repos}
                        </div>
                        <span className="text-[11px] text-muted-foreground">Public open source</span>
                    </div>

                    <div className="p-5">
                        <div className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <GitCommitVertical className="size-3.5 text-emerald-500" />
                            <span>Commits</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold font-sans text-foreground">
                            {totalCommitsCount || 240}+
                        </div>
                        <span className="text-[11px] text-muted-foreground">Across active repos</span>
                    </div>

                    <div className="p-5">
                        <div className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <Users className="size-3.5 text-sky-500" />
                            <span>Followers</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold font-sans text-foreground">
                            {followers}
                        </div>
                        <span className="text-[11px] text-muted-foreground">Dev network</span>
                    </div>

                    <div className="p-5">
                        <div className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <Linkedin className="size-3.5 text-blue-500" />
                            <span>Network</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold font-sans text-foreground">
                            {connection_count}+
                        </div>
                        <span className="text-[11px] text-muted-foreground">Professional network</span>
                    </div>
                </div>

                {/* Main Activity Grid: Commit Velocity Chart + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/70">
                    {/* Left 7 Cols: Commit Velocity Area Chart */}
                    <div className="lg:col-span-7 p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h3 className="font-sans font-bold text-base text-foreground">
                                    Commit Frequency &amp; Velocity
                                </h3>
                                <p className="font-mono text-xs text-muted-foreground">
                                    Monthly distribution of contributions.
                                </p>
                            </div>

                            {/* Year Filter Tabs */}
                            {years.length > 1 && (
                                <div className="flex items-center gap-1 glass-pill p-0.5 rounded-full">
                                    {years.map((y) => (
                                        <button
                                            key={y}
                                            type="button"
                                            onClick={() => setSelectedYear(y)}
                                            className={`px-2.5 py-0.5 text-[10px] font-mono rounded-full transition-colors ${
                                                selectedYear === y
                                                    ? "bg-foreground text-background font-semibold shadow-xs"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            {y.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Area Chart Container */}
                        <div className="glass-subtle rounded-2xl p-3 min-h-[190px]">
                            {isMounted ? (
                                <ChartContainer
                                    config={chartConfig}
                                    className="w-full aspect-[2/1] max-h-[220px] min-h-[170px]"
                                >
                                    <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={6}
                                            fontSize={10}
                                            fontFamily="var(--font-geist-mono)"
                                        />
                                        <ChartTooltip
                                            cursor={{ stroke: "var(--foreground)", strokeWidth: 1, strokeDasharray: "2 2" }}
                                            content={<ChartTooltipContent indicator="line" />}
                                        />
                                        <Area
                                            dataKey="commits"
                                            type="monotone"
                                            fill="var(--foreground)"
                                            fillOpacity={0.12}
                                            stroke="var(--foreground)"
                                            strokeWidth={1.5}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            ) : (
                                <div className="w-full h-[180px] bg-muted/30 animate-pulse rounded-2xl" />
                            )}
                        </div>

                        {/* Language Distribution Bar */}
                        {languageEntries.length > 0 && (
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                                    <span>PRIMARY LANGUAGES</span>
                                    <span>BY REPOSITORIES</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                                    {languageEntries.slice(0, 4).map(([lang, count], idx) => {
                                        const pct = Math.max(5, Math.round((count / totalLangRepos) * 100));
                                        const opacities = ["bg-foreground", "bg-foreground/75", "bg-foreground/50", "bg-foreground/30"];
                                        return (
                                            <div
                                                key={lang}
                                                style={{ width: `${pct}%` }}
                                                className={`h-full ${opacities[idx % opacities.length]}`}
                                                title={`${lang}: ${pct}%`}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex flex-wrap gap-3 font-mono text-[10px] text-muted-foreground pt-1">
                                    {languageEntries.slice(0, 4).map(([lang, count]) => {
                                        const pct = Math.round((count / totalLangRepos) * 100);
                                        return (
                                            <span key={lang} className="flex items-center gap-1.5">
                                                <span className="size-1.5 rounded-full bg-foreground" />
                                                <span className="text-foreground">{lang}</span>
                                                <span>{pct}%</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right 5 Cols: Recent Git Activities Feed */}
                    <div className="lg:col-span-5 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-sans font-bold text-base text-foreground">
                                Recent Events
                            </h3>
                            <span className="font-mono text-[10px] text-muted-foreground uppercase">
                                Git Stream
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {validActivities.length > 0 ? (
                                validActivities.map((act, index) => (
                                    <div
                                        key={index}
                                        className="p-3.5 glass-subtle rounded-2xl font-mono text-xs space-y-1 transition-colors hover:border-foreground/30"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                                <GitPullRequestArrow className="size-3.5 text-muted-foreground" />
                                                <span>{act.type}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        {act.repo?.name && (
                                            <p className="text-[11px] text-muted-foreground truncate">
                                                repo: <span className="text-foreground font-medium">{act.repo.name}</span>
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 glass-subtle rounded-2xl font-mono text-xs text-muted-foreground text-center">
                                    Active commits pushing directly to feature branches.
                                </div>
                            )}
                        </div>

                        {/* Peer Recommendation Quote (if available) */}
                        {recommendations_received && recommendations_received.length > 0 && (
                            <div className="border-t border-border/70 pt-4 space-y-2">
                                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <MessageSquare className="size-3 text-primary" />
                                    <span>Peer Endorsement</span>
                                </div>
                                <blockquote className="p-3.5 rounded-2xl glass-subtle text-xs text-muted-foreground italic leading-relaxed">
                                    &ldquo;{recommendations_received[0].text}&rdquo;
                                    <footer className="mt-2 text-right not-italic font-mono text-[10px] text-foreground font-semibold">
                                        — LinkedIn Recommendation
                                    </footer>
                                </blockquote>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
