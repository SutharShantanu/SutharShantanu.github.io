"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface FluidRevealProps extends HTMLMotionProps<"section"> {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export function FluidReveal({
    children,
    delay = 0,
    className = "",
    ...props
}: FluidRevealProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.75,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.section>
    );
}

export function FluidItem({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
