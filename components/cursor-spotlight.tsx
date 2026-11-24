"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useSpring } from "framer-motion";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function CursorSpotlight() {
    const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
    const mouseX = useSpring(0, { stiffness: 400, damping: 35 });
    const mouseY = useSpring(0, { stiffness: 400, damping: 35 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    if (!isMounted) return null;

    return (
        <motion.div
            style={{
                x: mouseX,
                y: mouseY,
                translateX: "-50%",
                translateY: "-50%",
            }}
            className="pointer-events-none fixed z-30 hidden md:block size-[480px] rounded-full bg-foreground/[0.025] dark:bg-foreground/[0.035] blur-3xl transition-opacity duration-300"
            aria-hidden="true"
        />
    );
}
