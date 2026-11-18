"use client";

import React from "react";
import { Chip, Separator } from "@heroui/react";
import { FluidReveal, FluidItem } from "../ui/fluid-reveal";

const CORE_STACK = [
    "Next.js 15",
    "React 19",
    "TypeScript",
    "HeroUI v3",
    "Tailwind CSS v4",
    "TanStack Query",
    "Framer Motion",
    "Zod",
    "Node.js",
    "Express",
    "MongoDB",
];

export default function Skills() {
    return (
        <FluidReveal id="education" aria-labelledby="education-heading" className="scroll-mt-12">
            <h2
                id="education-heading"
                className="relative text-foreground text-[15px] font-medium leading-6 mb-6"
            >
                <span
                    aria-hidden="true"
                    className="sm:absolute sm:top-0 sm:right-[calc(100%+12px)] text-muted font-normal tabular-nums mr-2 sm:mr-0 inline-block"
                >
                    5
                </span>
                Education &amp; Craft
            </h2>

            <dl className="grid gap-6 text-[15px]">
                {/* Education */}
                <FluidItem delay={0.05} className="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] gap-1 sm:gap-6">
                    <dt className="text-muted text-sm sm:text-[15px] pt-0.5">2022 – 2023</dt>
                    <dd>
                        <span className="font-medium text-foreground">
                            Full Stack Web Development
                        </span>
                        <span className="block text-muted text-sm mt-1 leading-relaxed">
                            Masai School · Intensive 1,000+ hour coding curriculum, data structures &amp; collaborative agile sprints.
                        </span>
                    </dd>
                </FluidItem>

                <Separator className="opacity-50" />

                {/* Core Craft */}
                <FluidItem delay={0.1} className="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] gap-1 sm:gap-6">
                    <dt className="text-muted text-sm sm:text-[15px] pt-1">Core Stack</dt>
                    <dd>
                        <span className="font-medium text-foreground">
                            Frontend Architecture &amp; UI Systems
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {CORE_STACK.map((tech) => (
                                <Chip
                                    key={tech}
                                    size="sm"
                                    variant="secondary"
                                    className="font-mono text-xs"
                                >
                                    {tech}
                                </Chip>
                            ))}
                        </div>
                    </dd>
                </FluidItem>
            </dl>
        </FluidReveal>
    );
}
