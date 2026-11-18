"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CommandPalette } from "./command-palette";
import ThemeToggle from "./theme-toggle/ThemeToggle";
import { Search, Menu, X, Github, Linkedin } from "lucide-react";
import AvatarImg from "@/public/AvatarImage.png";

const NAV_ITEMS = [
    { label: "Overview", href: "#overview" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Stack", href: "#stack" },
    { label: "Experience", href: "#experience" },
    { label: "Activity", href: "#activity" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [commandOpen, setCommandOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 max-w-5xl mx-auto">
                <div className="glass-pill rounded-full px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 transition-all">
                    {/* Brand / Avatar Pill */}
                    <Link
                        href="#overview"
                        className="flex items-center gap-2.5 group select-none pr-1"
                        aria-label="Home"
                    >
                        <div className="relative size-7 rounded-full overflow-hidden border border-border/80 group-hover:scale-105 transition-transform shrink-0">
                            <Image
                                src={AvatarImg}
                                alt="Shantanu Suthar"
                                width={28}
                                height={28}
                                priority
                                className="size-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-xs text-foreground tracking-tight group-hover:text-primary transition-colors">
                                Shantanu Suthar
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-muted/70 transition-all"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Actions: Command Search & External & Theme Toggle */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* ⌘K Command Search Pill */}
                        <button
                            type="button"
                            onClick={() => setCommandOpen(true)}
                            className="flex items-center gap-2 h-8 px-2.5 sm:px-3 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all text-xs font-medium"
                            aria-label="Search or press ⌘K"
                        >
                            <Search className="size-3.5" />
                            <span className="hidden md:inline">Search</span>
                            <kbd className="inline-flex items-center gap-0.5 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-mono border border-border/60">
                                ⌘K
                            </kbd>
                        </button>

                        {/* Social Icons */}
                        <Link
                            href="https://github.com/SutharShantanu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-8 rounded-full border border-border/70 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                            aria-label="GitHub Profile"
                        >
                            <Github className="size-4" />
                        </Link>
                        <Link
                            href="https://linkedin.com/in/shantanu-suthar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-8 rounded-full border border-border/70 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground hidden sm:flex items-center justify-center transition-colors"
                            aria-label="LinkedIn Profile"
                        >
                            <Linkedin className="size-4" />
                        </Link>

                        <ThemeToggle />

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden size-8 rounded-full border border-border/70 bg-muted/30 text-muted-foreground hover:text-foreground flex items-center justify-center"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileOpen && (
                    <div className="lg:hidden mt-2 glass-panel rounded-2xl p-4 space-y-1.5 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground px-2">
                            <span>Available for work</span>
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                    </div>
                )}
            </header>

            <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        </>
    );
}
