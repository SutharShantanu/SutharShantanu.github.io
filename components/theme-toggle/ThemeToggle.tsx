"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggleProps } from "./types/theme-toggle.types";

const themes = [
    {
        key: "system",
        icon: Monitor,
        label: "System theme",
    },
    {
        key: "light",
        icon: Sun,
        label: "Light theme",
    },
    {
        key: "dark",
        icon: Moon,
        label: "Dark theme",
    },
];

const ThemeToggle = ({ className }: ThemeToggleProps) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            className={cn(
                "relative flex rounded-full p-1 w-fit ring-1 ring-border",
                className
            )}
        >
            {themes.map(({ key, icon: Icon, label }) => {
                const isActive = theme === key;

                return (
                    <button
                        type="button"
                        key={key}
                        className="relative h-6 w-6 rounded-full"
                        onClick={() => setTheme(key as "light" | "dark" | "system")}
                        aria-label={label}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTheme"
                                className="absolute inset-0 rounded-full bg-secondary"
                                transition={{ type: "spring", duration: 0.5 }}
                            />
                        )}
                        <Icon
                            className={cn(
                                "relative m-auto h-4 w-4",
                                key === "system" && isActive
                                    ? "text-neutral-800 dark:text-neutral-50"
                                    : isActive
                                        ? "text-yellow-500 dark:text-neutral-50 fill-yellow-500 dark:fill-neutral-50"
                                        : "text-neutral-400 dark:text-neutral-600"
                            )}
                            strokeWidth={1}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default ThemeToggle;
