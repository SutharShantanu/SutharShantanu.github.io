"use client";

import React from "react";
import { Button, Card, Chip, Separator } from "@heroui/react";
import { BadgeCheck, CalendarDays, Github, GitCommitHorizontal, Linkedin, Quote } from "lucide-react";
import { Bento, CountUp, Tile } from "../ui/motion";
import type { PortfolioData } from "@/lib/portfolio-data";

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
const LEVEL_OPACITY = ["opacity-[0.07]", "opacity-30", "opacity-50", "opacity-75", "opacity-100"];

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl bg-default px-3 py-2">
            <p className="font-display text-xl font-semibold tabular-nums text-foreground">
                <CountUp value={value} />
            </p>
            <p className="truncate text-xs text-muted">{label}</p>
        </div>
    );
}

export default function Social({ data }: { data: PortfolioData }) {
    const { github, profile, recommendations, roles } = data;
    const current = roles.find((r) => r.isCurrent);

    // Group contribution days into week columns for the heatmap.
    const weeks: PortfolioData["github"]["contributions"][] = [];
    github.contributions.forEach((d, i) => {
        if (i % 7 === 0) weeks.push([]);
        weeks[weeks.length - 1].push(d);
    });
    const recentTotal = github.contributions.reduce((s, d) => s + d.count, 0);

    return (
        <Bento className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {/* GitHub profile */}
            <Tile className="lg:col-span-2" lift={false}>
                <Card className="h-full">
                    <Card.Header className="flex flex-row items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="grid size-11 place-items-center rounded-2xl bg-default">
                                <Github className="size-5 text-foreground" />
                            </span>
                            <div>
                                <Card.Title>@{github.login}</Card.Title>
                                <Card.Description className="flex items-center gap-1 font-mono text-xs">
                                    <CalendarDays className="size-3" /> Joined {github.joined}
                                </Card.Description>
                            </div>
                        </div>
                        <Button size="sm" variant="secondary" onPress={() => openExternal(github.url)}>
                            Follow
                        </Button>
                    </Card.Header>
                    <Card.Content className="grid gap-4">
                        {github.bio && <p className="font-serif text-lg leading-snug text-foreground italic">{github.bio}</p>}
                        <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                            <Stat label="Repos" value={github.publicRepos} />
                            <Stat label="Followers" value={github.followers} />
                            <Stat label="Following" value={github.following} />
                            <Stat label="Stars" value={github.totalStars} />
                        </div>
                    </Card.Content>
                </Card>
            </Tile>

            {/* LinkedIn profile */}
            <Tile className="lg:col-span-2" lift={false}>
                <Card className="h-full">
                    <Card.Header className="flex flex-row items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="grid size-11 place-items-center rounded-2xl bg-default">
                                <Linkedin className="size-5 text-foreground" />
                            </span>
                            <div>
                                <Card.Title className="flex items-center gap-1">
                                    {profile.name} <BadgeCheck className="size-4 text-focus" aria-label="Verified" />
                                </Card.Title>
                                <Card.Description className="font-mono text-xs">
                                    {profile.location}
                                    {profile.joined && ` · Joined ${profile.joined}`}
                                </Card.Description>
                            </div>
                        </div>
                        <Button size="sm" variant="secondary" onPress={() => openExternal(profile.linkedinUrl)}>
                            Connect
                        </Button>
                    </Card.Header>
                    <Card.Content className="grid gap-4">
                        <p className="line-clamp-2 text-sm text-muted">{profile.headline}</p>
                        <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                            <Stat label="Followers" value={profile.followers} />
                            <Stat label="Connections" value={profile.connections} />
                            <Stat label="Yrs experience" value={profile.experienceYears} />
                            <Stat label="Recommendations" value={recommendations.length} />
                        </div>
                        {current && (
                            <p className="text-xs text-muted">
                                Current position: <span className="text-foreground">{current.title}</span> · {current.company} · {current.duration}
                            </p>
                        )}
                    </Card.Content>
                </Card>
            </Tile>

            {/* Contribution heatmap */}
            <Tile className="lg:col-span-3" lift={false}>
                <Card className="h-full">
                    <Card.Header className="flex flex-row items-end justify-between">
                        <div>
                            <Card.Title>Contributions</Card.Title>
                            <Card.Description>Last 26 weeks</Card.Description>
                        </div>
                        <Chip size="sm" variant="soft" color="success">
                            {recentTotal} recent · {github.contributionTotal} all time
                        </Chip>
                    </Card.Header>
                    <Card.Content>
                        {weeks.length ? (
                            <div className="flex gap-[3px] overflow-x-auto pb-1" role="img" aria-label={`${recentTotal} GitHub contributions in the last 26 weeks`}>
                                {weeks.map((week, wi) => (
                                    <div key={wi} className="grid grid-rows-7 gap-[3px]">
                                        {week.map((d) => (
                                            <span
                                                key={d.date}
                                                title={`${d.count} contributions · ${d.date}`}
                                                className={`size-3 rounded-[3px] bg-foreground transition-transform hover:scale-150 ${LEVEL_OPACITY[d.level] ?? LEVEL_OPACITY[0]}`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted">Contribution data unavailable right now.</p>
                        )}
                    </Card.Content>
                </Card>
            </Tile>

            {/* Recent activity */}
            <Tile lift={false}>
                <Card className="h-full">
                    <Card.Header>
                        <Card.Title>Recent activity</Card.Title>
                    </Card.Header>
                    <Card.Content className="grid gap-2">
                        {github.activity.length ? (
                            github.activity.map((a) => (
                                <div key={a.id} className="flex items-start gap-2 text-xs">
                                    <GitCommitHorizontal className="mt-0.5 size-3.5 shrink-0 text-muted" />
                                    <div className="min-w-0">
                                        <p className="truncate text-foreground">{a.repo.split("/").pop()}</p>
                                        <p className="font-mono text-muted">
                                            {a.type} · {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted">No public activity yet.</p>
                        )}
                    </Card.Content>
                </Card>
            </Tile>

            {/* Recommendations */}
            {recommendations.map((r, i) => (
                <Tile key={r.username || i} className={i === 0 ? "lg:col-span-2" : undefined}>
                    <Card className="h-full">
                        <Card.Content className="grid h-full content-between gap-3">
                            <Quote className="size-5 text-muted" />
                            <p className={`font-serif leading-snug text-foreground italic ${i === 0 ? "text-xl" : "text-base"}`}>&ldquo;{r.text}&rdquo;</p>
                            <Separator />
                            <a
                                href={r.profileUrl || profile.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-6 items-center font-mono text-xs text-muted hover:text-foreground"
                            >
                                @{r.username} · LinkedIn recommendation
                            </a>
                        </Card.Content>
                    </Card>
                </Tile>
            ))}
        </Bento>
    );
}
