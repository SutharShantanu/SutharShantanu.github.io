"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "@heroui/react";
import { Signature } from "../signature";
import { LiquidGlassSphere } from "../liquid-glass-sphere";

export default function Hero() {
    return (
        <header
            id="top"
            className="relative grid min-h-[72svh] sm:min-h-[78svh] place-items-center overflow-visible isolate pt-12 pb-16"
        >
            {/* Interactive Liquid Glass Orb behind Signature */}
            <LiquidGlassSphere />

            {/* Central Typography & Introduction */}
            <div className="relative z-1 max-w-[420px] text-center px-4 flex flex-col items-center">
                {/* Handwritten Signature with live ink drawing */}
                <h1 id="intro-heading" className="flex justify-center focus:outline-none mb-5">
                    <Signature />
                </h1>

                {/* Fluid Subtitle using HeroUI v3 Link & Semantic Tokens */}
                <motion.p
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-muted text-[15px] sm:text-[16px] leading-[1.65] text-balance font-sans max-w-[340px]"
                >
                    Frontend Developer at{" "}
                    <Link
                        href="https://infyni.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground inline-flex items-center gap-0.5"
                    >
                        Infyni
                        <Link.Icon className="size-3" />
                    </Link>
                    .<br />
                    Crafting fluid, high-performance web experiences.
                </motion.p>
            </div>
        </header>
    );
}
