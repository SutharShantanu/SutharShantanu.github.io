"use client";

import React, { useEffect, useState } from "react";
import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const ThemeSwitcher = () => {
    const { setTheme, resolvedTheme } = useTheme();

    if (resolvedTheme === "dark") {
        return (
            <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme("light")}
                className="rounded-full shadow-sm hover:shadow-none border hover:border-neutral-200 dark:hover:border-neutral-600 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:bg-neutral-800">
                <SunDim
                    size={20}
                    strokeWidth={1.75}
                    className=" text-yellow-500 animate-in transition-all duration-75"
                />
            </Button>
        );
    }

    if (resolvedTheme === "light") {
        return (
            <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme("dark")}
                className="rounded-full shadow-sm hover:shadow-none border hover:border-neutral-200 bg-neutral-100 hover:bg-neutral-200">
                <Moon
                    size={20}
                    strokeWidth={1.75}
                    className=" animate-in transition-all duration-75"
                />
            </Button>
        );
    }
    // <AArrowDown  />;
};

export default ThemeSwitcher;
