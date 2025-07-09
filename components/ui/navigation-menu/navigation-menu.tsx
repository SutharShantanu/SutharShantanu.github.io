"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import ThemeToggle from "@/components/theme-toggle/ThemeToggle";
import { NavigationMenuProps } from "./types/navigation-menu.types";
import MobileDrawer from "./mobile-drawer";
import Hamburger from "../hamburger/hamburger";

export function DropdownNavigation({ navItems }: NavigationMenuProps) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isHover, setIsHover] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.6 }
        );

        navItems.forEach((item) => {
            const id = item.link.replace("#", "");
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => {
            navItems.forEach((item) => {
                const id = item.link.replace("#", "");
                const section = document.getElementById(id);
                if (section) observer.unobserve(section);
            });
        };
    }, [navItems]);

    const handleScroll = (link: string) => {
        const id = link.replace("#", "");
        const section = document.getElementById(id);
        if (section) {
            const yOffset = -80;
            const y =
                section.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const renderNavItems = () =>
        navItems.map((navItem) => {
            const id = navItem.link.replace("#", "");
            const isActive = activeSection === id;
            return (
                <li
                    key={navItem.label}
                    onMouseEnter={() => setOpenMenu(navItem.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                    className="relative"
                >
                    <button
                        onMouseEnter={() => setIsHover(navItem.id)}
                        onMouseLeave={() => setIsHover(null)}
                        onClick={() => handleScroll(navItem.link)}
                        className={`text-sm py-1.5 px-5 flex items-center gap-2 relative z-10 rounded-full transition-all duration-300 text-muted-foreground hover:bg-accent/20`}
                    >
                        <navItem.icon className="w-4 h-4" />
                        <span>{navItem.label}</span>

                        {(isHover === navItem.id || openMenu === navItem.label || isActive) && (
                            <motion.div
                                layoutId="hover-bg"
                                className="absolute inset-0 z-0 bg-primary/10 rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                    </button>
                </li>
            );
        });

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Desktop Navbar */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-md p-2 border ring-border rounded-full items-center justify-between w-fit gap-4"
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Avatar>
                        <AvatarImage
                            src="https://avatars.githubusercontent.com/u/110021464?v=4"
                            alt="@SutharShantanu"
                        />
                        <AvatarFallback>SS</AvatarFallback>
                    </Avatar>
                </motion.div>

                <ul className="flex items-center relative">{renderNavItems()}</ul>
                <ThemeToggle />
            </motion.nav>

            {/* Mobile Navbar */}
            <div className="fixed top-4 left-4 z-50 lg:hidden">
                <Hamburger open={isDrawerOpen} onClick={() => setDrawerOpen(true)} />
            </div>

            <MobileDrawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                navItems={navItems}
                activeSection={activeSection}
                setDrawerOpen={setDrawerOpen}
            />
        </motion.div>
    );
}
