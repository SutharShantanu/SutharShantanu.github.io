"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {
    ChevronDown,
    Briefcase,
    MapPin,
    Calendar,
    CheckCircle,
    Clock,
} from "lucide-react"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import SectionHeader from "../ui/section-header/section-header"
import { experiences } from "./constants/experience.constant"
import { PeriodCalculate } from "@/functions/period-calcutate"

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

    return (
        <div
            id="experience"
            className="mx-auto p-6 max-w-5xl overflow-hidden backdrop-blur-sm rounded-2xl ring-border border"
        >
            <SectionHeader
                title="Experience"
                description="Explore the key events, achievements, and milestones that shaped our professional journey over the years."
            />

            <div className="relative mt-8">
                {/* Timeline vertical line */}
                <div
                    className="pointer-events-none absolute -left-3 md:left-1/2 md:-translate-x-1/2 h-full w-[2px] z-10 bg-gradient-to-b from-primary/20 to-transparent"
                    aria-hidden="true"
                />

                {experiences.map((experience, index) => {
                    const isEven = index % 2 === 0
                    return (
                        <motion.div
                            key={index}
                            className={`mb-8 relative z-10 flex flex-col flex-wrap md:flex-nowrap md:flex-row ${isEven ? "" : "md:flex-row-reverse"
                                }`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            {/* Dot */}
                            <motion.div
                                className={`absolute top-0 -left-4 md:left-1/2 md:-translate-x-1/2 rounded-full z-10 flex items-center justify-center shadow-lg ${experience.isCurrentRole ? "bg-green-300" : "bg-neutral-50 dark:bg-neutral-800"
                                    }`}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className={`w-3 h-3 rounded-full ${experience.isCurrentRole ? "bg-green-500" : "bg-primary"}`} />
                                </motion.div>
                            </motion.div>

                            {/* Period badge */}
                            <div className={`md:w-1/2 flex flex-wrap ${isEven ? "justify-end md:justify-end md:pr-8" : "justify-end md:justify-start md:pl-8"}`}>
                                <motion.div className="mb-4 md:mb-0">
                                    <Badge
                                        variant="outline"
                                        className="text-sm bg-neutral-50 dark:bg-neutral-800 ring-border w-fit"
                                    >
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <p className="flex items-center gap-1 text-sm flex-wrap">
                                            {experience.period.from} - {experience.period.to}
                                            <span className="text-xs text-muted-foreground">
                                                ({PeriodCalculate(experience.period.from, experience.period.to)})
                                            </span>
                                        </p>
                                    </Badge>
                                </motion.div>
                            </div>

                            <div className={`md:w-1/2 ${isEven ? "md:pl-8" : "md:pr-8"} w-full`}>
                                <motion.div
                                    layout
                                    className="w-full"
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="overflow-hidden ring-border shadow-none transition-all bg-neutral-50 dark:bg-neutral-800">
                                        <CardContent className="p-0">
                                            <div className="p-4 cursor-pointer" onClick={() => toggleExpand(index)}>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-primary dark:text-primary-foreground">
                                                            {experience.position}
                                                        </h3>
                                                        <div className="flex items-center gap-1 flex-wrap">
                                                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                                                <MapPin className="w-4 h-4 mr-1" />
                                                                {experience.location}
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
                                                    <motion.div animate={{ rotate: expandedIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
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
                                                        <div className="px-6 pb-6 pt-2 border-t border-border/50 dark:border-border/30">
                                                            <div className="mb-4">
                                                                <h4 className="text-sm font-semibold flex items-center mb-3 text-primary dark:text-primary-foreground">
                                                                    <motion.div
                                                                        animate={{ rotate: [0, 10, -10, 0] }}
                                                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                                    >
                                                                        <Briefcase className="w-4 h-4 mr-2" />
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
                                                                                    className={`w-4 h-4 mr-3 mt-0.5 shrink-0 ${event.isCompleted ? "text-green-500" : "text-yellow-500"
                                                                                        }`}
                                                                                />
                                                                            </motion.div>
                                                                            <div>
                                                                                <span className="text-sm font-medium text-muted-foreground dark:text-neutral-200">
                                                                                    {event.title}
                                                                                </span>
                                                                                {event.description && (
                                                                                    <p className="text-xs text-muted-foreground dark:text-neutral-400 mt-1">
                                                                                        {event.description}
                                                                                    </p>
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

export default ExperienceTimeline
