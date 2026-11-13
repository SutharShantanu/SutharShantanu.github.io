"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@heroui/react";
import ThemeToggle from "@/components/theme-toggle/ThemeToggle";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Journal", href: "#social" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="editorial-shell flex h-[4.5rem] items-center justify-between gap-5">
        <Link href="#home" aria-label="Shantanu Suthar home" className="group flex items-center gap-3">
          <span className="grid size-9 place-items-center border border-foreground text-xs font-semibold tracking-tight transition-colors group-hover:bg-foreground group-hover:text-background">
            SS.
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">Shantanu Suthar</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            as="a"
            href="#contact"
            variant="primary"
            className="h-9 rounded-none px-4 text-xs font-medium"
          >
            Let’s talk <ArrowUpRight size={14} />
          </Button>
        </div>
      </div>
    </header>
  );
}
