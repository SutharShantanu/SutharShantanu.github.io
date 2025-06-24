"use client";

import { motion } from "framer-motion";

export function Summary() {
    return (
        <section
            id="about"
            className="min-h-[calc(100svh-10vh)] flex flex-col-reverse md:flex-row items-center justify-center gap-10"
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center"
            >
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                    Professional Summary
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                    I&#39;m a passionate <span className="font-semibold text-primary">fullstack developer</span> with expertise in building modern, scalable web applications using <span className="font-semibold text-blue-600 dark:text-blue-400">Next.js</span> and <span className="font-semibold text-blue-600 dark:text-blue-400">TypeScript</span>.
                    <br /><br />
                    My focus is on crafting performant, accessible, and visually appealing digital experiences. I thrive on solving complex problems, collaborating with teams, and delivering clean, maintainable code that delights users.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <span className="px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm font-medium shadow">
                        Next.js
                    </span>
                    <span className="px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-sm font-medium shadow">
                        TypeScript
                    </span>
                    <span className="px-4 py-1 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 text-sm font-medium shadow">
                        UI/UX
                    </span>
                    <span className="px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-sm font-medium shadow">
                        Accessibility
                    </span>
                    <span className="px-4 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-sm font-medium shadow">
                        Performance
                    </span>
                </div>
            </motion.div>
        </section>
    );
}
