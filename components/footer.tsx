"use client";

import React from "react";
import { Separator, Button } from "@heroui/react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="mt-20 pt-10 pb-24 text-[14px] text-muted font-sans">
            <Separator className="mb-8 opacity-60" />
            <div className="flex items-center justify-between">
                <p className="tabular-nums">&copy; {currentYear} Shantanu Suthar</p>
                <Button
                    variant="ghost"
                    size="sm"
                    onPress={scrollToTop}
                    className="text-muted hover:text-foreground text-xs"
                    aria-label="Scroll back to top"
                >
                    Back to top &uarr;
                </Button>
            </div>
        </footer>
    );
}
