"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate, useAnimationFrame, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import NumberFlow from "@number-flow/react";

// Server HTML must be visible (LCP/no-JS); only tiles mounted after hydration animate in.
let hydrated = false;

const spring = { type: "spring", stiffness: 400, damping: 24 } as const;

const tileVariants: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.98, filter: "blur(6px)" },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { type: "spring", stiffness: 260, damping: 26 },
    },
    hover: { y: -4, transition: spring },
};

/** Child variants that react to a parent Tile's "hover" (icon tilt / arrow nudge). */
export const hoverIcon: Variants = {
    hidden: { rotate: 0, scale: 1 },
    show: { rotate: 0, scale: 1, transition: spring },
    hover: { rotate: -8, scale: 1.1, transition: spring },
};
export const hoverArrow: Variants = {
    hidden: { x: 0, y: 0 },
    show: { x: 0, y: 0, transition: spring },
    hover: { x: 2, y: -2, transition: spring },
};

const BentoContext = createContext(false);

/** Grid wrapper. Tiles reveal as they scroll into view (skipped on the first SSR paint for LCP). */
export function Bento({ className, children }: { className?: string; children: React.ReactNode }) {
    const [animateIn] = useState(() => hydrated);
    useEffect(() => {
        hydrated = true;
    }, []);
    return (
        <BentoContext.Provider value={animateIn}>
            <div className={className}>{children}</div>
        </BentoContext.Provider>
    );
}

/** Bento cell: rises in when scrolled into view, lifts on hover and passes "hover" to children. */
export function Tile({ className, children, lift = true }: { className?: string; children: React.ReactNode; lift?: boolean }) {
    const animateIn = useContext(BentoContext);
    return (
        <motion.div
            className={className}
            variants={tileVariants}
            initial={animateIn ? "hidden" : "show"}
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            whileHover={lift ? "hover" : undefined}
        >
            {children}
        </motion.div>
    );
}

/** Live-status dot: a framer-motion ripple instead of CSS animate-ping. */
export function Ping({ className = "bg-success" }: { className?: string }) {
    return (
        <span className="relative mr-1 inline-flex size-1.5">
            <motion.span
                aria-hidden="true"
                className={`absolute inset-0 rounded-full ${className}`}
                animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
            <span className={`relative inline-flex size-1.5 rounded-full ${className}`} />
        </span>
    );
}

/** Scroll-linked reading progress bar (useScroll + spring). */
export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
    return (
        <motion.div
            aria-hidden="true"
            style={{ scaleX }}
            className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-foreground/70"
        />
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
    const glareOpacity = useSpring(0, { stiffness: 200, damping: 30 });
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
            onPointerEnter={(e) => e.pointerType === "mouse" && glareOpacity.set(1)}
            onPointerLeave={() => {
                px.set(0.5);
                py.set(0.5);
                glareOpacity.set(0);
            }}
        >
            {children}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{ background: glare, opacity: glareOpacity }}
            />
        </motion.div>
    );
}

/**
 * Infinite logo marquee (inspired by React Bits "Logo Loop"), driven by framer-motion.
 * Decorative: pass the same names as visible text elsewhere for screen readers.
 * Pauses on hover; static row when the user prefers reduced motion.
 */
export function LogoLoop({ logos, speed = 28 }: { logos: { src: string; alt: string }[]; speed?: number }) {
    const reduce = useReducedMotion();
    const [paused, setPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    // Advance by frame time so it can pause in place; wrap at half (the duplicated row) for a seamless loop.
    useAnimationFrame((_, delta) => {
        const track = trackRef.current;
        if (reduce || paused || !track) return;
        const half = track.scrollWidth / 2;
        let next = x.get() - (half / speed) * (delta / 1000);
        if (-next >= half) next += half;
        x.set(next);
    });
    const row = (copy: number) =>
        logos.map((l, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- tiny local SVGs; next/image adds nothing here
            <img key={`${copy}-${i}`} src={l.src} alt="" className="size-7 shrink-0 opacity-80 transition-none" draggable={false} />
        ));
    return (
        <div
            aria-hidden="true"
            className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
        >
            <motion.div ref={trackRef} className="flex w-max gap-6 py-1 pr-6" style={{ x }}>
                {row(0)}
                {row(1)}
            </motion.div>
        </div>
    );
}

const revealWord: Variants = {
    hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Word-by-word blur-in-up text (adapted from Magic UI "Text Animate", blurInUp/by word preset).
 * Render inside your own heading/paragraph to keep semantics; screen readers get the plain string.
 */
export function RevealText({ text, delay = 0 }: { text: string; delay?: number }) {
    const words = text.split(/(\s+)/);
    return (
        <>
            <span className="sr-only">{text}</span>
            <motion.span
                aria-hidden="true"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delayChildren: delay, staggerChildren: 0.06 }}
            >
                {words.map((w, i) =>
                    /^\s+$/.test(w) ? (
                        w
                    ) : (
                        <motion.span key={i} variants={revealWord} className="inline-block">
                            {w}
                        </motion.span>
                    )
                )}
            </motion.span>
        </>
    );
}

/**
 * Hand-drawn marker (adapted from Magic UI "Highlighter").
 * - highlight: a background sweep (background-size 0% to 100%). Wraps across lines with
 *   box-decoration-break, so long phrases highlight every line instead of one SVG blob.
 * - underline: an SVG stroke drawn with framer-motion pathLength.
 */
export function Marker({
    children,
    variant = "highlight",
    color,
}: {
    children: React.ReactNode;
    variant?: "highlight" | "underline";
    color?: string;
}) {
    if (variant === "highlight") {
        const c = color ?? "oklch(0.85 0.13 60 / 0.55)";
        return (
            <motion.span
                className="rounded-[0.3em] px-0.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
                style={{ backgroundImage: `linear-gradient(${c}, ${c})`, backgroundRepeat: "no-repeat", backgroundPosition: "0 85%", backgroundSize: "0% 70%" }}
                initial={{ backgroundSize: "0% 70%" }}
                whileInView={{ backgroundSize: "100% 70%" }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
            >
                {children}
            </motion.span>
        );
    }
    return (
        <span className="relative isolate inline-block whitespace-nowrap">
            <svg
                aria-hidden="true"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                className="pointer-events-none absolute -inset-x-1 -bottom-1 -z-10 h-2"
                style={{ width: "calc(100% + 0.5rem)" }}
            >
                <motion.path
                    d="M2 12 C 30 6, 65 16, 98 8"
                    fill="none"
                    stroke={color ?? "var(--mesh-1)"}
                    strokeWidth={4}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
                />
            </svg>
            {children}
        </span>
    );
}

/** Text laid around a circle that slowly spins (adapted from Magic UI "Spinning Text"). */
export function SpinningText({ text, radius = 5, duration = 14, className = "" }: { text: string; radius?: number; duration?: number; className?: string }) {
    const letters = [...text, " "];
    return (
        <motion.div
            className={`relative ${className}`}
            animate={{ rotate: 360 }}
            transition={{ duration, ease: "linear", repeat: Infinity }}
            aria-hidden="true"
        >
            {letters.map((l, i) => (
                <span
                    key={i}
                    className="absolute top-1/2 left-1/2 inline-block"
                    style={{
                        transform: `translate(-50%, -50%) rotate(${(360 / letters.length) * i}deg) translateY(-${radius}ch)`,
                        transformOrigin: "center",
                    }}
                >
                    {l}
                </span>
            ))}
        </motion.div>
    );
}
