"use client";

import { useState, useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import { NavigationMenuProps } from "./navigation-menu/types/navigation-menu.types";
import ThemeToggle from "../theme-toggle/ThemeToggle";

export function DropdownNavigation({ navItems }: NavigationMenuProps) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isHover, setIsHover] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Observe sections using IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.6, // adjust based on when you want it to trigger
            }
        );

        navItems.forEach((item) => {
            const section = document.getElementById(String(item.id));
            if (section) observer.observe(section);
        });

        return () => {
            navItems.forEach((item) => {
                const section = document.getElementById(String(item.id));
                if (section) observer.unobserve(section);
            });
        };
    }, [navItems]);

    const handleHover = (menuLabel: string | null) => {
        setOpenMenu(menuLabel);
    };

    return (
        <main
            className="fixed items-center gap-2 top-4 z-50 w-fit backdrop-blur-md flex justify-center p-2 border ring-border mx-auto rounded-full"
            style={{ left: 0, right: 0 }}
        >
            <div className="relative gap-5 flex flex-col items-center justify-center">
                <ul className="relative flex items-center space-x-0">
                    {navItems.map((navItem) => {
                        const isActive = activeSection === String(navItem.id);
                        return (
                            <li
                                key={navItem.label}
                                className="relative"
                                onMouseEnter={() => handleHover(navItem.label)}
                                onMouseLeave={() => handleHover(null)}
                            >
                                <button
                                    className={`text-sm py-1.5 px-4 flex cursor-pointer group transition-colors duration-300 items-center justify-center gap-1 relative ${isActive ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                    onMouseEnter={() => setIsHover(navItem.id)}
                                    onMouseLeave={() => setIsHover(null)}
                                >
                                    <navItem.icon className="w-4 h-4" />
                                    <span className="text-sm">{navItem.label}</span>

                                    {(isHover === navItem.id ||
                                        openMenu === navItem.label ||
                                        isActive) && (
                                            <motion.div
                                                layoutId="hover-bg"
                                                className="absolute inset-0 size-full bg-primary/10"
                                                style={{ borderRadius: 99 }}
                                            />
                                        )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <ThemeToggle />
        </main>
    );
}
