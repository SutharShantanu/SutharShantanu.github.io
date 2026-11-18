"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { FluidReveal } from "../ui/fluid-reveal";

const ELSEWHERE_LINKS = [
    {
        title: "GitHub",
        href: "https://github.com/SutharShantanu",
        label: "GitHub profile and open source repositories",
        note: "Code & open source",
    },
    {
        title: "LinkedIn",
        href: "https://linkedin.com/in/shantanu-suthar",
        label: "LinkedIn professional profile and network",
        note: "Career & network",
    },
    {
        title: "Résumé",
        href: "https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13",
        label: "Download résumé PDF",
        note: "Curriculum Vitae",
    },
    {
        title: "Email",
        href: "mailto:shantanusut2000@gmail.com",
        label: "Send direct email",
        note: "shantanusut2000@gmail.com",
    },
];

export function GlassFolders() {
    return (
        <FluidReveal id="elsewhere" aria-labelledby="elsewhere-heading" className="scroll-mt-12">
            <h2
                id="elsewhere-heading"
                className="relative text-foreground text-[15px] font-medium leading-6 mb-2"
            >
                <span
                    aria-hidden="true"
                    className="sm:absolute sm:top-0 sm:right-[calc(100%+12px)] text-muted font-normal tabular-nums mr-2 sm:mr-0 inline-block"
                >
                    4
                </span>
                Elsewhere
            </h2>

            <p className="mb-8 max-w-[360px] text-muted text-[15px]">
                A few other places I keep things on the internet.
            </p>

            <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-6 sm:gap-y-8" data-folder-links="true">
                {ELSEWHERE_LINKS.map((folder) => (
                    <a
                        key={folder.title}
                        className="group folder-link block min-w-0 rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        href={folder.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={folder.label}
                    >
                        <span className="relative block">
                            <span className="folder-shell" aria-hidden="true">
                                <svg
                                    className="folder-back"
                                    viewBox="0 0 200 120"
                                    preserveAspectRatio="none"
                                    focusable="false"
                                >
                                    <title>Decorative folder back</title>
                                    <path
                                        className="folder-back-shape"
                                        d="M17 4H79C83 4 86 5 89 8L102 20H185C193 20 197 25 197 32V106C197 113 192 117 185 117H15C8 117 3 112 3 105V18C3 10 9 4 17 4Z"
                                    />
                                </svg>
                                <span className="folder-paper folder-paper-back">
                                    <span className="paper-line paper-line-short" />
                                    <span className="paper-line" />
                                    <span className="paper-line" />
                                </span>
                                <span className="folder-paper folder-paper-middle">
                                    <span className="paper-line paper-line-short" />
                                    <span className="paper-line" />
                                </span>
                                <span className="folder-paper folder-paper-front">
                                    <span className="paper-line paper-line-short" />
                                    <span className="paper-line" />
                                    <span className="paper-line paper-line-medium" />
                                </span>
                                <span className="folder-front">
                                    <span className="relative z-1 flex items-center justify-between w-full text-[14px] font-medium leading-5 text-white/95">
                                        <span className="truncate">{folder.title}</span>
                                        <ArrowUpRight className="size-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                                    </span>
                                </span>
                            </span>
                        </span>
                        <span className="block text-[12px] text-muted/70 mt-2 px-1 truncate font-mono">
                            {folder.note}
                        </span>
                    </a>
                ))}
            </div>
        </FluidReveal>
    );
}
