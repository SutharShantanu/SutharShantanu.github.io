"use client";

import React from "react";
import { Link } from "@heroui/react";
import { FluidReveal } from "../ui/fluid-reveal";

export function Summary() {
    return (
        <FluidReveal id="about" aria-labelledby="about-heading" className="scroll-mt-12">
            <h2
                id="about-heading"
                className="relative text-foreground text-[15px] font-medium leading-6 mb-3.5"
            >
                <span
                    aria-hidden="true"
                    className="sm:absolute sm:top-0 sm:right-[calc(100%+12px)] text-muted font-normal tabular-nums mr-2 sm:mr-0 inline-block"
                >
                    1
                </span>
                About
            </h2>

            <div className="grid gap-5 text-muted text-[15px] leading-relaxed">
                <p>
                    I’m a Frontend Developer based in Gurugram, India, crafting high-performance web applications, responsive digital publications, and fluid design systems.
                </p>
                <p>
                    At{" "}
                    <Link
                        href="https://infyni.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground inline-flex items-center gap-0.5"
                    >
                        Infyni
                        <Link.Icon className="size-3" />
                    </Link>
                    , I architect enterprise portal interfaces, component systems, and authentication flows using Next.js, React, and TypeScript. I care deeply about the small details — smooth motion, accessible navigation, and sub-second load times.
                </p>
            </div>
        </FluidReveal>
    );
}
