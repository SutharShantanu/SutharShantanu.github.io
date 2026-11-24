"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, Chip, Tabs } from "@heroui/react";
import { Bento, RevealText, Tile } from "../ui/motion";
import { SKILLS, type SkillCategory } from "./constants/skills.constant";

const CATEGORIES: { id: SkillCategory; note: string; span: string; cols: string }[] = [
    // lg: Frontend fills two columns and three rows; the small categories stack beside it, AI spans the bottom.
    { id: "Frontend", note: "Interfaces, design systems & motion", span: "lg:col-span-2 lg:row-span-3", cols: "grid-cols-3 sm:grid-cols-4" },
    { id: "Backend", note: "APIs & data", span: "", cols: "grid-cols-3" },
    { id: "Deployment", note: "Shipping & hosting", span: "", cols: "grid-cols-3" },
    { id: "Tools", note: "Daily drivers", span: "", cols: "grid-cols-3" },
    { id: "AI", note: "Agents & assistants I build with", span: "lg:col-span-3", cols: "grid-cols-3 sm:grid-cols-6" },
];

const spring = { type: "spring", stiffness: 420, damping: 24 } as const;

function SkillTile({ title, icon }: { title: string; icon: string }) {
    return (
        <motion.li
            className="flex min-w-0 flex-col items-center gap-2 rounded-2xl bg-default/60 px-2 py-3 text-center"
            initial="rest"
            animate="rest"
            whileHover="hover"
            variants={{ rest: { y: 0 }, hover: { y: -3, transition: spring } }}
        >
            <motion.span
                className="grid size-11 place-items-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5"
                variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -8, scale: 1.12, transition: spring } }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVGs */}
                <img src={icon} alt="" width={28} height={28} className="size-7 object-contain" draggable={false} />
            </motion.span>
            <span className="w-full truncate font-display text-xs font-medium text-foreground">{title}</span>
        </motion.li>
    );
}

export default function Skills() {
    const [focus, setFocus] = useState<"All" | SkillCategory>("All");

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        <RevealText text="Skills & technologies" />
                    </h2>
                    <p className="font-hand text-lg text-muted">{SKILLS.length} tools I use across the stack</p>
                </div>
                <div className="w-full min-w-0 overflow-x-auto [scrollbar-width:none] sm:w-auto">
                    <Tabs selectedKey={focus} onSelectionChange={(k) => setFocus(k as typeof focus)}>
                        <Tabs.ListContainer className="max-w-full">
                            <Tabs.List aria-label="Highlight a skill category">
                                {["All", ...CATEGORIES.map((c) => c.id)].map((c) => (
                                    <Tabs.Tab key={c} id={c}>
                                        {c}
                                        <Tabs.Indicator />
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs.ListContainer>
                    </Tabs>
                </div>
            </div>

            {/* Picking a tab spotlights its card and dims the rest, so the layout never jumps. */}
            <Bento className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {CATEGORIES.map((cat) => {
                    const items = SKILLS.filter((s) => s.category === cat.id);
                    const dimmed = focus !== "All" && focus !== cat.id;
                    return (
                        <Tile key={cat.id} className={cat.span} lift={false}>
                            <motion.div
                                className="h-full"
                                animate={{ opacity: dimmed ? 0.35 : 1, scale: dimmed ? 0.985 : 1, filter: dimmed ? "grayscale(1)" : "grayscale(0)" }}
                                transition={{ duration: 0.25 }}
                            >
                                <Card className="h-full">
                                    <Card.Header className="flex flex-row items-start justify-between gap-2">
                                        <div>
                                            <Card.Title>{cat.id}</Card.Title>
                                            <Card.Description>{cat.note}</Card.Description>
                                        </div>
                                        <Chip size="sm" variant="soft">
                                            {items.length}
                                        </Chip>
                                    </Card.Header>
                                    <Card.Content>
                                        <ul className={`grid gap-2 ${cat.cols}`} aria-label={`${cat.id} skills`}>
                                            {items.map((s) => (
                                                <SkillTile key={s.title} title={s.title} icon={s.icon} />
                                            ))}
                                        </ul>
                                    </Card.Content>
                                </Card>
                            </motion.div>
                        </Tile>
                    );
                })}
            </Bento>
        </div>
    );
}
