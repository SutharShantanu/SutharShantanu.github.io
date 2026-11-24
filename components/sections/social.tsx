"use client";

import React from "react";
import { Avatar, Button, Card, Chip } from "@heroui/react";
import { BadgeCheck, CalendarDays, FolderGit2, GitCommitHorizontal, GitFork, Github, Linkedin, Quote, Sparkles, Star } from "@/components/icons";
import { Bento, CountUp, Tile } from "../ui/motion";
import { ActivityCalendar } from "./activity-calendar";
import type { ActivityItem, PortfolioData } from "@/lib/portfolio-data";

const ACTIVITY_ICON: Record<ActivityItem["kind"], React.ComponentType<{ className?: string }>> = {
    push: GitCommitHorizontal,
    pr: GitFork,
    issue: Sparkles,
    create: FolderGit2,
    star: Star,
    fork: GitFork,
    release: Sparkles,
    other: Github,
};

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

/** Recommendation tile spans on lg (4 cols): first spans 2, the rest 1; a lone last tile fills its row. */
const recSpan = (i: number, n: number) => {
    if (i === 0) return "lg:col-span-2";
    if (i !== n - 1) return undefined;
    const before = 2 + (n - 2); // first (2 cols) + middle tiles; activity sits on its own row above
    return ["lg:col-span-4", "lg:col-span-3", "lg:col-span-2", undefined][before % 4];
};

/** Profile photo with a small brand badge in the corner. Plain <img>: avatar hosts aren't in next/image remotePatterns. */
function ProfileAvatar({ src, alt, badge: Badge }: { src: string; alt: string; badge: React.ComponentType<{ className?: string }> }) {
    return (
        <span className="relative shrink-0">
            <Avatar size="lg" className="ring-2 ring-surface">
                <Avatar.Image src={src} alt={alt} referrerPolicy="no-referrer" />
                <Avatar.Fallback>SS</Avatar.Fallback>
            </Avatar>
            <span className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full bg-foreground text-background ring-2 ring-surface">
                <Badge className="size-3" />
            </span>
        </span>
    );
}

const initials = (name: string) =>
    name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");

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
    const { github, profile, recommendations } = data;


    return (
        <Bento className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {/* GitHub profile */}
            <Tile className="lg:col-span-2" lift={false}>
                <Card className="h-full">
                    <Card.Header className="flex flex-row items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <ProfileAvatar src={github.avatar} alt={`@${github.login} on GitHub`} badge={Github} />
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
                            <ProfileAvatar src={profile.avatar} alt={`${profile.name} on LinkedIn`} badge={Linkedin} />
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
                    </Card.Content>
                </Card>
            </Tile>

            {/* Contribution calendar (full width: a year is ~780px) */}
            <Tile className="lg:col-span-4" lift={false}>
                <Card className="h-full">
                    <Card.Header className="flex flex-row flex-wrap items-end justify-between gap-2">
                        <div>
                            <Card.Title>Contributions</Card.Title>
                            <Card.Description className="font-hand text-lg">Every commit, by year</Card.Description>
                        </div>
                        <Chip size="sm" variant="soft" color="success">
                            {github.contributionTotal.toLocaleString()} all time
                        </Chip>
                    </Card.Header>
                    <Card.Content>
                        <ActivityCalendar history={github.contributions} yearTotals={github.yearTotals} />
                    </Card.Content>
                </Card>
            </Tile>

            {/* Recent activity: grouped pushes with commit messages, PRs, issues, releases… */}
            <Tile className="lg:col-span-4" lift={false}>
                <Card className="h-full">
                    <Card.Header className="flex flex-row items-end justify-between gap-2">
                        <div>
                            <Card.Title>Recent activity</Card.Title>
                            <Card.Description className="font-hand text-lg">What I&apos;ve been shipping lately</Card.Description>
                        </div>
                        <Button size="sm" variant="ghost" onPress={() => openExternal(github.url)}>
                            View on GitHub
                        </Button>
                    </Card.Header>
                    <Card.Content>
                        {github.activity.length ? (
                            <ul className="grid gap-3 md:grid-cols-3">
                                {github.activity.map((a) => {
                                    const Icon = ACTIVITY_ICON[a.kind];
                                    return (
                                        <li key={a.id} className="flex gap-3 rounded-2xl bg-default p-3">
                                            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-surface">
                                                <Icon className="size-4 text-foreground" />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                    <a href={a.repoUrl} target="_blank" rel="noopener noreferrer" className="truncate font-display text-sm font-medium text-foreground hover:underline">
                                                        {a.repo.split("/").pop()}
                                                    </a>
                                                    {a.branch && (
                                                        <Chip size="sm" variant="secondary" className="font-mono">
                                                            {a.branch}
                                                        </Chip>
                                                    )}
                                                    <span className="ml-auto font-mono text-[11px] text-muted">{a.ago}</span>
                                                </div>
                                                <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-0.5 block text-sm text-muted hover:text-foreground">
                                                    {a.title}
                                                </a>
                                                {a.commits.length > 0 && (
                                                    <ul className="mt-2 grid gap-1">
                                                        {a.commits.map((c) => (
                                                            <li key={c.sha} className="flex min-w-0 items-baseline gap-2 text-xs">
                                                                <a href={c.url} target="_blank" rel="noopener noreferrer" className="shrink-0 font-mono text-muted hover:text-foreground">
                                                                    {c.sha}
                                                                </a>
                                                                <span className="truncate text-foreground/80" title={c.message}>
                                                                    {c.message}
                                                                </span>
                                                            </li>
                                                        ))}
                                                        {a.commitCount && a.commitCount > a.commits.length && (
                                                            <li className="text-xs text-muted">+{a.commitCount - a.commits.length} more</li>
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted">No public activity yet.</p>
                        )}
                    </Card.Content>
                </Card>
            </Tile>

            {/* Recommendations */}
            {recommendations.map((r, i) => (
                <Tile key={r.username || i} className={recSpan(i, recommendations.length)}>
                    <Card className="h-full">
                        <Card.Content className="grid h-full content-between gap-3">
                            <Quote className="size-5 text-muted" />
                            <p className={`font-serif leading-snug text-pretty text-foreground italic ${i === 0 ? "text-xl" : "text-base"}`}>&ldquo;{r.text}&rdquo;</p>
                            <a
                                href={r.profileUrl || profile.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 border-t border-separator pt-3"
                            >
                                <Avatar size="sm" className="shrink-0">
                                    <Avatar.Fallback className="font-display text-xs font-semibold">{initials(r.name)}</Avatar.Fallback>
                                </Avatar>
                                <span className="min-w-0">
                                    <span className="block truncate font-display text-sm font-semibold text-foreground group-hover:underline">{r.name}</span>
                                    <span className="flex items-center gap-1 text-xs text-muted">
                                        <Linkedin className="size-3" /> Recommendation on LinkedIn
                                    </span>
                                </span>
                            </a>
                        </Card.Content>
                    </Card>
                </Tile>
            ))}
        </Bento>
    );
}
