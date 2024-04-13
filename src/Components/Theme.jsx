"use client";

import React from "react";
import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const ThemeSwitcher = () => {
    const { systemTheme, theme, setTheme } = useTheme();

    const renderThemeChanger = () => {
        const currentTheme = theme === "system" ? systemTheme : theme;

        if (currentTheme === "dark") {
            return (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme("light")}
                    className="rounded-full shadow-sm hover:shadow-none border hover:border-gray-200 dark:border-gray-700">
                    <SunDim className="w-6 h-6 text-yellow-500 animate-in transition-all duration-75" />
                </Button>
            );
        } else {
            return (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme("dark")}
                    className="rounded-full shadow-sm hover:shadow-none border hover:border-gray-200 dark:border-gray-700">
                    <Moon className="w-6 h-6 animate-in transition-all duration-75" />
                </Button>
            );
        }
    };

    return <>{renderThemeChanger()}</>;
};

export default ThemeSwitcher;
