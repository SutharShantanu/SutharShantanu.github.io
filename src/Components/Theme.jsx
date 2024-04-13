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
                className="rounded-full shadow-sm hover:shadow-none border hover:border-gray-200 dark:hover:border-gray-600 dark:border-gray-700 dark:hover:bg-gray-700 dark:bg-gray-800">
                <SunDim className=" text-yellow-500 animate-in transition-all duration-75" />
            </Button>
        );
    }

    if (resolvedTheme === "light") {
        return (
            <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme("dark")}
                className="rounded-full shadow-sm hover:shadow-none border hover:border-gray-200 bg-white hover:bg-white">
                <Moon className=" animate-in transition-all duration-75" />
            </Button>
        );
    }
};

export default ThemeSwitcher;
