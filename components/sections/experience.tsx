"use client";

import React from "react";
import { Link, Chip, Separator } from "@heroui/react";
import { FluidReveal, FluidItem } from "../ui/fluid-reveal";
import { Experience as LinkedInExperience } from "./types/social.types";

interface ExperienceTimelineProps {
    linkedinExperiences?: LinkedInExperience[];
}

export default function ExperienceTimeline({
    linkedinExperiences,
}: ExperienceTimelineProps) {
    void linkedinExperiences;
    return (
        <FluidReveal id="experience" aria-labelledby="experience-heading" className="scroll-mt-12">
            <h2
                id="experience-heading"
                className="relative text-foreground text-[15px] font-medium leading-6 mb-6"
            >
                <span
                    aria-hidden="true"
                    className="sm:absolute sm:top-0 sm:right-[calc(100%+12px)] text-muted font-normal tabular-nums mr-2 sm:mr-0 inline-block"
                >
                    3
                </span>
                Experience
            </h2>

            <dl className="grid gap-6 text-[15px]">
                {/* Infyni */}
                <FluidItem delay={0.05} className="grid grid-cols-1 sm:grid-cols-[110px_minmax(0,1fr)] gap-1.5 sm:gap-6">
                    <dt className="text-muted text-sm sm:text-[15px] flex items-center gap-1.5 pt-0.5">
                        <Chip size="sm" variant="soft" color="success" className="text-[11px] font-medium">
                            Current
                        </Chip>
                    </dt>
                    <dd>
                        <Link
                            href="https://infyni.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-baseline gap-1 font-medium text-foreground hover:underline underline-offset-4"
                        >
                            <span>Associate Frontend Developer at Infyni</span>
                            <Link.Icon className="size-3 text-muted" />
                        </Link>
                        <span className="block text-muted text-sm mt-1 leading-relaxed">
                            Gurugram, India · Architecting corporate learning portals, role-based NextAuth.js authentication flows, and reusable design token systems with Next.js and TypeScript.
                        </span>
                    </dd>
                </FluidItem>

                <Separator className="opacity-50" />

                {/* Branding Pioneers */}
                <FluidItem delay={0.1} className="grid grid-cols-1 sm:grid-cols-[110px_minmax(0,1fr)] gap-1.5 sm:gap-6">
                    <dt className="text-muted text-sm sm:text-[15px] pt-0.5">2023</dt>
                    <dd>
                        <span className="font-medium text-foreground">
                            Frontend Developer at Branding Pioneers
                        </span>
                        <span className="block text-muted text-sm mt-1 leading-relaxed">
                            Gurugram, India · Developed high-conversion marketing surfaces, responsive multi-breakpoint layouts, SEO schema integrations, and web analytics pipelines.
                        </span>
                    </dd>
                </FluidItem>

                <Separator className="opacity-50" />

                {/* Masai School */}
                <FluidItem delay={0.15} className="grid grid-cols-1 sm:grid-cols-[110px_minmax(0,1fr)] gap-1.5 sm:gap-6">
                    <dt className="text-muted text-sm sm:text-[15px] pt-0.5">2022 – 2023</dt>
                    <dd>
                        <span className="font-medium text-foreground">
                            Full Stack Fellow at Masai School
                        </span>
                        <span className="block text-muted text-sm mt-1 leading-relaxed">
                            Remote, India · Completed rigorous 1,000+ hour full-stack coding curriculum with emphasis on data structures, algorithms, MERN stack, and collaborative Git agile sprints.
                        </span>
                    </dd>
                </FluidItem>
            </dl>
        </FluidReveal>
    );
}
