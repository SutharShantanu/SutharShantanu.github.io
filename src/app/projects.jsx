"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    MoveRight,
    ChevronDown,
    Loader2,
    ChevronUp,
    Telescope,
    User,
    History,
    BadgeCheck,
    BadgeInfo,
    Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import Repos from "./Repos.json";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";

const Projects = () => {
    const [numProjects, setNumProjects] = useState(4);
    const [isLoading, setIsLoading] = useState(false);

    const toggleProjectsVisibility = () => {
        setIsLoading(true);
        setTimeout(() => {
            setNumProjects(numProjects === 4 ? Repos.Repos.length : 4);
            setIsLoading(false);
        }, 1200);
    };

    return (
        <section
            id="projects"
            className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 rounded-lg shadow-sm">
            <div className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4 sm:pt-8 sm:pl-8">
                Projects
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4"
                    size={40}
                    strokeWidth={2.5}
                />
            </div>
            <div
                className="m-6 sm:mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-between box-border
            ">
                {Repos.Repos.slice(0, numProjects).map((ele) => (
                    <Card
                        className="border bg-neutral-200 dark:bg-neutral-800 flex flex-col justify-between md:h-[620px] xl:h-[650px] 2xl:h-[640px] rounded-xl shadow-sm transition-all duration-300 group border-neutral-200 dark:border-neutral-800"
                        key={ele.id}>
                        <CardHeader>
                            <CardTitle className="">{ele.name}</CardTitle>
                            <CardDescription className="line-clamp-4 xl:line-clamp-none">
                                {ele.description}
                            </CardDescription>
                        </CardHeader>
                        <Separator className="mb-5 hidden sm:w-[93%] mx-auto dark:bg-neutral-800" />
                        <CardContent>
                            <div className="relative">
                                <Image
                                    src={ele.img}
                                    alt=""
                                    width={500}
                                    height={500}
                                    className="h-[430px] w-full object-cover mx-auto object-top rounded-xl "
                                />
                                <div className="absolute bottom-0 left-0 right-0 px-4 py-3  bg-gradient-to-t from-neutral-600 to-transparent rounded-xl backdrop-filter backdrop-blur-sm">
                                    <div className="flex items-center h-5 mb-2">
                                        <p
                                            className={`border w-fit flex items-center mr-2 rounded-full text-xs sm:text-sm font-normal px-2 py-1 sm:py-[.7px] ${ele.status === "ongoing"
                                                ? "bg-yellow-100 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                                                : "bg-green-100 border-green-200 dark:border-green-800 text-green-600 dark:bg-green-900 dark:text-green-300"
                                                }`}>
                                            {ele.status === "completed" ? (
                                                <BadgeCheck
                                                    size={16}
                                                    strokeWidth={1.75}
                                                    className="text-green-600 dark:text-green-300 mr-1"
                                                />
                                            ) : (
                                                <BadgeInfo
                                                    size={16}
                                                    strokeWidth={1.75}
                                                    className="text-yellow-600 dark:text-yellow-300 mr-1"
                                                />
                                            )}
                                            {`${ele.status
                                                .charAt(0)
                                                .toUpperCase()}${ele.status.slice(
                                                    1
                                                )}`}
                                        </p>

                                        <p className="flex items-center my-2 w-fit bg-neutral-100 dark:bg-neutral-800  rounded-xl font-extralight text-xs sm:text-sm px-2 py-1 sm:py-[.8px] transition-all duration-300">
                                            <History
                                                size={16}
                                                strokeWidth={1.75}
                                                className="text-neutral-500 dark:text-neutral-400 mr-2"
                                            />
                                            {ele.updated_at}
                                        </p>
                                    </div>
                                    <div className="flex">
                                        <div className="flex flex-wrap mt-2 gap-2">
                                            {ele.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-neutral-100 rounded-full text-xs sm:text-sm font-normal px-2 py-1 text-neutral-500 dark:text-neutral-400 dark:bg-neutral-800 ">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 gap-2">
                                        <p className="flex items-center my-2 w-fit bg-neutral-100 dark:bg-neutral-800 rounded-full font-normal text-sm px-2 py-1 transition-all duration-300  ">
                                            {ele.type === "individual" ? (
                                                <User
                                                    size={16}
                                                    strokeWidth={1.75}
                                                    className="text-neutral-500 dark:text-neutral-400 mr-1"
                                                />
                                            ) : (
                                                <Users
                                                    size={16}
                                                    strokeWidth={1.75}
                                                    className="text-neutral-500 dark:text-neutral-400 mr-1"
                                                />
                                            )}
                                            {`${ele.type
                                                .charAt(0)
                                                .toUpperCase()}${ele.type.slice(
                                                    1
                                                )}`}
                                        </p>
                                        <Link
                                            target="_blank"
                                            href={ele.deployments_url}
                                            className="flex items-center group gap-2 text-sm shadow-sm px-2 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800  dark:hover:bg-neutral-700 rounded-xl transition-all duration-300 transform hover:-translate-y-[2px]">
                                            Preview
                                            <Telescope
                                                size={18}
                                                strokeWidth={1.75}
                                                className="text-neutral-500 dark:text-neutral-400"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {Repos.Repos.length > 4 && (
                <Button
                    className={`my-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800  dark:hover:bg-neutral-700 border flex items-center mx-auto border-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700 dark:border-neutral-700 px-3 py-1 rounded-full shadow-sm`}
                    onClick={toggleProjectsVisibility}
                    disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center ">
                            <span className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">
                                Loading
                            </span>
                            <Loader2
                                size={20}
                                strokeWidth={1.75}
                                className="ml-1 animate-spin h-5 w-5 text-neutral-700 dark:text-neutral-300"
                            />
                        </div>
                    ) : numProjects === Repos.Repos.length ? (
                        <div className="text-neutral-700 dark:text-neutral-300 flex items-center text-xs sm:text-sm">
                            <span>Show Less</span>
                            <ChevronUp
                                className="ml-1 text-neutral-700 dark:text-neutral-300"
                                size={20}
                                strokeWidth={1.75}
                            />
                        </div>
                    ) : (
                        <div className="text-neutral-700 dark:text-neutral-300 flex items-center text-xs sm:text-sm">
                            <span>Show More</span>
                            <ChevronDown
                                className="ml-1 text-neutral-700 dark:text-neutral-300"
                                size={20}
                                strokeWidth={1.75}
                            />
                        </div>
                    )}
                </Button>
            )}
        </section>
    );
};

export default Projects;
