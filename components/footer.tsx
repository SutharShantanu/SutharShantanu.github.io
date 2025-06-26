"use client";

import Link from "next/link";
import {
    Github,
    Linkedin,
    Mail,
    Heart,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import VercelDefault from "@/public/VercelDefault.png";
import { VercelBadgeProps } from "./interface/footer.types";
import { motion } from "framer-motion";


const Footer = () => {

    const statusConfig = {
        success: { label: "Live", dotColor: "bg-green-500" },
        building: { label: "Building", dotColor: "bg-yellow-500" },
        failed: { label: "Failed", dotColor: "bg-red-500" },
        error: { label: "Error", dotColor: "bg-red-500" },
        checking: { label: "Checking", dotColor: "bg-blue-500" },
        unknown: { label: "Unknown", dotColor: "bg-gray-500" },
    }

    const VercelBadge = ({ status = "success", url = "https://vercel.com", showStatus = true }: VercelBadgeProps) => {
        const statusInfo = statusConfig[status]

        return (
            <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit flex h-fit max-h-fit items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:opacity-80 bg-neutral-50 text-neutral-800 dark:bg-neutral-800 border border-border dark:text-neutral-50 "
            >
                {showStatus && (
                    <motion.div>
                        <div className="inline-flex items-center gap-1.5">
                            <span
                                className={`w-2 h-2 rounded-full animate-pulse ${statusInfo.dotColor} ${status === "building" || status === "checking" ? "animate-pulse" : ""}`}
                            />
                            <span className="text-xs">{statusInfo.label}</span>
                        </div>
                    </motion.div>
                )}
                <Separator className="h-4" orientation="vertical" />
                <Image src={VercelDefault} alt="Vercel Logo" className="size-3 invert dark:invert-0" />
                <span className="text-nowrap line-clamp-1">Powered by Vercel</span>
            </Link>
        )
    }

    return (
        <footer className="flex flex-col justify-between overflow-hidden backdrop-blur-sm ring-border border border-b-0 rounded-t-2xl max-w-5xl mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-muted-foreground p-6">
                {/* Quick Links */}
                <div>
                    <h4 className="mb-2 font-semibold text-foreground">Quick Links</h4>
                    <ul className="space-y-1">
                        <li>
                            <Link href="#projects" className="hover:text-foreground transition-colors">
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Link href="#skills" className="hover:text-foreground transition-colors">
                                Skills
                            </Link>
                        </li>
                        <li>
                            <Link href="#contact" className="hover:text-foreground transition-colors">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Connect */}
                <div>
                    <h4 className="mb-2 font-semibold text-foreground">Connect</h4>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                href="mailto:shantanu@example.com"
                                className="hover:text-foreground transition-colors flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4" /> Email
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="https://github.com/SutharShantanu"
                                target="_blank"
                                className="hover:text-foreground transition-colors flex items-center gap-2"
                            >
                                <Github className="w-4 h-4" /> GitHub
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="https://linkedin.com/in/shantanusuthar"
                                target="_blank"
                                className="hover:text-foreground transition-colors flex items-center gap-2"
                            >
                                <Linkedin className="w-4 h-4" /> LinkedIn
                            </Link>
                        </li>
                    </ul>
                </div>
                <VercelBadge status="success" showStatus={true} />

            </div>
            <Separator className="" />
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-2 text-center p-4">
                <p>© {new Date().getFullYear()} Shantanu Suthar. All rights reserved.</p>
                <p className="flex items-center gap-1">
                    Crafted with <Heart className="w-3 h-3 text-pink-500" />
                </p>
            </div>
        </footer>
    );
};

export default Footer;
