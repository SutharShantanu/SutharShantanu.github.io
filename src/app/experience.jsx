"use client";

import React from "react";
import { MoveRight } from "lucide-react";
import { Building2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const Experience = () => {
    return (
        <section
            id="experience"
            className="border  border-gray-200 w-full 2xl:w-4/5 xl:w-5/6  m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <div
                id="about"
                className="group inline-block text-left text-5xl w-fit hover:font-bold hover transition-all">
                Experience
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4"
                    size={40}
                    strokeWidth={2.5}
                />
            </div>
            <div className="m-8">
                <ol class="relative border-s border-gray-200 dark:border-gray-700">
                    <li class="mb-10 ms-8 border border-gray-200 p-4 rounded-lg group">
                        <span class="absolute flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full -start-4 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900 ">
                            <svg
                                class="w-5 h-5 text-yellow-600 dark:text-yellow-300 lucide lucide-circle-dot"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="1" />
                            </svg>
                        </span>
                        <h3 class="flex items-center mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                            Technology Operations Associates
                            <span class="bg-yellow-100 rounded-lg text-yellow-600 text-sm font-medium me-2 px-2.5 py-0.5 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 ms-3">
                                Oct 2023 - Present
                            </span>
                        </h3>

                        <time class="flex items-center mb-2 text-base font-normal leading-none text-gray-400 dark:text-gray-500 hover:cursor-pointer">
                            Operations & IT Team,
                            <Building2
                                size={18}
                                className="mx-2"
                                strokeWidth={1.75}
                            />
                            <p className="flex items-center  text-gray-600 font-semibold">
                                Infyni
                                <a
                                    target="_blank"
                                    href="https://infyni.com"
                                    className="hover:underline ml-2 transition-all opacity-0 group-hover:opacity-100 ">
                                    <motion.span
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}>
                                        <ExternalLink
                                            className="p-0"
                                            size={18}
                                            strokeWidth={1.75}
                                        />
                                    </motion.span>
                                </a>
                            </p>
                        </time>
                        <p class="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Get access to over 20+ pages including a dashboard
                            layout, charts, kanban board, calendar, and
                            pre-order E-commerce & Marketing pages.
                        </p>
                    </li>
                    <li class="mb-10 ms-8 border border-gray-200 p-4 rounded-lg group">
                        <span class="absolute flex items-center justify-center w-8 h-8 bg-green-100 rounded-full -start-4 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900 ">
                            <svg
                                class="w-5 h-5 text-green-600 dark:text-green-300 lucide lucide-circle-check"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </span>
                        <h3 class="flex items-center mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                            Front-End Web Developer
                            <span class="bg-green-100 rounded-lg text-green-600 text-sm font-medium me-2 px-2.5 py-0.5 border border-green-200 dark:bg-green-900 dark:text-green-300 ms-3">
                                Aug 2023 - Oct 2023
                            </span>
                        </h3>
                        <time class="flex items-center mb-2 text-base font-normal leading-none text-gray-400 dark:text-gray-500 hover:cursor-pointer">
                            IT Team,
                            <Building2
                                size={18}
                                className="mx-2"
                                strokeWidth={1.75}
                            />
                            <p className="flex items-center text-gray-600 font-semibold">
                                Branding Pioneers
                                <a
                                    target="_blank"
                                    href="https://brandingpioneers.com/"
                                    className="hover:underline ml-2 transition-all opacity-0 group-hover:opacity-100 ">
                                    <motion.span
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}>
                                        <ExternalLink
                                            className="p-0"
                                            size={18}
                                            strokeWidth={1.75}
                                        />
                                    </motion.span>
                                </a>
                            </p>
                        </time>
                        <p class="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Get access to over 20+ pages including a dashboard
                            layout, charts, kanban board, calendar, and
                            pre-order E-commerce & Marketing pages.
                        </p>
                    </li>
                </ol>
            </div>
        </section>
    );
};

export default Experience;
