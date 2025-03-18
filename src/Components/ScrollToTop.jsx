"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.5,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed bottom-4 right-4 z-50 ${
                isVisible ? "visible" : "invisible"
            }`}>
            {/* Outer wrapper for blur effect */}
            <div className="relative">
                {/* Fading and blur effect */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: isVisible ? 0.3 : 0,
                        scale: isVisible ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 -z-10 h-20 w-20 rounded-full bg-transparent backdrop-blur-xs filter blur-xs"
                />
                {/* Button */}
                <motion.button
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9, rotate: -5 }}
                    onClick={scrollToTop}
                    className="p-3 border dark:border-neutral-500 border-neutral-800 bg-neutral-200 dark:bg-neutral-800 shadow-lg text-neutral-900 dark:text-neutral-50 rounded-full">
                    <ArrowUp size={24} strokeWidth={2} />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ScrollToTop;
