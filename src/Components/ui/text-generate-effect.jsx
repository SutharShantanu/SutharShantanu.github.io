"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({ words, className }) => {
    const [scope, animate] = useAnimate();
    const wordsArray = words.split(" ");

    useEffect(() => {
        animate(
            "span",
            {
                opacity: 1,
                y: 0,
            },
            {
                duration: 0.5,
                delay: stagger(0.1), // Delays each word
                ease: "easeOut",
            }
        );
    }, [animate]);

    const renderWords = () => {
        return (
            <motion.div
                ref={scope}
                className="flex flex-wrap gap-1" // Ensures spacing between words
            >
                {wordsArray.map((word, idx) => (
                    <motion.span
                        key={`${word}-${idx}`}
                        className="opacity-0 translate-y-2 dark:text-white text-neutral-600 font-light"
                    >
                        {word}&nbsp;
                    </motion.span>
                ))}
            </motion.div>
        );
    };

    return (
        <div className={cn("font-bold", className)}>
            <div className="dark:text-white text-neutral-500 text-sm md:text-2xl leading-snug tracking-wide">
                {renderWords()}
            </div>
        </div>
    );
};
