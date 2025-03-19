"use client";

import React, { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const colors = [
    { name: "Charcoal Black", value: "#1E1E1E" },
    { name: "Gunmetal Gray", value: "#2C2C2C" },
    { name: "Deep Forest Green", value: "#1B3B36" },
    { name: "Dark Burgundy", value: "#560319" },
    { name: "Pale Yellow", value: "#FFF9C4" },
    { name: "Soft Beige", value: "#F5E1DA" },
    { name: "Pastel Blue", value: "#AFCBFF" },
    { name: "Warm Peach", value: "#FFCBA4" },
    { name: "Vanilla Cream", value: "#FFF5E1" },
];

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

    const getTextColor = (bgColor) => {
        const hex = bgColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? "#000000" : "#FFFFFF";
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
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
                        className="rounded-full shadow-xs hover:shadow-none border border-neutral-200 hover:border-neutral-300 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    >
                        <motion.div variants={iconVariants}>
                            <Palette size={20} strokeWidth={1.75} />
                        </motion.div>
                    </Button>
                </motion.div>
            </PopoverTrigger>
            <PopoverContent className="p-2">
                <div className="grid grid-cols-3 gap-2">
                    {colors.map((color) => (
                        <Button
                            key={color.name}
                            className="w-full flex items-center justify-center rounded-xs select-none"
                            style={{
                                backgroundColor: color.value,
                                color: getTextColor(color.value),
                            }}
                            onClick={() => setTheme(color.name.toLowerCase().replace(/\s+/g, "-"))}
                        >
                            {color.name}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ThemeSwitcher;