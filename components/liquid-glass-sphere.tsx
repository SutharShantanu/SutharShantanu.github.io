"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function LiquidGlassSphere() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse coordinates for interactive parallax & specular tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Silky spring physics for pointer response
    const springConfig = { damping: 24, stiffness: 140, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // Parallax tilt transforms for the 3D sphere
    const rotateY = useTransform(smoothX, [-200, 200], [-12, 12]);
    const rotateX = useTransform(smoothY, [-200, 200], [12, -12]);

    // Glare & inner specular highlight shift
    const glareX = useTransform(smoothX, [-200, 200], [-28, 28]);
    const glareY = useTransform(smoothY, [-200, 200], [-24, 24]);

    // Shadow cast parallax opposite to light
    const shadowX = useTransform(smoothX, [-200, 200], [15, -15]);
    const shadowY = useTransform(smoothY, [-200, 200], [15, -15]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="pointer-events-auto absolute inset-0 flex items-center justify-center -z-10 select-none overflow-visible"
            aria-hidden="true"
        >
            {/* Ambient diffuse background aura */}
            <div className="absolute size-[380px] sm:size-[460px] md:size-[520px] rounded-full bg-gradient-to-tr from-sky-400/[0.08] via-indigo-500/[0.06] to-transparent blur-3xl dark:from-sky-500/[0.12] dark:via-purple-500/[0.08]" />

            {/* Orbital Outer Halo Ring (Slow Rotation) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute size-[310px] sm:size-[370px] md:size-[420px] rounded-full border border-dashed border-black/[0.06] dark:border-white/[0.08]"
            >
                {/* Micro orbit particle */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-foreground/30 dark:bg-foreground/50 shadow-xs" />
            </motion.div>

            {/* Secondary Fine Ring with Breathing Scale */}
            <motion.div
                animate={{
                    scale: [1, 1.03, 0.98, 1],
                    opacity: [0.5, 0.75, 0.6, 0.5],
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute size-[260px] sm:size-[310px] md:size-[350px] rounded-full border border-black/[0.05] dark:border-white/[0.07]"
            />

            {/* 3D Glass Sphere Body with Interactive Physics */}
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    perspective: 1000,
                    transformStyle: "preserve-3d",
                }}
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    y: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                }}
                className="relative size-[210px] sm:size-[250px] md:size-[280px] rounded-full transition-shadow duration-300"
            >
                {/* Sphere Drop Shadow beneath orb */}
                <motion.div
                    style={{ x: shadowX, y: shadowY }}
                    className="absolute inset-0 rounded-full shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]"
                />

                {/* Primary Glass Layer (Fresnel rim, frosted depth, backdrop refraction) */}
                <div className="absolute inset-0 rounded-full border border-black/[0.08] dark:border-white/[0.16] backdrop-blur-[2px] bg-gradient-to-b from-white/40 via-white/10 to-transparent dark:from-white/[0.08] dark:via-white/[0.02] dark:to-transparent overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-20px_40px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-20px_40px_rgba(0,0,0,0.4)]">
                    {/* Inner Refraction Depth Ring */}
                    <div className="absolute inset-2 rounded-full border border-black/[0.03] dark:border-white/[0.06] bg-gradient-to-tr from-sky-500/[0.04] via-transparent to-amber-500/[0.03] dark:from-sky-400/[0.06] dark:to-purple-400/[0.05]" />

                    {/* Dynamic Specular Lens Flare tracking mouse */}
                    <motion.div
                        style={{ x: glareX, y: glareY }}
                        className="absolute top-[16%] left-[20%] w-[38%] h-[26%] rounded-full bg-gradient-to-br from-white/80 via-white/30 to-transparent blur-[2px] dark:from-white/60 dark:via-white/20 pointer-events-none"
                    />

                    {/* Secondary subtle lower reflection */}
                    <motion.div
                        style={{ x: glareX, y: glareY }}
                        className="absolute bottom-[14%] right-[22%] w-[28%] h-[16%] rounded-full bg-gradient-to-tl from-white/40 to-transparent blur-[3px] dark:from-white/20 pointer-events-none"
                    />

                    {/* Fine Glass Meridian Arc */}
                    <div className="absolute inset-0 rounded-full border-t border-white/60 dark:border-white/30 opacity-60" />
                </div>
            </motion.div>
        </div>
    );
}
