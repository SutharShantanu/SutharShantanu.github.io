"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const ThemeSwitch = () => {
    const { theme, setTheme } = useTheme();

    const handleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className="rounded-3xl shadow-md hover:shadow-none"
            onClick={handleTheme}>
            {theme === "light" ? (
                <>
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
                </>
            ) : (
                <>
                    <Moon className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
                </>
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ThemeSwitch;
