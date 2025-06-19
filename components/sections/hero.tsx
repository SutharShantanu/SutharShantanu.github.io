"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-0">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-5xl md:text-7xl font-bold mb-4"
            >
                Shantanu Suthar
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl"
            >
                Building scalable web apps with React & Node.js
            </motion.p>
            <motion.div
                className="flex gap-6 justify-center mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <Link href="#projects" className="btn btn-primary">
                    See Projects
                </Link>
                <Link href="#contact" className="btn btn-outline">
                    Contact Me
                </Link>
            </motion.div>
            <motion.div className="flex gap-6 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <Link href="https://github.com/shantanusuthar" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                    <Github className="w-6 h-6 hover:text-primary" />
                </Link>
                <Link href="https://linkedin.com/in/shantanusuthar" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-6 h-6 hover:text-primary" />
                </Link>
                <Link href="mailto:your-email@example.com" aria-label="Email">
                    <Mail className="w-6 h-6 hover:text-primary" />
                </Link>
            </motion.div>
        </section>
    );
}
