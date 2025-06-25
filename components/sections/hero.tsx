"use client";

import { useState, useEffect } from "react";
import { Download, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

import AvatarImage from "@/public/AvatarImage.png";


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

    return (
        <section
            id="home"
            className="relative flex flex-col-reverse md:flex-row items-center justify-between p-6 gap-10 overflow-hidden backdrop-blur-sm ring-border border rounded-2xl mt-20 max-w-5xl"
            aria-label="Hero introduction section"
        >
            <div className="text-center md:text-left z-10">
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
            </div>

            {/* Avatar */}
            <div className="w-64 h-64 md:w-80 md:h-80 z-10">
                <Image
                    src={AvatarImage}
                    alt="3D Avatar of Shantanu Suthar"
                    width={320}
                    height={320}
                    className="w-full h-full object-contain transition-all ease-in-out hover:scale-105"
                    priority
                />
            </div>

        </section>
    );
}
