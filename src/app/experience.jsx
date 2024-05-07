"use client";

import React from "react";
import { MoveRight } from "lucide-react";
import { Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/Components/ui/badge";

const Experience = () => {
    return (
        <section
            id="experience"
            className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 w-[90%] 2xl:w-4/5 xl:w-5/6 m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <p className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4">
                Experience
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4"
                    size={40}
                    strokeWidth={2.5}
                />
            </p>
            <div className="m-8">
                <ol class="relative border-s border-neutral-200 dark:border-neutral-800">
                    <li class="mb-10 ms-8 border border-neutral-200 dark:border-neutral-800 hover:dark:bg-neutral-800 transition-all p-4 rounded-lg">
                        <span class="absolute flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full -start-4 dark:bg-yellow-900 ">
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
                        <h3 class="flex flex-col sm:flex-row  sm:w-full mb-1 text-md sm:text-xl font-semibold text-neutral-900 dark:text-white">
                            Technology Operations Associates
                            <Badge
                                variant="outline"
                                class="bg-yellow-100 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 rounded-lg w-fit text-xs sm:text-sm font-medium  px-2.5 py-0.5 border my-2">
                                Oct 2023 - Present
                            </Badge>
                        </h3>
                        <div class="sm:flex items-start sm:items-center mb-2 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500 hover:cursor-pointer">
                            <p>
                                Operations & IT Team
                                <span className="sm:flex hidden">&#44;</span>
                            </p>
                            <p className="flex items-center my-2 sm:my-0">
                                <Building2 size={16} strokeWidth={1.75} />
                                <Link
                                    target="_blank"
                                    href="https://infyni.com"
                                    className="flex items-center mx-2">
                                    Infyni &nbsp;
                                    <ExternalLink
                                        size={16}
                                        strokeWidth={1.75}
                                    />
                                </Link>
                            </p>
                        </div>
                        <p class="mb-4 text-sm sm:text-lg font-normal text-neutral-500 dark:text-neutral-400 ">
                            Get access to over 20+ pages including a dashboard
                            layout, charts, kanban board, calendar, and
                            pre-order E-commerce & Marketing pages.
                        </p>
                    </li>
                    <li class="mb-10 ms-8 border border-neutral-200 dark:border-neutral-800 hover:dark:bg-neutral-800 transition-all p-4 rounded-lg">
                        <span class="absolute flex items-center justify-center w-8 h-8 bg-green-100 rounded-full -start-4 dark:bg-green-900 ">
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
                        <h3 class="flex flex-col sm:flex-row  sm:w-full mb-1 text-md sm:text-xl font-semibold text-neutral-900 dark:text-white">
                            Front-End Web Developer
                            <Badge
                                variant="outline"
                                class="bg-green-100 border-green-200 dark:border-green-800 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-lg w-fit text-xs sm:text-sm font-medium px-2.5 py-0.5 border  my-2">
                                Aug 2023 - Oct 2023
                            </Badge>
                        </h3>
                        <div class="sm:flex items-start sm:items-center mb-2 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500 hover:cursor-pointer">
                            <p>
                                Web Team
                                <span className="sm:flex hidden">&#44;</span>
                            </p>

                            <p className="flex items-center my-2 sm:my-0">
                                <Building2 size={16} strokeWidth={1.75} />
                                <Link
                                    target="_blank"
                                    href="https://brandingpioneers.com/"
                                    className="flex items-center mx-2">
                                    Branding Pioneers &nbsp;
                                    <ExternalLink
                                        size={16}
                                        strokeWidth={1.75}
                                    />
                                </Link>
                            </p>
                        </div>
                        <p class="mb-4 text-sm sm:text-lg font-normal text-neutral-500 dark:text-neutral-400 ">
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
