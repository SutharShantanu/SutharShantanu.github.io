"use client";

import { useState, useEffect } from "react";
import { Download, CheckCircle, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CircularProgress from "@/components/ui/circular-progress"; // adjust import path
import Image from "next/image";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import Link from "next/link";
import AvatarImage from "@/public/AvatarImage.png";

export default function Hero() {
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (downloading) {
            const duration = 4000; // 4 seconds
            const step = 1; // 1% increments
            const intervalTime = duration / (100 / step); // 40ms

            let value = 0;
            interval = setInterval(() => {
                value += step;
                setProgress(value);
                if (value >= 100) {
                    clearInterval(interval);
                    setCompleted(true);
                    toast.success("Resume downloaded!");
                    setTimeout(() => {
                        setDownloading(false);
                        setCompleted(false);
                        setProgress(0);
                    }, 1500);

                    // Trigger download here (adjust URL)
                    const link = document.createElement("a");
                    // link.href = "YOUR_RESUME_URL";
                    // link.download = "Resume.pdf";
                    link.click();
                }
            }, intervalTime);
        }
        return () => clearInterval(interval);
    }, [downloading]);

    const handleResumeDownload = () => {
        if (!downloading) {
            setDownloading(true);
            setCompleted(false);
            setProgress(0);
        }
    };

    return (
        <section
            id="home"
            className="min-h-[calc(100svh-10vh)] flex flex-col-reverse md:flex-row items-center justify-center gap-10"
        >
            <RevealOnScroll className="text-center md:text-left max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Shantanu Suthar</h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                    Building scalable web apps with React & Node.js
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={handleResumeDownload}
                        className="w-full sm:w-auto bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-50"
                        disabled={downloading}
                    >
                        {!downloading && !completed && <Download className="h-4 w-4" />}
                        {(downloading || completed) && (
                            <CircularProgress
                                value={progress}
                                size={80}
                                strokeWidth={8}
                                showLabel
                                labelClassName="font-semibold text-primary"
                                progressClassName={completed ? "stroke-green-500" : undefined}
                            />
                        )}
                        {downloading ? "Downloading..." : "Download Resume"}
                    </Button>

                    <Link
                        href="https://github.com/shantanusuthar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                    >
                        <Button variant="secondary" className="w-full sm:w-auto">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                    </Link>
                </div>
            </RevealOnScroll>

            <RevealOnScroll className="w-64 h-64 md:w-80 md:h-80" animation={{ x: 0 }}>
                <Image
                    src={AvatarImage}
                    alt="3D Avatar"
                    width={320}
                    height={320}
                    className="w-full h-full object-contain"
                />
            </RevealOnScroll>
        </section>
    );
}
