'use client';

import { ReactNode, useRef } from "react";
import { useInView, motion, MotionProps } from "framer-motion";

interface RevealOnScrollProps {
    children: ReactNode;
    animation?: MotionProps["animate"];
    once?: boolean;
    className?: string;
    transition?: MotionProps["transition"];
}

export default function RevealOnScroll({
    children,
    animation,
    once = true,
    className = "",
    transition = { duration: 0.8, ease: "easeOut" },
}: RevealOnScrollProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once, amount: 0.2 });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{
                opacity: 0,
                y: 60,
                filter: "blur(8px)",
            }}
            animate={
                isInView
                    ? {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        ...(typeof animation === "object" && animation !== null ? animation : {}),
                    }
                    : undefined
            }
            transition={transition}
        >
            {children}
        </motion.div>
    );
}
