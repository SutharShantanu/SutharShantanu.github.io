"use client";

import { RevealText } from "../ui/motion";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, Card, Tabs } from "@heroui/react";
import { SKILLS, type SkillCategory } from "./constants/skills.constant";

const CATEGORIES: ("All" | SkillCategory)[] = ["All", "Frontend", "Backend", "Deployment", "Tools"];

export default function Skills() {
    const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
    const visible = category === "All" ? SKILLS : SKILLS.filter((s) => s.category === category);

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        <RevealText text="Skills & technologies" />
                    </h2>
                    <p className="font-hand text-lg text-muted">Tools I use across the stack</p>
                </div>
                <div className="w-full min-w-0 overflow-x-auto [scrollbar-width:none] sm:w-auto">
                <Tabs selectedKey={category} onSelectionChange={(k) => setCategory(k as typeof category)}>
                    <Tabs.ListContainer className="max-w-full">
                        <Tabs.List aria-label="Skill categories">
                            {CATEGORIES.map((c) => (
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

            <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                <AnimatePresence mode="popLayout" initial={false}>
                    {visible.map((skill, i) => (
                        <motion.li
                            key={skill.title}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.02, type: "spring", stiffness: 320, damping: 26 } }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -4, rotate: -1 }}
                            // Bento rhythm: every 5th tile spans two columns on wide screens
                            className={i % 5 === 0 ? "lg:col-span-2" : undefined}
                        >
                            <Card className="h-full">
                                <Card.Content className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                                    <Avatar size="md" className="shrink-0 bg-white p-1.5 dark:bg-white/90">
                                        {skill.icon ? <Avatar.Image src={skill.icon} alt="" className="object-contain" /> : null}
                                        <Avatar.Fallback>{skill.title.slice(0, 2)}</Avatar.Fallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="font-display text-sm font-medium text-foreground sm:truncate">{skill.title}</p>
                                        <p className="font-mono text-[11px] text-muted">{skill.category}</p>
                                    </div>
                                </Card.Content>
                            </Card>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </motion.ul>
        </div>
    );
}
