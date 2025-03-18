"use client";

import React, { useEffect, useState } from "react";
import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const ThemeSwitcher = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const buttonVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
        hover: { scale: 1.1, rotate: 5 },
        tap: { scale: 0.9, rotate: -5 },
    };

    const iconVariants = {
        initial: { opacity: 0, rotate: 45 },
        animate: { opacity: 1, rotate: 0, transition: { duration: 0.4, ease: "easeOut" } },
    };

    return resolvedTheme === "dark" ? (
        <motion.div
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
        >
            <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme("light")}
                className="rounded-full shadow-xs hover:shadow-none border dark:hover:border-neutral-700 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:bg-neutral-900"
            >
                <motion.div variants={iconVariants}>
                    <SunDim
                        size={20}
                        strokeWidth={1.75}
                        className="text-yellow-500"
                    />
                </motion.div>
            </Button>
        </motion.div>
    ) : (
        <motion.div
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
        >
            <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme("dark")}
                className="rounded-full shadow-xs hover:shadow-none border border-neutral-200 hover:border-neutral-300 bg-neutral-100 hover:bg-neutral-200"
            >
                <motion.div variants={iconVariants}>
                    <Moon
                        size={20}
                        strokeWidth={1.75}
                    />
                </motion.div>
            </Button>
        </motion.div>
    );
};

export default ThemeSwitcher;
