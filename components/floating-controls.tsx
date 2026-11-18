"use client";

import React, { useState } from "react";
import ThemeToggle from "./theme-toggle/ThemeToggle";
import { CommandPalette } from "./command-palette";
import { Search } from "lucide-react";
import { Button, Kbd, Tooltip } from "@heroui/react";

export function FloatingControls() {
    const [commandOpen, setCommandOpen] = useState(false);

    return (
        <>
            <aside aria-label="Quick site actions" className="fixed top-5 right-5 sm:top-6 sm:right-6 z-50 flex items-center gap-2">
                {/* HeroUI v3 Search Button with Kbd */}
                <Tooltip delay={200}>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full shadow-surface"
                        onPress={() => setCommandOpen(true)}
                        aria-label="Open command palette"
                    >
                        <Search className="size-3.5" />
                        <span className="hidden sm:inline text-xs">Search</span>
                        <Kbd className="hidden sm:inline">
                            <Kbd.Abbr keyValue="command" />
                            <Kbd.Content>K</Kbd.Content>
                        </Kbd>
                    </Button>
                    <Tooltip.Content>Quick navigation &amp; commands (⌘K)</Tooltip.Content>
                </Tooltip>

                {/* Theme Toggle Container */}
                <div className="rounded-full shadow-surface bg-surface border border-border p-0.5">
                    <ThemeToggle />
                </div>
            </aside>

            <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        </>
    );
}
