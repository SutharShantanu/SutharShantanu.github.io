"use client";

import React from "react";
import { Avatar, Card, Chip, Skeleton } from "@heroui/react";
import { ArrowUpRight, Briefcase, FolderGit2, GitCommitHorizontal, Github, Linkedin, Mail, Quote, Star, Users } from "@/components/icons";
import dynamic from "next/dynamic";
import { Signature } from "../signature";
import { motion } from "framer-motion";
import { Bento, CountUp, hoverArrow, hoverIcon, LogoLoop, Marker, Ping, Tile } from "../ui/motion";
import { SKILLS } from "./constants/skills.constant";
import { EMAIL } from "./constants/social.constant";
import type { PortfolioData } from "@/lib/portfolio-data";
import type { TabKey } from "../shell/portfolio-shell";

// Recharts is ~100KB+; load it after first paint.
const LanguageChart = dynamic(() => import("./language-chart"), {
    ssr: false,
    loading: () => <Skeleton className="h-full min-h-56 rounded-3xl" />,
});

const CORE_STACK = ["Next.js", "React 19", "TypeScript", "HeroUI v3", "Tailwind CSS v4", "TanStack Query", "Framer Motion", "Zod", "Node.js", "Express", "MongoDB"];

type IconType = React.ComponentType<{ className?: string }>;

/** Stat card: label + icon on top, big number + chip pinned to the bottom, faint watermark icon fills tall cells. */
function StatTile({ label, value, suffix, chip, icon: Icon }: { label: string; value: number; suffix?: string; chip: string; icon: IconType }) {
    return (
        <Tile>
            <Card className="relative flex h-full flex-col overflow-hidden">
                <Icon aria-hidden="true" className="pointer-events-none absolute -right-4 -bottom-4 size-28 text-foreground/[0.04]" />
                <Card.Header className="flex flex-row items-center justify-between gap-2">
                    <Card.Description>{label}</Card.Description>
                    <motion.span variants={hoverIcon} className="grid size-8 place-items-center rounded-xl bg-default">
                        <Icon className="size-4 text-foreground" />
                    </motion.span>
                </Card.Header>
                <Card.Content className="flex flex-1 flex-col items-start justify-end gap-2">
                    <span className="whitespace-nowrap font-display text-4xl font-semibold tracking-tight tabular-nums text-foreground">
                        <CountUp value={value} suffix={suffix} />
                    </span>
                    <Chip size="sm" variant="soft" color="success">
                        {chip}
                    </Chip>
                </Card.Content>
            </Card>
        </Tile>
    );
}

function LinkTile({ title, note, href, icon: Icon }: { title: string; note: string; href: string; icon: IconType }) {
    return (
        <Tile>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
                <Card className="h-full">
                    <Card.Header className="flex flex-row items-start justify-between">
                        <motion.span variants={hoverIcon} className="grid size-10 place-items-center rounded-xl bg-default">
                            <Icon className="size-5 text-foreground" />
                        </motion.span>
                        <motion.span variants={hoverArrow}>
                            <ArrowUpRight className="size-4 text-muted" />
                        </motion.span>
                    </Card.Header>
                    <Card.Content className="min-w-0">
                        <span className="block font-display text-sm font-medium text-foreground">{title}</span>
                        <span className="block truncate text-xs text-muted">{note}</span>
                    </Card.Content>
                </Card>
            </a>
        </Tile>
    );
}

/**
 * Bento layout (lg, 4 cols):
 *   [ About 2x2      ][ Exp  ][ Repos ]
 *   [                ][ Now  2x1      ]
 *   [ Chart 2x1      ][ Stars][ Followers ]
 *   [ Stack 2x1      ][ Quote 2x1     ]
 *   [ GitHub ][ LinkedIn ][ Email ][ Contributions ]
 */
