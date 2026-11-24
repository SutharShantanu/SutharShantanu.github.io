"use client";

/**
 * Smooth inertial scrolling with Lenis (https://lenis.darkroom.engineering).
 * Lenis animates the real window scroll, so position: fixed, framer's useScroll/whileInView
 * and the URL hash all keep working. Off for reduced-motion users; touch keeps native momentum.
 */
import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [reduce, setReduce] = React.useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduce(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    if (reduce) return <>{children}</>;
    return (
        <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true, anchors: true }}>
            {children}
        </ReactLenis>
    );
}

/** Scroll to top (smoothly through Lenis when active, else natively). */
export function useScrollTop() {
    const lenis = useLenis();
    return React.useCallback(() => {
        if (lenis) lenis.scrollTo(0, { duration: 0.6 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
    }, [lenis]);
}
