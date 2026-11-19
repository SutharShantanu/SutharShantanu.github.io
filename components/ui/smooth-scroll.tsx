"use client";

/**
 * Buttery inertial scrolling via GSAP ScrollSmoother (framer-motion has no smooth-scroll primitive).
 * - Keeps the native scrollbar/scroll position, so framer's useScroll/whileInView keep working.
 * - Off for reduced-motion users and on touch (native momentum is better there).
 * - Fixed-position UI (dock, blur, progress bar) must live OUTSIDE this wrapper:
 *   the content is moved with transforms, which would break `position: fixed`.
 */
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const wrapper = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!wrapper.current || !content.current) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const smoother = ScrollSmoother.create({
                wrapper: wrapper.current,
                content: content.current,
                smooth: 1.1, // seconds to "catch up" to the native scroll position
                smoothTouch: false,
                effects: false,
            });

            // Panels change height (tab switches, lazy sections, images): re-measure, debounced.
            let timer = 0;
            const ro = new ResizeObserver(() => {
                window.clearTimeout(timer);
                timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
            });
            ro.observe(content.current);

            return () => {
                window.clearTimeout(timer);
                ro.disconnect();
                smoother.kill();
            };
        },
        { scope: wrapper }
    );

    return (
        <div ref={wrapper} id="smooth-wrapper">
            <div ref={content} id="smooth-content">
                {children}
            </div>
        </div>
    );
}