export default function Overview({ data, onNavigate, visibility }: { data: PortfolioData; onNavigate: (tab: TabKey) => void; visibility: Record<TabKey, boolean> }) {
    const { profile, github, roles, recommendations } = data;
    const current = roles.find((r) => r.isCurrent) ?? roles[0];
    const quote = recommendations[0];

    return (
        <Bento className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile className="col-span-2 lg:row-span-2" lift={false}>
                <Card className="h-full">
                    <Card.Header>
                        <Card.Title>About</Card.Title>
                    </Card.Header>
                    <Card.Content className="grid content-start gap-3 text-sm leading-relaxed text-muted">
                        <Signature className="self-start" />
                        <p className="font-serif text-xl leading-snug text-foreground italic">
                            Building scalable, fluid web apps with Next.js &amp; TypeScript.
                        </p>
                        <p>
                            {profile.jobTitle} at <span className="font-medium text-foreground">{profile.company}</span>, based in{" "}
                            {profile.location}. I focus on <Marker>performant, accessible</Marker> and visually polished interfaces — <Marker variant="underline">design systems</Marker>,
                            smooth motion and clean, maintainable code.
                        </p>
                    </Card.Content>
                </Card>
            </Tile>

            <StatTile label="Experience" value={profile.experienceYears} suffix="+ yrs" chip="Since 2022" icon={Briefcase} />
            <StatTile label="Public repos" value={github.publicRepos} chip="GitHub" icon={FolderGit2} />

            {visibility.experience && current && (
                <Tile className="col-span-2">
                    <button
                        type="button"
                        onClick={() => onNavigate("experience")}
                        className="block h-full w-full rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                        <Card className="h-full">
                            <Card.Header className="flex flex-row items-center justify-between">
                                <Card.Description>Currently</Card.Description>
                                <Chip size="sm" variant="soft" color="success">
                                    <Ping />
                                    {current.duration}
                                </Chip>
                            </Card.Header>
                            <Card.Content>
                                <p className="font-display text-lg font-semibold text-foreground">{current.title}</p>
                                <p className="text-sm text-muted">
                                    {current.company} · since {current.start}
                                </p>
                            </Card.Content>
                        </Card>
                    </button>
                </Tile>
            )}

            <Tile className="col-span-2">
                <LanguageChart languages={github.languages} />
            </Tile>
            <StatTile label="GitHub stars" value={github.totalStars} chip="All time" icon={Star} />
            <StatTile label="LinkedIn followers" value={profile.followers} chip="Network" icon={Users} />

            <Tile className="col-span-2">
                <Card className="h-full">
                    <Card.Header>
                        <Card.Title>Core stack</Card.Title>
                        <Card.Description>Frontend architecture &amp; UI systems</Card.Description>
                    </Card.Header>
                    <Card.Content className="grid content-start gap-3">
                        <LogoLoop logos={SKILLS.map((s) => ({ src: s.icon, alt: s.title }))} />
                        <div className="flex flex-row flex-wrap items-center gap-1.5">
                        {CORE_STACK.map((tech) => (
                            <Chip key={tech} size="sm" variant="secondary">
                                {tech}
                            </Chip>
                        ))}
                        </div>
                    </Card.Content>
                </Card>
            </Tile>

            {visibility.social && quote && (
                <Tile className="col-span-2">
                    <button
                        type="button"
                        onClick={() => onNavigate("social")}
                        className="block h-full w-full rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                        <Card className="h-full">
                            <Card.Content className="flex h-full flex-col gap-4">
                                <Quote className="size-5 text-muted" />
                                <p className="font-serif text-lg leading-snug text-pretty text-foreground italic">&ldquo;{quote.text}&rdquo;</p>
                                <div className="mt-auto flex items-center gap-3 border-t border-separator pt-3">
                                    <Avatar size="sm" className="shrink-0">
                                        <Avatar.Fallback className="font-display text-xs font-semibold">
                                            {quote.name
                                                .split(" ")
                                                .map((w) => w[0])
                                                .slice(0, 2)
                                                .join("")}
                                        </Avatar.Fallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-display text-sm font-semibold text-foreground">{quote.name}</p>
                                        <p className="flex items-center gap-1 text-xs text-muted">
                                            <Linkedin className="size-3" /> Recommendation on LinkedIn
                                        </p>
                                    </div>
                                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted">
                                        +{recommendations.length - 1} more
                                        <motion.span variants={hoverArrow}>
                                            <ArrowUpRight className="size-3.5" />
                                        </motion.span>
                                    </span>
                                </div>
                            </Card.Content>
                        </Card>
                    </button>
                </Tile>
            )}

            <LinkTile title="GitHub" note={`@${github.login}`} href={github.url} icon={Github} />
            <LinkTile title="LinkedIn" note={`${profile.connections}+ connections`} href={profile.linkedinUrl} icon={Linkedin} />
            <LinkTile title="Email" note={EMAIL} href={`mailto:${EMAIL}`} icon={Mail} />
            <StatTile label="Contributions" value={github.contributionTotal} chip="All time" icon={GitCommitHorizontal} />
        </Bento>
    );
}
