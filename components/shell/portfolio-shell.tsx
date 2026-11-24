"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Avatar, Button, Kbd, Modal, Skeleton } from "@heroui/react";
import { ScrollProgress } from "../ui/motion";
import { ProgressiveBlur } from "../ui/progressive-blur";
import { SmoothScroll, useScrollTop } from "../ui/smooth-scroll";
import { GlassCursor } from "../ui/glass-cursor";
import {
    Briefcase,
    Download,
    FileText,
    FolderGit2,
    Github,
    LayoutDashboard,
    Linkedin,
    Mail,
    MapPin,
    Search,
    Send,
    Sparkles,
    Users,
} from "@/components/icons";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import { Dock } from "./dock";
import dynamic from "next/dynamic";
import Overview from "../sections/overview";

// Only Overview is needed for first paint; other panels + palette load on demand (smaller initial JS).
// Panel placeholder shaped like the real content: heading, then a responsive grid of cards.
const PanelFallback = () => (
    <div className="grid gap-4" aria-busy="true" aria-label="Loading">
        <div className="grid gap-2">
            <Skeleton className="h-5 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className={`grid content-start gap-3 rounded-3xl bg-surface p-4 ${i === 0 ? "sm:col-span-2" : ""}`}>
                    <div className="flex items-center gap-3">
                        <Skeleton className="size-10 shrink-0 rounded-xl" />
                        <div className="grid flex-1 gap-2">
                            <Skeleton className="h-3.5 w-3/4 rounded-md" />
                            <Skeleton className="h-3 w-1/2 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="h-24 rounded-2xl" />
                    <div className="flex gap-2">
                        <Skeleton className="h-7 w-20 rounded-full" />
                        <Skeleton className="h-7 w-16 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);
const Projects = dynamic(() => import("../sections/projects"), { loading: PanelFallback });
const Experience = dynamic(() => import("../sections/experience"), { loading: PanelFallback });
const Skills = dynamic(() => import("../sections/skills"), { loading: PanelFallback });
const Social = dynamic(() => import("../sections/social"), { loading: PanelFallback });
const Contact = dynamic(() => import("../contact"), { loading: PanelFallback });
// pdf.js is heavy and browser-only: load the viewer only when the résumé dialog opens.
const PdfViewer = dynamic(() => import("../pdf-viewer"), { ssr: false, loading: PanelFallback });
const CommandPalette = dynamic(() => import("../command-palette").then((m) => m.CommandPalette));
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from "../sections/constants/social.constant";
import type { PortfolioData } from "@/lib/portfolio-data";

export type TabKey = "overview" | "work" | "experience" | "skills" | "social" | "contact";

export const NAV: { id: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "work", label: "Work", icon: FolderGit2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Sparkles },
    { id: "social", label: "Social", icon: Users },
    { id: "contact", label: "Contact", icon: Mail },
];

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

type ShellProps = { data: PortfolioData; visibility: Record<TabKey, boolean> };

export function PortfolioShell({ data, visibility }: ShellProps) {
    return (
        <SmoothScroll>
            <Shell data={data} visibility={visibility} />
        </SmoothScroll>
    );
}

