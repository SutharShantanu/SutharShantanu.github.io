"use client";

import React, { useMemo, useState } from "react";
import { ExternalLink, GitFork, Github, Star } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Card, Chip, Label, ListBox, Pagination, SearchField, Select } from "@heroui/react";
import { Bento, Tile, Tilt, RevealText } from "../ui/motion";
import type { RepoItem } from "@/lib/portfolio-data";
import { PROJECTS, type ProjectItem } from "./constants/featured-projects.constant";

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
const PAGE_SIZE = 4;
const SORTS = [
    { id: "updated", label: "Recently active" },
    { id: "stars", label: "Most stars" },
    { id: "name", label: "Name (A–Z)" },
] as const;

/** Browser-window panel: domain bar + every highlight with its metrics (stands in for a screenshot). */
function BrowserPanel({ project }: { project: ProjectItem }) {
    const domain = (project.liveUrl ?? project.githubUrl).replace(/^https?:\/\//, "");
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-separator bg-default/60">
            <div className="flex items-center gap-2 border-b border-separator px-3 py-2">
                <span className="flex gap-1" aria-hidden="true">
                    <span className="size-2 rounded-full bg-danger/70" />
                    <span className="size-2 rounded-full bg-warning/70" />
                    <span className="size-2 rounded-full bg-success/70" />
                </span>
                <span className="min-w-0 flex-1 truncate rounded-full bg-surface px-3 py-0.5 text-center font-mono text-[11px] text-muted">{domain}</span>
            </div>
            <div className="grid flex-1 content-start gap-2 p-3">
                {project.previews.map((preview) => (
                    <motion.div
                        key={preview.title}
                        className="grid gap-2 rounded-xl bg-surface p-3 shadow-sm"
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 26 }}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium text-foreground">{preview.title}</span>
                            {preview.badge && (
                                <Chip size="sm" variant="soft" color="success" className="shrink-0">
                                    {preview.badge}
                                </Chip>
                            )}
                        </div>
                        <p className="text-xs leading-relaxed text-muted">{preview.caption}</p>
                        {preview.metrics && (
                            <div className="flex flex-wrap gap-1">
                                {preview.metrics.map((m) => (
                                    <span key={m} className="rounded-md bg-default px-1.5 py-0.5 font-mono text-[10px] text-muted">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/** Featured project: copy + actions beside a browser panel; `flip` mirrors it on lg for a zigzag rhythm. */
function FeaturedCard({ project, index, flip }: { project: ProjectItem; index: number; flip?: boolean }) {
    return (
        <Card className="h-full">
            <Card.Content className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
                <div className={`flex min-w-0 flex-col gap-4 ${flip ? "lg:order-2" : ""}`}>
                    <div className="flex items-start gap-3">
                        <span className="font-hand text-4xl leading-none text-muted" aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                            <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                            <p className="font-serif text-base text-muted italic">{project.subtitle}</p>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((t) => (
                            <Chip key={t} size="sm" variant="secondary">
                                {t}
                            </Chip>
                        ))}
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2 border-t border-separator pt-4">
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
                    </div>
                </div>
                {/* Panel opens the live site (or repo); the glass cursor shows where it goes. */}
                <div
                    role="link"
                    tabIndex={0}
                    aria-label={`Open ${project.title} ${project.liveUrl ? "live demo" : "source"}`}
                    data-cursor={project.liveUrl ? "View live ↗" : "View source ↗"}
                    onClick={() => openExternal(project.liveUrl ?? project.githubUrl)}
                    onKeyDown={(e) => e.key === "Enter" && openExternal(project.liveUrl ?? project.githubUrl)}
                    className={`min-w-0 cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-focus ${flip ? "lg:order-1" : ""}`}
                >
                    <BrowserPanel project={project} />
                </div>
            </Card.Content>
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

    return (
        <div className="grid grid-cols-1 gap-8">
            {/* Featured projects: zigzag split cards */}
            <Bento className="grid grid-cols-1 gap-4">
                {PROJECTS.map((p, i) => (
                    <Tile key={p.id} lift={false}>
                        <Tilt className="h-full" max={2}>
                            <FeaturedCard project={p} index={i} flip={i % 2 === 1} />
                        </Tilt>
                    </Tile>
                ))}
            </Bento>

            {/* All repositories (live from GitHub) */}
            <section aria-labelledby="repos-heading" className="grid min-w-0 grid-cols-1 gap-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 id="repos-heading" className="text-lg font-semibold text-foreground">
                            <RevealText text="All repositories" />
                        </h2>
                        <p className="font-hand text-lg text-muted">Live from GitHub — {repos.length} repos, latest pushes first</p>
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

                <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                                        <span title="Last push" className="basis-full">Pushed {new Date(repo.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
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
                    <Pagination className="flex-wrap justify-center gap-2 sm:justify-between">
                        <Pagination.Summary>
                            {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </Pagination.Summary>
                        <Pagination.Content className="flex-wrap justify-center">
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
