"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimate, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "framer-motion";
import NumberFlow from "@number-flow/react";

// Server HTML must be visible (LCP/no-JS); only tiles mounted after hydration animate in.
let hydrated = false;

const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

const rise: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.98, filter: "blur(6px)" },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { type: "spring", stiffness: 260, damping: 26 },
    },
};

/** Grid container that staggers its <Tile> children in on mount. */
export function Bento({ className, children }: { className?: string; children: React.ReactNode }) {
    const [animateIn] = useState(() => hydrated);
    useEffect(() => {
        hydrated = true;
    }, []);
    return (
        <motion.div className={className} variants={stagger} initial={animateIn ? "hidden" : false} animate="show">
            {children}
        </motion.div>
    );
}

/** Bento cell: rises in with its siblings, lifts on hover. Put grid spans here; child Card should be h-full. */
export function Tile({ className, children, lift = true }: { className?: string; children: React.ReactNode; lift?: boolean }) {
    return (
        <motion.div
            className={className}
            variants={rise}
            whileHover={lift ? { y: -4, transition: { type: "spring", stiffness: 400, damping: 22 } } : undefined}
        >
            {children}
        </motion.div>
    );
}

/** Number that counts up from 0 once mounted. */
export function CountUp({ value, suffix }: { value: number; suffix?: string }) {
    const [shown, setShown] = useState(0);
    useEffect(() => {
        const id = requestAnimationFrame(() => setShown(value));
        return () => cancelAnimationFrame(id);
    }, [value]);
    return <NumberFlow value={shown} suffix={suffix} />;
}

/** transitions.dev "icon swap": old content scales/blurs out, new scales/blurs in. Change `swapKey` to trigger. */
export function IconSwap({ swapKey, children, className }: { swapKey: string; children: React.ReactNode; className?: string }) {
    return (
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
                key={swapKey}
                className={className ?? "inline-flex items-center gap-1.5"}
                initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.span>
        </AnimatePresence>
    );
}

/** transitions.dev "error state shake": returns a ref + a function that shakes it horizontally. */
export function useShake<T extends HTMLElement>() {
    const [scope, animate] = useAnimate<T>();
    const reduce = useReducedMotion();
    const shake = () => {
        if (!scope.current || reduce) return;
        animate(scope.current, { x: [0, -8, 8, -6, 6, -3, 3, 0] }, { duration: 0.45, ease: "easeOut" });
    };
    return [scope, shake] as const;
}

/** transitions.dev "3D tilt": pointer-driven tilt with a soft glare. Mouse only; off for reduced motion. */
export function Tilt({ children, className, max = 6 }: { children: React.ReactNode; className?: string; max?: number }) {
    const reduce = useReducedMotion();
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const spring = { stiffness: 220, damping: 22, mass: 0.4 };
    const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
    const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
    const glareX = useTransform(px, (v) => `${v * 100}%`);
    const glareY = useTransform(py, (v) => `${v * 100}%`);
    const glare = useMotionTemplate`radial-gradient(400px circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.22), transparent 60%)`;

    if (reduce) return <div className={className}>{children}</div>;

    return (
        <motion.div
            className={`group/tilt relative ${className ?? ""}`}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            onPointerMove={(e) => {
                if (e.pointerType !== "mouse") return;
                const r = e.currentTarget.getBoundingClientRect();
                px.set((e.clientX - r.left) / r.width);
                py.set((e.clientY - r.top) / r.height);
            }}
            onPointerLeave={() => {
                px.set(0.5);
                py.set(0.5);
            }}
        >
            {children}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
                style={{ background: glare }}
            />
        </motion.div>
    );
}
