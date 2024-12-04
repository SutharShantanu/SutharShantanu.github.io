"use client";

import React from "react";
import { motion } from "framer-motion";
import { MoveRight, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/Components/ui/badge";

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

// Reusable Badge Component
const ExperienceBadge = ({ children, variantClass }) => (
    <Badge
        variant="outline"
        className={`${variantClass} w-fit text-xs sm:text-sm font-medium px-2.5 py-0.5 border my-2 md:m-0`}>
        {children}
    </Badge>
);

// Reusable Experience Item Component
const ExperienceItem = ({ role, duration, team, company, companyUrl, colorClass, tasks, icon, isOngoing }) => (
    <motion.li
        variants={fadeInUp}
        className="ms-8 border border-neutral-200 dark:border-neutral-800 bg-neutral-200 hover:border-neutral-300 dark:bg-neutral-800 dark:hover:border-neutral-700 transition-all p-4 rounded-lg">
        <span
            className={`absolute flex items-center justify-center w-8 h-8 ${colorClass} rounded-full -start-4`}>
            {icon}
        </span>
        <h3 className="flex flex-col md:flex-row md:justify-between items-start md:w-full mb-1 sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {role}
            <ExperienceBadge variantClass={isOngoing ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300" : colorClass}>
                {duration}
            </ExperienceBadge>
        </h3>
        <div className="sm:flex items-start sm:items-center mb-2 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500 hover:cursor-pointer">
            <p className="flex">
                {team}
                <span className="sm:flex hidden sm:mr-1">&#44;</span>
            </p>
            <p className="flex items-center my-2 sm:my-0">
                <Building2 size={16} strokeWidth={1.75} />
                <Link target="_blank" href={companyUrl} className="flex items-center mx-2">
                    {company} &nbsp;
                    <ExternalLink size={16} strokeWidth={1.75} />
                </Link>
            </p>
        </div>
        <ul className="pl-6 text-sm sm:text-lg font-normal text-neutral-500 dark:text-neutral-400 list-disc list-outside">
            {tasks.map((task, index) => (
                <li key={index}>{task}</li>
            ))}
        </ul>
    </motion.li>
);

const Experience = () => {
    const experienceData = [
        {
            role: "Associate Frontend Developer",
            duration: "June 2024 - Present",
            team: "IT Team",
            company: "Infyni",
            companyUrl: "https://infyni.com",
            colorClass: "bg-yellow-100 dark:bg-yellow-900",
            icon: (
                <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-300 lucide lucide-circle-dot"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="1" />
                </svg>
            ),
            tasks: [
                "Collaborated with designers to create a visually appealing and user-friendly company careers page.",
                "Streamlined the application process with an interactive application form including validation functionalities.",
                "Delivered tailored technical support, collaborating with operations and moderators.",
            ],
            isOngoing: true,
        },
        {
            role: "Technology Operations Associate",
            duration: "Oct 2023 - May 2024",
            team: "Operations & IT Team",
            company: "Infyni",
            companyUrl: "https://infyni.com",
            colorClass: "bg-green-100 dark:bg-green-900",
            icon: (
                <svg
                    className="w-5 h-5 text-green-600 dark:text-green-300 lucide lucide-circle-check"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            ),
            tasks: [
                "Effectively collaborated with the back-office and QA teams to facilitate thorough testing.",
                "Assisted the Operations team in supporting customer service representatives.",
                "Successfully introduced and guided customers on new feature integrations.",
            ],
            isOngoing: false,
        },
        {
            role: "Branding Pioneers",
            duration: "Jan 2022 - Dec 2023",
            team: "Branding Team",
            company: "Branding Pioneers",
            companyUrl: "https://brandingpioneers.com",
            colorClass: "bg-green-100 dark:bg-green-900",
            icon: (
                <svg
                    className="w-5 h-5 text-green-600 dark:text-green-300 lucide lucide-circle-check"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            ),
            tasks: [
                "Led branding initiatives to create impactful visual identities for clients.",
                "Collaborated with the marketing team to develop promotional campaigns.",
                "Coordinated with designers to maintain consistent brand guidelines across various platforms.",
            ],
            isOngoing: false,
        },
    ];

    return (
        <section
            id="experience"
            className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 rounded-lg shadow-sm">
            <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="group inline-block dark:text-neutral-50 text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4 sm:pt-8 sm:pl-8">
                Experience
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4"
                    size={40}
                    strokeWidth={2.5}
                />
            </motion.p>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="m-6">
                <ol className="relative border-s border-neutral-200 dark:border-neutral-800 space-y-6">
                    {experienceData.map((exp, index) => (
                        <ExperienceItem key={index} {...exp} />
                    ))}
                </ol>
            </motion.div>
        </section>
    );
};

export default Experience;
