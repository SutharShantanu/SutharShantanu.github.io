"use client";

import { Button } from "@/components/ui/button";
import { HamburgerProps } from "./types/hamburger.types";

const Hamburger = ({ open, onClick }: HamburgerProps) => {
    return (
        <Button
            className="group ring-border"
            variant="outline"
            size="icon"
            onClick={onClick}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
        >
            <svg
                className="pointer-events-none"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                />
                <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                />
                <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                />
            </svg>
        </Button>
    );
}

export default Hamburger;
