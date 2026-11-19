"use client";

import React, { useMemo, useState } from "react";
import { ExternalLink, GitFork, Github, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Card, Chip, Label, ListBox, Pagination, SearchField, Select, Separator } from "@heroui/react";
import { Bento, Tile, Tilt } from "../ui/motion";
import type { RepoItem } from "@/lib/portfolio-data";

interface ProjectPreviewCard {
    title: string;
    caption: string;
    badge?: string;
    type: "interface" | "architecture";
    metrics?: string[];
}

interface ProjectItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    liveUrl?: string;
    githubUrl: string;
    tech: string[];
    previews: ProjectPreviewCard[];
}

const PROJECTS: ProjectItem[] = [
    {
        id: "boozeblues",
        title: "Boozeblues E-Commerce",
        subtitle: "Storefront & checkout engine",
        description:
            "High-performance modern beverage storefront with React Server Components (RSC), real-time cart mutations, streaming SSR, and sub-second Largest Contentful Paint (LCP 0.9s).",
        liveUrl: "https://boozeblues.vercel.app",
        githubUrl: "https://github.com/SutharShantanu/boozeblues",
        tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "TanStack Query"],
        previews: [
            {
                title: "Curated Storefront UI",
                caption: "Fluid product catalog with sub-second LCP and edge-cached catalog assets",
                badge: "LCP 0.9s",
                type: "interface",
                metrics: ["RSC Streaming", "Instant Cart", "Zero-CLS"],
            },
            {
                title: "Checkout & Inventory Engine",
                caption: "Optimistic UI mutations, atomic stock validation, and Stripe integration",
                badge: "99.9% Uptime",
                type: "architecture",
                metrics: ["TanStack Query", "Zod Validation", "Edge Middleware"],
            },
        ],
    },
    {
        id: "geekycart",
        title: "Geekycart Tech Store",
        subtitle: "Full-stack MERN application",
        description:
            "Electronics marketplace featuring multi-tiered category filtering, Redux Toolkit cart synchronization, JWT session authorization, and compound-indexed MongoDB queries.",
        liveUrl: "https://geekycart.vercel.app",
        githubUrl: "https://github.com/SutharShantanu/geekycart",
        tech: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB"],
        previews: [
            {
                title: "Interactive Catalog Grid",
                caption: "Multi-parameter facet search, price sliders, and real-time stock levels",
                badge: "MERN Stack",
                type: "interface",
                metrics: ["Redux Toolkit", "Compound Indexes", "JWT Auth"],
            },
            {
                title: "Scalable API & Cache Pipeline",
                caption: "RESTful architecture with token refreshes and optimized aggregation pipelines",
                badge: "40ms API",
                type: "architecture",
                metrics: ["Express Routing", "Mongo Aggregations", "Bcrypt Hashing"],
            },
        ],
    },
    {
        id: "portfolio",
        title: "Glass Editorial Portfolio",
        subtitle: "Fluid whitespace personal site",
        description:
            "Minimalist personal website featuring 3D physical folders, fluid handwritten signature, and frosted glass depth. Built with Next.js 16, React 19, and Tailwind CSS.",
        liveUrl: "https://sutharshantanu.github.io",
        githubUrl: "https://github.com/SutharShantanu/SutharShantanu.github.io",
        tech: ["Next.js 16", "React 19", "HeroUI v3", "Framer Motion", "Tailwind CSS v4"],
        previews: [
            {
                title: "Single-Column Editorial",
                caption: "468px reading column with liquid glass sphere optics and 3D folder physics",
                badge: "HeroUI v3",
                type: "interface",
                metrics: ["SVG Ink Engine", "3D Folders", "Zero-Clutter"],
            },
            {
                title: "Micro-Animation System",
                caption: "Spring-damped physics, scroll-triggered reveals, and tactile micro-states",
                badge: "60 FPS",
                type: "architecture",
                metrics: ["Framer Motion 12", "HeroUI Tokens", "Accessible ARIA"],
            },
        ],
    },
];

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
const PAGE_SIZE = 6;
const SORTS = [
    { id: "updated", label: "Recently updated" },
    { id: "stars", label: "Most stars" },
    { id: "name", label: "Name (A–Z)" },
] as const;

function FeaturedCard({ project, featured }: { project: ProjectItem; featured?: boolean }) {
    return (
        <Card className="h-full">
            <Card.Header>
                <Card.Title className={featured ? "text-xl" : "text-base"}>{project.title}</Card.Title>
                <Card.Description className="font-serif text-base italic">{project.subtitle}</Card.Description>
            </Card.Header>

            <Card.Content className="flex flex-1 flex-col gap-4">
                <p className="text-sm leading-relaxed text-muted">{project.description}</p>

                <div className={featured ? "grid gap-2 sm:grid-cols-2" : "grid gap-2"}>
                    {(featured ? project.previews : project.previews.slice(0, 1)).map((preview) => (
                        <Card key={preview.title} variant="secondary" className="gap-1 p-3">
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-medium text-foreground">{preview.title}</span>
                                {preview.badge && (
                                    <Chip size="sm" variant="soft" color="success" className="shrink-0">
                                        {preview.badge}
                                    </Chip>
                                )}
                            </div>
                            <p className="text-xs leading-relaxed text-muted">{preview.caption}</p>
                        </Card>
                    ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                        <Chip key={t} size="sm" variant="secondary">
                            {t}
                        </Chip>
                    ))}
                </div>
            </Card.Content>

            <Separator />

            <Card.Footer className="flex gap-2">
                {project.liveUrl && (
                    <Button size="sm" variant="primary" onPress={() => openExternal(project.liveUrl!)}>
                        <ExternalLink className="size-3.5" />
                        Live demo
                    </Button>
                )}
                <Button size="sm" variant="secondary" onPress={() => openExternal(project.githubUrl)}>
                    <Github className="size-3.5" />
                    Source
                </Button>
            </Card.Footer>
        </Card>
    );
}

