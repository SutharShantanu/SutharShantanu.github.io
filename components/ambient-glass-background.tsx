"use client";

import React from "react";
import { motion } from "framer-motion";

export function AmbientGlassBackground() {
    return (
        <div
            className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
            aria-hidden="true"
        >
            {/* Ambient Lighting Orbs */}
            <motion.div
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -30, 20, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sky-400/10 via-indigo-500/10 to-transparent blur-[120px] dark:from-sky-500/15 dark:via-indigo-500/10"
            />

            <motion.div
                animate={{
                    x: [0, -40, 30, 0],
                    y: [0, 40, -30, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute top-[35%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-violet-500/10 via-fuchsia-500/5 to-transparent blur-[130px] dark:from-violet-500/15 dark:via-fuchsia-500/10"
            />

            <motion.div
                animate={{
                    x: [0, 30, -30, 0],
                    y: [0, -20, 30, 0],
                    scale: [1, 1.15, 0.9, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                }}
                className="absolute bottom-[10%] left-[25%] w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-emerald-400/8 via-cyan-500/5 to-transparent blur-[140px] dark:from-emerald-500/10 dark:via-cyan-500/10"
            />

            {/* Subtle Texture Dot Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:24px_24px] opacity-75" />
        </div>
    );
}
