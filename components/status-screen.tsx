"use client";

import React from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { Card } from "@heroui/react";
import { ArrowUpRight } from "@/components/icons";
import { Bento, hoverArrow, hoverIcon, Tile } from "./ui/motion";

export interface StatusLink {
    href: string;
    label: string;
    note: string;
    icon: React.ComponentType<{ className?: string }>;
}

/** Shared full-screen glass layout for 404 / error pages. */
export function StatusScreen({
    code,
    title,
    description,
    actions,
    links,
    footnote,
}: {
    code: string;
    title: React.ReactNode;
    description: string;
    actions: React.ReactNode;
    links?: StatusLink[];
    footnote?: React.ReactNode;
}) {
    return (
        <MotionConfig reducedMotion="user">
            <main className="grid min-h-svh place-items-center px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 20 }}
                    className="glass-shell w-full max-w-2xl rounded-4xl p-6 text-center sm:p-12"
                >
                    {/* Floating status code */}
                    <p aria-hidden="true" className="flex justify-center gap-1 font-display text-[clamp(5rem,22vw,9rem)] leading-none font-bold tracking-tighter text-foreground select-none">
                        {code.split("").map((ch, i) => (
                            <motion.span
                                key={i}
                                className={i === 1 ? "font-serif font-normal italic" : undefined}
                                initial={{ opacity: 0, y: 30, rotate: -8 }}
                                animate={{ opacity: 1, y: [0, -10, 0], rotate: 0 }}
                                transition={{
                                    opacity: { delay: 0.1 + i * 0.08 },
                                    rotate: { delay: 0.1 + i * 0.08, type: "spring", stiffness: 200 },
                                    y: { delay: 0.6 + i * 0.15, duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                                }}
                            >
                                {ch}
                            </motion.span>
                        ))}
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 24 }}
                        className="mx-auto mt-4 grid max-w-md gap-3"
                    >
                        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
                        <p className="text-sm leading-relaxed text-muted sm:text-base">{description}</p>
                        <div className="mt-2 flex flex-wrap justify-center gap-2">{actions}</div>
                    </motion.div>

                    {links && links.length > 0 && (
                        <Bento className="mt-8 grid gap-3 text-left sm:grid-cols-3">
                            {links.map(({ href, label, note, icon: Icon }) => (
                                <Tile key={href}>
                                    <Link href={href} className="group block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-focus">
                                        <Card className="h-full">
                                            <Card.Header className="flex flex-row items-center justify-between">
                                                <motion.span variants={hoverIcon} className="grid size-9 place-items-center rounded-xl bg-default">
                                                    <Icon className="size-4 text-foreground" />
                                                </motion.span>
                                                <motion.span variants={hoverArrow}>
                                                    <ArrowUpRight className="size-4 text-muted" />
                                                </motion.span>
                                            </Card.Header>
                                            <Card.Content>
                                                <span className="block font-display text-sm font-medium text-foreground">{label}</span>
                                                <span className="block text-xs text-muted">{note}</span>
                                            </Card.Content>
                                        </Card>
                                    </Link>
                                </Tile>
                            ))}
                        </Bento>
                    )}

                    {footnote && <p className="mt-6 font-mono text-[11px] text-muted">{footnote}</p>}
                </motion.div>
            </main>
        </MotionConfig>
    );
}
