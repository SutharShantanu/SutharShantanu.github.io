"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion";


import {
    ChevronDown,
    Briefcase,
    MapPin,
    Calendar,
    CheckCircle,
    Clock,
    Code,
    Laptop,
} from "lucide-react"
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import SectionHeader from "../ui/section-header/section-header";
import { experiences } from "./constants/experience.constant";
import { PeriodCalculate } from "@/functions/period-calcutate";

const ExperienceTimeline = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

    const toggleExpand = (index: number) => {
        if (expandedIndex === index) {
            setExpandedIndex(null)
        } else {
            setExpandedIndex(null)
            const timer = setTimeout(() => {
                setExpandedIndex(index)
                clearTimeout(timer)
            }, 300)
        }
    }

    const getRoleIcon = (position: string) => {
        const lower = position.toLowerCase();
        if (lower.includes("full stack")) return Code;
        if (lower.includes("frontend")) return Laptop;
        return Briefcase;
    };

    return (
        <div id="#experience" className="mx-auto px-4 py-12 max-w-5xl">
            <SectionHeader
                title="Experience"
                description="Explore the key events, achievements, and milestones that shaped our professional journey over the years."
                icon={<Briefcase size={28} />}
            />

            <div className="relative">
                <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-0.5 z-10 bg-gradient-to-b from-primary/20 to-transparent" />

                {experiences.map((experience, index) => {
                    const IconComponent = getRoleIcon(experience.position);
                    return (
                        <motion.div
                            key={index}
                            className={`mb-12 relative z-10 flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <motion.div
                                className={`absolute left-0 md:left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full z-10 flex items-center justify-center shadow-lg ${experience.isCurrentRole
                                    ? "bg-green-300"
                                    : "bg-neutral-800 dark:bg-neutral-50"
                                    }`}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {experience.isCurrentRole && (
                                    <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-50"></div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <IconComponent
                                        className={`w-4 h-4 ${experience.isCurrentRole ? "text-neutral-50" : "text-primary-foreground"}`}
                                    />
                                </motion.div>
                            </motion.div>

                            <div className={`md:w-1/2 flex ${index % 2 === 0 ? "md:justify-end md:pr-8" : "md:justify-start md:pl-8"}`}>
                                <motion.div className="mb-4 md:mb-0">
                                    <Badge variant="outline" className="text-sm py-1 px-3 bg-neutral-50 dark:bg-neutral-800 ring-border">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <p className="flex items-center gap-1 text-sm">
                                            {experience.period.from} - {experience.period.to}
                                            <span className="text-xs text-muted-foreground">
                                                ({PeriodCalculate(experience.period.from, experience.period.to)})
                                            </span>
                                        </p>
                                    </Badge>
                                </motion.div>
                            </div>

                            <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-8" : "md:pr-8"}`}>
                                <motion.div
                                    layout
                                    className="w-full"
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="overflow-hidden ring-border shadow-none transition-all">
                                        <CardContent className="p-0">
                                            <div className="p-4 cursor-pointer" onClick={() => toggleExpand(index)}>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-primary">{experience.position}</h3>
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                                                <MapPin className="w-4 h-4 mr-1" />
                                                                {experience.location},
                                                            </div>
                                                            <p className="text-md text-muted-foreground mb-2">{experience.company}</p>
                                                        </div>
                                                        {experience.isCurrentRole && (
                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs bg-green-100 text-green-600 border-green-200"
                                                                >
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    Current Role
                                                                </Badge>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                    </motion.div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expandedIndex === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-6 pb-6 pt-2 border-t border-border/50">
                                                            <div className="mb-4">
                                                                <h4 className="text-sm font-semibold flex items-center mb-3">
                                                                    <motion.div
                                                                        animate={{ rotate: [0, 10, -10, 0] }}
                                                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                                    >
                                                                        <Briefcase className="w-4 h-4 mr-2 text-primary" />
                                                                    </motion.div>
                                                                    Key Achievements & Responsibilities
                                                                </h4>
                                                                <ul className="space-y-2">
                                                                    {experience.events.map((event, i) => (
                                                                        <motion.li
                                                                            key={i}
                                                                            className="flex items-start"
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{
                                                                                duration: 0.3,
                                                                                delay: i * 0.1,
                                                                            }}
                                                                        >
                                                                            <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                                                                                <CheckCircle
                                                                                    className={`w-4 h-4 mr-3 ${event.isCompleted ? "text-green-500" : "text-yellow-500"
                                                                                        } mt-0.5 shrink-0`}
                                                                                />
                                                                            </motion.div>
                                                                            <div>
                                                                                <span className="text-sm font-medium">{event.title}</span>
                                                                                {event.description && (
                                                                                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                                                                                )}
                                                                            </div>
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

export default ExperienceTimeline;