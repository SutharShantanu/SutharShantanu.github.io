"use client";

/**
 * Global "liquid glass" pointer, in the spirit of iPadOS / visionOS.
 * - Free: a small glass lens trails the native cursor and stretches along the motion (velocity squash).
 * - Over a compact control (link, button, tab…): the lens morphs to wrap it, like the iPad pointer.
 * - Over `[data-cursor="label"]`: becomes a glass pill showing the label.
 * Native cursor stays visible (precision + accessibility). Fine pointers only; off for reduced motion.
 */
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "framer-motion";

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], [role="option"], [role="menuitem"], select, summary';
const SIZE = 28;
const PAD = 6;
const spring = { stiffness: 380, damping: 32, mass: 0.6 };

export function GlassCursor() {
    const [enabled, setEnabled] = useState(false);
    const [visible, setVisible] = useState(false);
    const [label, setLabel] = useState<string | null>(null);

    const x = useSpring(-100, spring);
    const y = useSpring(-100, spring);
    const w = useSpring(SIZE, spring);
    const h = useSpring(SIZE, spring);
    const radius = useSpring(SIZE / 2, spring);
    const stretch = useSpring(0, { stiffness: 300, damping: 30 });
    const angle = useMotionValue(0);
    const scaleX = useTransform(stretch, (s) => 1 + s);
    const scaleY = useTransform(stretch, (s) => 1 - s * 0.45);

    const pointer = useRef({ x: -100, y: -100, t: 0 });
    const target = useRef<Element | null>(null);
    const labelRef = useRef<string | null>(null);

    useEffect(() => {
        const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
        const update = () => setEnabled(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const p = pointer.current;
            const dt = Math.max(1, e.timeStamp - p.t);
            const dx = e.clientX - p.x;
            const dy = e.clientY - p.y;
            const speed = Math.hypot(dx, dy) / dt; // px per ms
            if (speed > 0.05) angle.set((Math.atan2(dy, dx) * 180) / Math.PI);
            stretch.set(Math.min(0.5, speed * 0.12));
            pointer.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };

            const el = e.target instanceof Element ? e.target : null;
            const labelled = el?.closest<HTMLElement>("[data-cursor]");
            const next = labelled?.dataset.cursor ?? null;
            if (next !== labelRef.current) {
                labelRef.current = next;
                setLabel(next);
            }
            const hit = labelled ? null : el?.closest(INTERACTIVE);
            const r = hit?.getBoundingClientRect();
            // Big surfaces (whole cards as links) keep the free lens; only compact controls get wrapped.
            target.current = hit && r && r.width < 320 && r.height < 96 ? hit : null;
            setVisible(true);
        };
        const onLeave = () => setVisible(false);
        const onDown = () => stretch.set(-0.15);
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        window.addEventListener("pointerdown", onDown);
        return () => {
            window.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("pointerdown", onDown);
        };
    }, [enabled, angle, stretch]);

    // Re-measure every frame: smooth scroll moves controls under a still pointer.
    useAnimationFrame(() => {
        if (!enabled) return;
        stretch.set(stretch.get() * 0.9);
        const el = target.current;
        if (el?.isConnected) {
            const r = el.getBoundingClientRect();
            const br = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 12;
            w.set(r.width + PAD * 2);
            h.set(r.height + PAD * 2);
            x.set(r.left - PAD);
            y.set(r.top - PAD);
            radius.set(Math.min(br + PAD, (r.height + PAD * 2) / 2));
            angle.set(0);
            stretch.set(0);
            return;
        }
        const offset = labelRef.current ? 0 : SIZE / 2;
        w.set(SIZE);
        h.set(SIZE);
        radius.set(SIZE / 2);
        x.set(pointer.current.x - offset);
        y.set(pointer.current.y - offset);
    });

    if (!enabled) return null;

    const glass =
        "border border-white/50 bg-white/10 shadow-[inset_0_1px_1px_rgb(255_255_255/0.7),inset_0_-1px_2px_rgb(0_0_0/0.08),0_6px_20px_rgb(0_0_0/0.10)] backdrop-blur-[3px] backdrop-saturate-200 dark:border-white/25 dark:bg-white/5";

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-[100]"
            style={{ x, y }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.2 }}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {label ? (
                    <motion.span
                        key="label"
                        className={`absolute top-3 left-3 rounded-full px-3 py-1.5 font-display text-xs font-medium whitespace-nowrap text-foreground ${glass}`}
                        initial={{ scale: 0.4, opacity: 0, filter: "blur(4px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 500, damping: 28 } }}
                        exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.12 } }}
                    >
                        {label}
                    </motion.span>
                ) : (
                    <motion.span
                        key="lens"
                        className={`block ${glass}`}
                        style={{ width: w, height: h, borderRadius: radius, rotate: angle, scaleX, scaleY }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
