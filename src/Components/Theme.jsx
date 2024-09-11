"use client";

import React, { useEffect, useState } from "react";
import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const ThemeSwitcher = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return resolvedTheme === "dark" ? (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("light")}
            className="rounded-full shadow-sm hover:shadow-none border dark:hover:border-neutral-700 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:bg-neutral-900">
            <SunDim
                size={20}
                strokeWidth={1.75}
                className="text-yellow-500 animate-in transition-all duration-75"
            />
        </Button>
    ) : (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("dark")}
            className="rounded-full shadow-sm hover:shadow-none border border-neutral-200 hover:border-neutral-300 bg-neutral-100 hover:bg-neutral-200">
            <Moon
                size={20}
                strokeWidth={1.75}
                className="animate-in transition-all duration-75"
            />
        </Button>
    );
};

export default ThemeSwitcher;
