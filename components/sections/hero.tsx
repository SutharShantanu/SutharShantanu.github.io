"use client";

import { useState, useEffect } from "react";
import { Download, Github, Linkedin, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import AvatarImage from "@/public/AvatarImage.png";
import clsx from "clsx";

function LoadingDots({ active }: { active: boolean }) {
    // Animate dots from 1 to 3 and repeat
    const [count, setCount] = useState(1);
    useEffect(() => {
        if (!active) return;
        const interval = setInterval(() => {
            setCount((c) => (c === 3 ? 1 : c + 1));
        }, 400);
        return () => clearInterval(interval);
    }, [active]);

    return <span>{'.'.repeat(count)}</span>;
}

export default function Hero() {
    const [downloading, setDownloading] = useState(false);
    const [showScroll, setShowScroll] = useState(true);

    // Scroll event to toggle scroll button visibility
    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 150) setShowScroll(false);
            else setShowScroll(true);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleResumeDownload = () => {
        if (downloading) return;
        setDownloading(true);

        const toastId = toast.loading("Downloading Resume...");

        window.open(
            "https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13",
            "_self",
            "noopener,noreferrer"
        );

        setTimeout(() => {
            setDownloading(false);
            toast.success("Resume downloaded!", { id: toastId });
        }, 2500);
    };

    const handleScrollClick = () => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    };

    return (
        <section
            id="home"
            className="relative min-h-[calc(100svh-10vh)] flex flex-col-reverse md:flex-row items-center justify-center gap-10 px-6 md:px-16 overflow-hidden"
            aria-label="Hero introduction section"
        >
            {/* Background blobs */}
            <div
                aria-hidden="true"
                className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl pointer-events-none"
            />
            <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-pink-300 via-red-300 to-yellow-300 rounded-full opacity-15 blur-3xl pointer-events-none"
            />

            {/* Text Content */}
            <RevealOnScroll className="text-center md:text-left max-w-xl z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-3">Shantanu Suthar</h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-4">
                    Building scalable web apps with React & Node.js
                </p>
                <p className="text-sm md:text-base text-muted-foreground max-w-md mb-6">
                    Passionate developer focused on writing clean, efficient code and
                    crafting seamless user experiences.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={handleResumeDownload}
                        variant="default"
                        className="w-full sm:w-auto"
                        disabled={downloading}
                        aria-label="Download resume"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {downloading ? (
                            <>
                                Downloading
                                <LoadingDots active={downloading} />
                            </>
                        ) : (
                            "Download Resume"
                        )}
                    </Button>

                    <Button
                        asLink
                        href="https://github.com/shantanusuthar"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                        aria-label="GitHub profile"
                    >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                    </Button>

                    <Button
                        asLink
                        href="https://linkedin.com/in/shantanusuthar"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                        aria-label="LinkedIn profile"
                    >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                    </Button>
                </div>
            </RevealOnScroll>

            {/* Avatar */}
            <RevealOnScroll className="w-64 h-64 md:w-80 md:h-80 z-10" animation={{ x: 0 }}>
                <Image
                    src={AvatarImage}
                    alt="3D Avatar of Shantanu Suthar"
                    width={320}
                    height={320}
                    className="w-full h-full object-contain rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
                    priority
                />
            </RevealOnScroll>

            {/* Scroll Down Button */}
            <button
                onClick={handleScrollClick}
                aria-label="Scroll down to next section"
                className={clsx(
                    "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center cursor-pointer",
                    "focus:outline-none focus:ring-4 focus:ring-indigo-400",
                    "animate-bounce transition-opacity duration-500",
                    showScroll ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                <ArrowDown className="w-6 h-6" />
            </button>
        </section>
    );
}
