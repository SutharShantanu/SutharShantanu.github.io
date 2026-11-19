"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Kbd, Label, ListBox, Modal, SearchField, toast } from "@heroui/react";
import {
    Briefcase,
    Copy,
    Download,
    FileText,
    FolderGit2,
    Github,
    LayoutDashboard,
    Linkedin,
    Mail,
    Monitor,
    Moon,
    Sparkles,
    Sun,
    Users,
} from "lucide-react";
import type { TabKey } from "./shell/portfolio-shell";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from "./sections/constants/social.constant";

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onNavigate: (tab: TabKey) => void;
    onOpenResume: () => void;
}

interface Command {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    run: () => void;
}

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

export function CommandPalette({ open, onOpenChange, onNavigate, onOpenResume }: CommandPaletteProps) {
    const { setTheme } = useTheme();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, onOpenChange]);

    const commands = useMemo<Command[]>(
        () => [
            { id: "overview", label: "Go to Overview", icon: LayoutDashboard, run: () => onNavigate("overview") },
            { id: "work", label: "Go to Work", icon: FolderGit2, run: () => onNavigate("work") },
            { id: "experience", label: "Go to Experience", icon: Briefcase, run: () => onNavigate("experience") },
            { id: "skills", label: "Go to Skills", icon: Sparkles, run: () => onNavigate("skills") },
            { id: "social", label: "Go to Social", icon: Users, run: () => onNavigate("social") },
            { id: "contact", label: "Go to Contact", icon: Mail, run: () => onNavigate("contact") },
            {
                id: "copy-email",
                label: `Copy email (${EMAIL})`,
                icon: Copy,
                run: () => {
                    navigator.clipboard.writeText(EMAIL);
                    toast.success("Email copied to clipboard");
                },
            },
            { id: "resume", label: "View résumé", icon: FileText, run: onOpenResume },
            { id: "resume-download", label: "Download résumé (PDF)", icon: Download, run: () => openExternal(RESUME_URL) },
            { id: "light", label: "Switch to light theme", icon: Sun, run: () => setTheme("light") },
            { id: "dark", label: "Switch to dark theme", icon: Moon, run: () => setTheme("dark") },
            { id: "system", label: "Use system theme", icon: Monitor, run: () => setTheme("system") },
            { id: "github", label: "Open GitHub profile", icon: Github, run: () => openExternal(GITHUB_URL) },
            { id: "linkedin", label: "Open LinkedIn profile", icon: Linkedin, run: () => openExternal(LINKEDIN_URL) },
        ],
        [onNavigate, onOpenResume, setTheme]
    );

    const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()));

    const handleOpenChange = (next: boolean) => {
        if (!next) setQuery("");
        onOpenChange(next);
    };

    return (
        <Modal.Backdrop isOpen={open} onOpenChange={handleOpenChange}>
            <Modal.Container placement="top">
                <Modal.Dialog className="sm:max-w-[480px]">
                    <Modal.Header>
                        <SearchField aria-label="Search commands" value={query} onChange={setQuery} autoFocus className="w-full">
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input placeholder="Type a command or search..." />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                        </SearchField>
                    </Modal.Header>
                    <Modal.Body>
                        <ListBox
                            aria-label="Commands"
                            className="max-h-[360px] overflow-y-auto"
                            renderEmptyState={() => <p className="p-3 text-sm text-muted">No results found.</p>}
                            onAction={(key) => {
                                const cmd = commands.find((c) => c.id === key);
                                handleOpenChange(false);
                                cmd?.run();
                            }}
                        >
                            {filtered.map(({ id, label, icon: Icon }) => (
                                <ListBox.Item key={id} id={id} textValue={label}>
                                    <Icon className="size-4 text-muted" />
                                    <Label>{label}</Label>
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Modal.Body>
                    <Modal.Footer className="justify-start text-xs text-muted">
                        <Kbd>
                            <Kbd.Abbr keyValue="command" />
                            <Kbd.Content>K</Kbd.Content>
                        </Kbd>
                        to toggle
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}
