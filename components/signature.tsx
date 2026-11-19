"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export function Signature({ className = "" }: { className?: string }) {
    const [replayKey, setReplayKey] = useState(0);

    const handleReplay = () => {
        setReplayKey((prev) => prev + 1);
    };

    return (
        <div
            className={`group inline-flex flex-col items-center justify-center cursor-pointer select-none ${className}`}
            onClick={handleReplay}
            title="Shantanu Suthar (Click to replay signature)"
            role="img"
            aria-label="Shantanu Suthar handwritten cursive signature"
        >
            <motion.div
                key={replayKey}
                variants={{ rest: { rotate: -1.5, scale: 0.98 }, hover: { rotate: 0, scale: 1.02 } }}
                initial="rest"
                animate="rest"
                whileHover="hover"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
            >
                {/* Vector Cursive Signature SVG with Fluid Stroke Draw */}
                <svg
                    viewBox="0 0 380 95"
                    className="w-[260px] sm:w-[320px] md:w-[360px] h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Definitions for subtle gradient & filter */}
                    <defs>
                        <filter id="ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodOpacity="0.08" />
                        </filter>
                    </defs>

                    {/* Main Signature Ink Strokes (Shantanu) */}
                    <motion.path
                        d="M 28 62 C 22 42, 28 16, 42 14 C 54 12, 56 26, 46 40 C 32 58, 20 66, 26 73 C 32 78, 48 76, 56 64 C 59 60, 61 40, 62 30 C 63 24, 66 23, 67 26 C 68 32, 66 52, 65 65 C 68 58, 75 52, 81 54 C 86 56, 86 63, 85 68 C 87 63, 93 54, 100 54 C 106 54, 105 65, 100 68 C 95 70, 90 66, 91 60 C 92 55, 98 52, 103 53 C 107 54, 108 61, 106 68 C 109 62, 114 54, 120 54 C 126 54, 127 60, 126 68 C 129 60, 137 54, 143 54 C 149 54, 150 62, 148 68 C 151 61, 154 44, 156 36 C 158 32, 160 33, 160 38 C 158 48, 157 58, 158 68 C 162 68, 166 65, 168 62"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-foreground"
                        filter="url(#ink-bleed)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 1.6,
                            ease: [0.25, 0.1, 0.25, 1.0],
                        }}
                    />

                    {/* T-cross for Shantanu */}
                    <motion.path
                        d="M 148 44 C 154 43, 164 43, 168 42"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        className="text-foreground"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 0.35,
                            delay: 0.9,
                            ease: "easeOut",
                        }}
                    />

                    {/* Latter part of Shantanu ('anu') */}
                    <motion.path
                        d="M 168 62 C 171 56, 177 53, 183 54 C 188 55, 188 64, 183 67 C 178 70, 174 65, 175 60 C 176 54, 182 52, 187 53 C 190 54, 191 60, 189 67 C 192 61, 197 54, 203 54 C 209 54, 210 61, 208 67 C 211 61, 215 54, 222 54 C 228 54, 227 63, 224 67 C 226 62, 231 54, 237 54 C 242 54, 241 62, 239 67"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-foreground"
                        filter="url(#ink-bleed)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 1.1,
                            delay: 0.6,
                            ease: [0.25, 0.1, 0.25, 1.0],
                        }}
                    />

                    {/* Second Name 'Suthar' */}
                    <motion.path
                        d="M 252 58 C 246 40, 252 16, 264 14 C 274 12, 276 24, 268 38 C 256 55, 244 64, 250 71 C 256 76, 270 74, 277 64 C 280 60, 283 54, 289 54 C 295 54, 294 62, 291 67 C 293 61, 297 54, 303 54 C 308 54, 307 62, 305 67 C 308 60, 310 44, 312 36 C 313 32, 316 33, 315 38 C 313 48, 312 58, 313 67 C 317 60, 323 54, 329 54 C 334 54, 334 62, 333 67 C 335 62, 340 54, 346 54 C 352 54, 351 63, 347 67 C 349 61, 353 54, 359 54 C 365 54, 368 59, 364 64 C 361 68, 356 68, 355 64 C 356 59, 363 56, 368 56"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-foreground"
                        filter="url(#ink-bleed)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 1.5,
                            delay: 1.1,
                            ease: [0.25, 0.1, 0.25, 1.0],
                        }}
                    />

                    {/* T-cross for Suthar */}
                    <motion.path
                        d="M 304 44 C 310 43, 319 43, 323 42"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        className="text-foreground"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 0.35,
                            delay: 1.9,
                            ease: "easeOut",
                        }}
                    />

                    {/* Dynamic Underline Flourish */}
                    <motion.path
                        d="M 372 74 C 290 85, 150 86, 34 76 C 18 74, 14 78, 28 80 C 88 86, 210 85, 298 81"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="text-muted/60"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.7 }}
                        transition={{
                            duration: 1.2,
                            delay: 2.1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    />
                </svg>

                {/* Subtle replay prompt, revealed by the parent's "hover" variant */}
                <motion.span
                    variants={{ rest: { opacity: 0, y: -2 }, hover: { opacity: 1, y: 0 } }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-hand text-base text-muted pointer-events-none whitespace-nowrap"
                >
                    click to replay
                </motion.span>
            </motion.div>
        </div>
    );
}