function Shell({ data, visibility }: ShellProps) {
    const visibleNav = NAV.filter(({ id }) => visibility[id]);
    const firstTab = NAV.find(({ id }) => visibility[id])?.id ?? "overview";
    const scrollTop = useScrollTop();
    const [tab, setTabState] = useState<TabKey>(firstTab);
    // +1 when moving right along the dock, -1 when moving left (drives slide direction).
    const [direction, setDirection] = useState(1);
    const tabRef = useRef<TabKey>(firstTab);
    const changeTab = useCallback((next: TabKey) => {
        const index = (key: TabKey) => NAV.findIndex((n) => n.id === key);
        setDirection(index(next) >= index(tabRef.current) ? 1 : -1);
        tabRef.current = next;
        setTabState(next);
    }, []);

    // Deep-link tabs via URL hash (e.g. /#work) and keep the hash in sync.
    const setTab = useCallback((next: TabKey) => {
        if (!visibility[next]) return;
        changeTab(next);
        scrollTop();
        window.history.replaceState(null, "", next === "overview" ? window.location.pathname : `#${next}`);
    }, [changeTab, scrollTop, visibility]);
    useEffect(() => {
        const sync = () => {
            const hash = window.location.hash.slice(1) as TabKey;
            if (NAV.some(({ id }) => id === hash && visibility[id])) changeTab(hash);
            else changeTab(firstTab);
        };
        sync();
        window.addEventListener("hashchange", sync);
        return () => window.removeEventListener("hashchange", sync);
    }, [changeTab, firstTab, visibility]);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [resumeOpen, setResumeOpen] = useState(false);
    const { profile } = data;

    const PANELS: Record<TabKey, React.ReactNode> = {
        overview: <Overview data={data} onNavigate={setTab} visibility={visibility} />,
        work: <Projects repos={data.repos} />,
        experience: <Experience roles={data.roles} certifications={data.certifications} />,
        skills: <Skills />,
        social: <Social data={data} />,
        contact: <Contact />,
    };
    const active = NAV.find((n) => n.id === tab)!;

    return (
        <MotionConfig reducedMotion="user">
            <ScrollProgress />
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-foreground"
            >
                Skip to content
            </a>
            <div className="mx-auto w-full max-w-6xl px-3 pt-4 pb-32 sm:px-6 sm:pt-10">
                    <motion.main
                        id="main"
                        initial={{ y: 16, scale: 0.99 }}
                        animate={{ y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 140, damping: 22 }}
                        className="glass-shell glass-main flex flex-col gap-6 rounded-4xl p-4 sm:p-6"
                    >
                        <header className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <Avatar size="lg" className="hidden shrink-0 sm:flex">
                                    <Avatar.Image asChild src="/avatar.webp">
                                        <Image alt={profile.name} src="/avatar.webp" width={48} height={48} sizes="48px" priority />
                                    </Avatar.Image>
                                    <Avatar.Fallback>SS</Avatar.Fallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <h1 className="text-xl font-semibold text-foreground sm:truncate sm:text-3xl">
                                        Hi, I&apos;m <span className="inline-block -rotate-2 font-hand font-semibold text-[1.3em] leading-none">Shantanu</span>
                                    </h1>
                                    <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted">
                                        <span className="truncate">
                                            {profile.jobTitle} at <span className="text-foreground">{profile.company}</span>
                                        </span>
                                        <span className="hidden items-center gap-1 sm:inline-flex">
                                            · <MapPin className="size-3" /> {profile.location}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <ThemeToggle />
                                {visibility.contact && <Button size="sm" variant="primary" className="hidden sm:inline-flex" onPress={() => setTab("contact")}>
                                    <Send className="size-3.5" />
                                    Hire me
                                </Button>}
                            </div>
                        </header>

                        <section aria-labelledby="panel-heading" className="min-w-0">
                            <h2 id="panel-heading" className="sr-only">
                                {active.label}
                            </h2>
                            <AnimatePresence mode="wait" initial={false} custom={direction}>
                                <motion.div
                                    key={tab}
                                    custom={direction}
                                    variants={{
                                        enter: (d: number) => ({ opacity: 0, x: d * 28, filter: "blur(6px)" }),
                                        center: { opacity: 1, x: 0, filter: "blur(0px)" },
                                        exit: (d: number) => ({ opacity: 0, x: d * -28, filter: "blur(6px)" }),
                                    }}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {PANELS[tab]}
                                </motion.div>
                            </AnimatePresence>
                        </section>

                        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-separator pt-4 font-mono text-[11px] text-muted">
                            <span>© {new Date().getFullYear()} {profile.name}</span>
                            <span className="inline-flex items-center gap-1">
                                Press
                                <Kbd>
                                    <Kbd.Abbr keyValue="command" />
                                    <Kbd.Content>K</Kbd.Content>
                                </Kbd>
                                to search
                            </span>
                        </footer>
                    </motion.main>
                </div>
            {/* Fixed / portalled UI */}

            {/* Content scrolling under the dock melts into blur instead of colliding with it */}
            <ProgressiveBlur position="bottom" className="fixed inset-x-0 bottom-0 z-30 h-28" />
            <Dock
                groups={[
                    visibleNav.map((n) => ({ ...n, active: tab === n.id, onPress: () => setTab(n.id) })),
                    [
                        { id: "search", label: "Search (⌘K)", icon: Search, onPress: () => setPaletteOpen(true), desktopOnly: true },
                        { id: "resume", label: "Résumé", icon: FileText, onPress: () => setResumeOpen(true) },
                    ],
                    [
                        { id: "github", label: "GitHub", icon: Github, onPress: () => openExternal(GITHUB_URL), desktopOnly: true },
                        { id: "linkedin", label: "LinkedIn", icon: Linkedin, onPress: () => openExternal(LINKEDIN_URL), desktopOnly: true },
                        { id: "email", label: "Email", icon: Mail, onPress: () => (window.location.href = `mailto:${EMAIL}`), desktopOnly: true },
                    ],
                ]}
            />

            <CommandPalette
                open={paletteOpen}
                onOpenChange={setPaletteOpen}
                onNavigate={setTab}
                visibility={visibility}
                onOpenResume={() => setResumeOpen(true)}
            />
            <ResumeDialog open={resumeOpen} onOpenChange={setResumeOpen} />
            <GlassCursor />
        </MotionConfig>
    );
}

function ResumeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    return (
        <Modal.Backdrop isOpen={open} onOpenChange={onOpenChange}>
            <Modal.Container>
                <Modal.Dialog className="flex h-[88vh] w-full flex-col sm:max-w-4xl">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>Résumé</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body className="min-h-0 flex-1">
                        <PdfViewer file="/api/resume" downloadUrl="/api/resume?download=1" className="h-full" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button slot="close" variant="secondary">
                            Close
                        </Button>
                        <Button variant="primary" onPress={() => openExternal(RESUME_URL)}>
                            <Download className="size-3.5" />
                            Download PDF
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}
