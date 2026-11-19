"use client";

/**
 * Floating "tubelight" dock.
 * Inspired by 21st.dev Tubelight Navbar (glowing lamp over the active item)
 * and Expandable Tabs (active item expands to reveal its label).
 * Rebuilt with HeroUI Button/Tooltip/Separator + framer-motion.
 */
import React, { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button, Separator, Tooltip } from "@heroui/react";

export interface DockItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onPress: () => void;
    active?: boolean;
    /** Hide on narrow screens to keep the dock within a phone width. */
    desktopOnly?: boolean;
}

const spring = { type: "spring", stiffness: 380, damping: 30 } as const;

function DockButton({ item }: { item: DockItem }) {
    const Icon = item.icon;
    return (
        <motion.div layout transition={spring} className={`relative shrink-0 ${item.desktopOnly ? "hidden sm:block" : ""}`}>
            {item.active && (
                <motion.div layoutId="dock-lamp" transition={spring} className="absolute inset-0 rounded-2xl bg-surface shadow-[inset_0_0_0_1px_var(--glass-edge)]">
                    {/* The tubelight: a bar on top with layered glows */}
                    <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-foreground">
                        <div className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-foreground/20 blur-md" />
                        <div className="absolute -top-1 h-6 w-8 rounded-full bg-foreground/20 blur-md" />
                        <div className="absolute top-0 left-2 h-4 w-4 rounded-full bg-foreground/20 blur-sm" />
                    </div>
                </motion.div>
            )}
            <Tooltip delay={150} closeDelay={0} isDisabled={item.active}>
                <Button
                    variant="ghost"
                    aria-label={item.label}
                    aria-current={item.active ? "page" : undefined}
                    onPress={item.onPress}
                    className={`relative h-10 min-w-10 gap-0 rounded-2xl px-2.5 sm:h-11 sm:min-w-11 sm:px-3 data-[hovered=true]:bg-default ${item.active ? "text-foreground" : "text-muted"}`}
                >
                    <motion.span whileTap={{ scale: 0.85 }} className="grid place-items-center">
                        <Icon className="size-5" />
                    </motion.span>
                    <AnimatePresence initial={false}>
                        {item.active && (
                            <motion.span
                                key="label"
                                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                                animate={{ width: "auto", opacity: 1, marginLeft: 8 }}
                                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                                transition={spring}
                                className="hidden overflow-hidden font-display text-sm font-medium whitespace-nowrap sm:inline-block"
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
                <Tooltip.Content placement="top" offset={12}>
                    {item.label}
                </Tooltip.Content>
            </Tooltip>
        </motion.div>
    );
}

/** Floating glass dock. `groups` are separated by a divider. */
export function Dock({ groups }: { groups: DockItem[][] }) {
    // Scroll-aware: tuck away while scrolling down, return on scroll up (or near the top).
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    useMotionValueEvent(scrollY, "change", (y) => {
        const prev = scrollY.getPrevious() ?? 0;
        if (Math.abs(y - prev) < 4) return;
        setHidden(y > prev && y > 160);
    });

    return (
        <motion.nav
            aria-label="Portfolio navigation"
            initial={{ y: 80, opacity: 0 }}
            animate={hidden ? { y: 96, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onFocusCapture={() => setHidden(false)}
            style={{ pointerEvents: hidden ? "none" : undefined }}
            className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-2 sm:bottom-4 sm:px-3"
        >
            <motion.div
                layout
                transition={spring}
                style={{ background: "color-mix(in oklab, var(--overlay) 72%, transparent)" }}
                className="glass-shell flex max-w-full items-center gap-0.5 overflow-x-auto rounded-[1.75rem] p-1.5 [scrollbar-width:none] sm:gap-1 backdrop-blur-sm"
            >
                {groups.map((group, gi) => (
                    <React.Fragment key={gi}>
                        {gi > 0 && (
                            <Separator
                                orientation="vertical"
                                className="mx-1 hidden h-6 sm:block"
                            />
                        )}
                        {group.map((item) => (
                            <DockButton key={item.id} item={item} />
                        ))}
                    </React.Fragment>
                ))}
            </motion.div>
        </motion.nav>
    );
}