export default function Projects({ repos }: { repos: RepoItem[] }) {
    const [query, setQuery] = useState("");
    const [language, setLanguage] = useState<string>("all");
    const [sort, setSort] = useState<string>("updated");
    const [page, setPage] = useState(1);

    const languages = useMemo(() => [...new Set(repos.map((r) => r.language).filter(Boolean))] as string[], [repos]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return repos
            .filter((r) => (language === "all" || r.language === language) && (!q || `${r.name} ${r.description} ${r.topics.join(" ")}`.toLowerCase().includes(q)))
            .sort((a, b) =>
                sort === "stars" ? b.stars - a.stars : sort === "name" ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt)
            );
    }, [repos, query, language, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
    const reset = <T,>(fn: (v: T) => void) => (v: T) => {
        fn(v);
        setPage(1);
    };

    const [first, ...rest] = PROJECTS;

    return (
        <div className="grid gap-8">
            {/* Featured: full-width hero tile + two half tiles */}
            <Bento className="grid gap-4 lg:grid-cols-2">
                <Tile className="lg:col-span-2" lift={false}>
                    <Tilt className="h-full" max={3}>
                        <FeaturedCard project={first} featured />
                    </Tilt>
                </Tile>
                {rest.map((p) => (
                    <Tile key={p.id}>
                        <FeaturedCard project={p} />
                    </Tile>
                ))}
            </Bento>

            {/* All repositories (live from GitHub) */}
            <section aria-labelledby="repos-heading" className="grid gap-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 id="repos-heading" className="text-lg font-semibold text-foreground">
                            All repositories
                        </h2>
                        <p className="font-serif text-base text-muted italic">Live from GitHub — {repos.length} most recently updated</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <SearchField aria-label="Search repositories" value={query} onChange={reset(setQuery)} className="w-48">
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input placeholder="Search…" />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                        </SearchField>
                        <Select aria-label="Filter by language" className="w-40" value={language} onChange={(v) => reset(setLanguage)(String(v ?? "all"))}>
                            <Label className="sr-only">Language</Label>
                            <Select.Trigger>
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                    <ListBox.Item id="all" textValue="All languages">
                                        All languages
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                    {languages.map((l) => (
                                        <ListBox.Item key={l} id={l} textValue={l}>
                                            {l}
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                        <Select aria-label="Sort repositories" className="w-44" value={sort} onChange={(v) => reset(setSort)(String(v ?? "updated"))}>
                            <Label className="sr-only">Sort</Label>
                            <Select.Trigger>
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                    {SORTS.map((o) => (
                                        <ListBox.Item key={o.id} id={o.id} textValue={o.label}>
                                            {o.label}
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                    </div>
                </div>

                <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {visible.map((repo) => (
                            <motion.div
                                key={repo.id}
                                layout
                                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                whileHover={{ y: -4 }}
                            >
                                <Card className="h-full">
                                    <Card.Header>
                                        <Card.Title className="truncate text-base">{repo.name}</Card.Title>
                                        <Card.Description className="line-clamp-2 min-h-10">{repo.description || "No description provided."}</Card.Description>
                                    </Card.Header>
                                    <Card.Content className="flex flex-row flex-wrap items-center gap-3 font-mono text-xs text-muted">
                                        {repo.language && <Chip size="sm" variant="secondary">{repo.language}</Chip>}
                                        <span className="inline-flex items-center gap-1"><Star className="size-3.5" />{repo.stars}</span>
                                        <span className="inline-flex items-center gap-1"><GitFork className="size-3.5" />{repo.forks}</span>
                                        <span>{new Date(repo.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                                    </Card.Content>
                                    <Card.Footer className="mt-auto flex gap-2">
                                        {repo.homepage && (
                                            <Button size="sm" variant="primary" onPress={() => openExternal(repo.homepage!)}>
                                                <ExternalLink className="size-3.5" />
                                                Live
                                            </Button>
                                        )}
                                        <Button size="sm" variant="secondary" onPress={() => openExternal(repo.url)}>
                                            <Github className="size-3.5" />
                                            Code
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted">No repositories match.</p>}

                {totalPages > 1 && (
                    <Pagination>
                        <Pagination.Summary>
                            {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </Pagination.Summary>
                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.Previous isDisabled={current === 1} onPress={() => setPage(current - 1)}>
                                    <Pagination.PreviousIcon />
                                </Pagination.Previous>
                            </Pagination.Item>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Pagination.Item key={p}>
                                    <Pagination.Link isActive={p === current} onPress={() => setPage(p)}>
                                        {p}
                                    </Pagination.Link>
                                </Pagination.Item>
                            ))}
                            <Pagination.Item>
                                <Pagination.Next isDisabled={current === totalPages} onPress={() => setPage(current + 1)}>
                                    <Pagination.NextIcon />
                                </Pagination.Next>
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination>
                )}
            </section>
        </div>
    );
}
