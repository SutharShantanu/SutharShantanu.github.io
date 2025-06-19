"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils" // optional utility for conditional class names
import { SectionHeaderProps } from "./types/section-header.types"

const SectionHeader = ({ title, description, center = true, icon }: SectionHeaderProps) => {
    return (
        <div className={cn("mb-12", center ? "text-center" : "text-left")}>
            <motion.h1
                className="text-3xl md:text-4xl font-bold mb-2 flex items-baseline justify-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {icon && <span>{icon}</span>}
                <span className="h-fit">{title}</span>
            </motion.h1>

            {description && (
                <motion.p
                    className="text-muted-foreground text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {description}
                </motion.p>
            )}
        </div>
    )
}

export default SectionHeader
