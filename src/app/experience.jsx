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
            className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 rounded-lg shadow-sm">
            <p className="group inline-block dark:text-neutral-50 text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4 sm:pt-8 sm:pl-8">
                Experience
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4"
                    size={40}
                    strokeWidth={2.5}
                />
            </p>
            <div className="m-6">
                <ol class="relative border-s border-neutral-200 dark:border-neutral-800 space-y-6">
                    <li class="ms-8 border border-neutral-200 dark:border-neutral-800 bg-neutral-200 hover:border-neutral-300 dark:bg-neutral-800 dark:hover:border-neutral-700 transition-all p-4 rounded-lg">
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
                        <h3 class="flex flex-col md:flex-row md:justify-between items-start md:w-full mb-1 sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Associate Frontend Developer
                            <Badge
                                variant="outline"
                                class="bg-yellow-100 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 rounded-lg w-fit text-xs sm:text-sm font-medium  px-2.5 py-0.5 border my-2 md:m-0">
                                June 2024 - Present
                            </Badge>
                        </h3>
                        <div class="sm:flex items-start sm:items-center mb-2 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500 hover:cursor-pointer">
                            <p className="flex">
                                IT Team
                                <span className="sm:flex hidden sm:mr-1">
                                    &#44;
                                </span>
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
                        <ul className="pl-6 text-sm sm:text-lg font-normal text-neutral-500 dark:text-neutral-400 list-disc list-outside ">
                            <li>
                                Frontend Developer (Current Role): Collaborated with designers to create a visually appealing and user-friendly company careers page, including an interactive application form with validation functionalities. This streamlines the application process and ensures accurate candidate information collection.
                            </li>
                            <li>
                                Technical Support Specialist/Champion :
                                Collaborated with operations team, moderators and back-office team to provide the best customer support to learners as needed. Utilized a comprehensive understanding of our systems and processes to deliver tailored solutions and maintain high satisfaction rates among our client base.
                            </li>
                        </ul>
                    </li>
                    <li class="ms-8 border border-neutral-200 dark:border-neutral-800 bg-neutral-200 hover:border-neutral-300 dark:bg-neutral-800 dark:hover:border-neutral-700 transition-all p-4 rounded-lg">
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
                        <h3 class="flex flex-col md:flex-row md:justify-between items-start md:w-full mb-1 sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Technology Operations Associates
                            <Badge
                                variant="outline"
                                class="bg-green-100 border-green-200 dark:border-green-800 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-lg w-fit text-xs sm:text-sm font-medium px-2.5 py-0.5 border my-2 md:m-0">
                                Oct 2023 - May 2024
                            </Badge>
                        </h3>
                        <div class="sm:flex items-start sm:items-center mb-2 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500 hover:cursor-pointer">
                            <p className="flex">
                                Operations & IT Team
                                <span className="sm:flex hidden sm:mr-1">
                                    &#44;
                                </span>
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
                        <ul className="pl-6 text-sm sm:text-lg font-normal text-neutral-500 dark:text-neutral-400 list-disc list-outside ">
                            <li>
                                Technical Support Specialist:
                                Effectively collaborate with the back-office and
                                QA teams to facilitate the thorough testing of
                                our new website launch.
                            </li>
                            <li>
                                Cross-Functional Collaboration: Utilize my
                                technical knowledge to assist the Operations
                                team and provide valuable support to customer
                                service representatives for a central government
                                project.
                            </li>
                            <li>
                                Product Expertise: Successfully introduced and
                                guided customers on new feature integrations
                                within a government project.
                            </li>
                            <li>
                                Testing Initiation: Played a pivotal role in the
                                initial testing phases of this crucial
                                government project, marking a significant step
                                forward in my experience with software testing.
                            </li>
                        </ul>
                    </li>
                    <li class="ms-8 border border-neutral-200 dark:border-neutral-800 bg-neutral-200 hover:border-neutral-300 dark:bg-neutral-800 dark:hover:border-neutral-700 transition-all p-4 rounded-lg">
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
                        <h3 class="flex flex-col md:flex-row md:justify-between items-start md:w-full mb-1 sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Front-End Web Developer
                            <Badge
                                variant="outline"
                                class="bg-green-100 border-green-200 dark:border-green-800 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-lg w-fit text-xs sm:text-sm font-medium px-2.5 py-0.5 border my-2 md:m-0">
                                Aug 2023 - Oct 2023
                            </Badge>
                        </h3>
                        <div class="sm:flex items-start sm:items-center mb-2 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500 hover:cursor-pointer">
                            <p className="flex">
                                Web Team
                                <span className="sm:flex hidden sm:mr-1">
                                    &#44;
                                </span>
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
                        <ul className="pl-6 text-sm sm:text-lg font-normal text-neutral-500 dark:text-neutral-400 list-disc list-outside ">
                            <li>
                                Front-End Developer: Leveraged my expertise in
                                HTML, CSS, JavaScript, and jQuery to develop and
                                maintain client websites, including both
                                pre-existing projects and new builds.
                            </li>
                            <li>
                                Website Development: Played a key role in the
                                development and maintenance of the
                                company&apos;s official website, ensuring a
                                user-friendly and visually appealing experience.
                            </li>
                            <li>
                                Landing Page Creation: Designed and implemented
                                engaging landing pages for SaaS tools, fostering
                                lead generation and user acquisition.
                            </li>
                        </ul>
                    </li>
                </ol>
            </div>
        </section>
    );
};

export default Experience;
