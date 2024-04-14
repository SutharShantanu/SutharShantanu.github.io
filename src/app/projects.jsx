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
            className="border  border-neutral-200 w-full 2xl:w-4/5 xl:w-5/6 m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <div className="group inline-block text-left text-5xl w-fit hover:font-bold hover transition-all">
                Projects
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4 group-hover:line-through"
                    size={40}
                    strokeWidth={2.5}
                />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 items-start justify-between box-border">
                {Repos.Repos.slice(0, numProjects).map((ele) => (
                    <Card
                        className="border border-neutral-200 flex flex-col justify-between h-[670px] p-4 rounded-xl shadow-sm min-h-[350px] transition-all duration-300 group"
                        key={ele.id}>
                        <CardHeader>
                            <CardTitle className="">{ele.name}</CardTitle>
                            <CardDescription className="">
                                {ele.description}
                            </CardDescription>
                        </CardHeader>
                        <Separator className="mb-5 w-[93%] mx-auto" />
                        <CardContent>
                            <div className="relative">
                                <Image
                                    src={ele.img}
                                    alt=""
                                    width={500}
                                    height={500}
                                    className="h-[430px] w-full object-cover mx-auto object-top"
                                />
                                <div className="absolute bottom-0 left-0 right-0 px-4 py-3  bg-gradient-to-t from-neutral-600 to-transparent rounded-xl">
                                    <div className="flex items-center h-5 mb-2">
                                        <p
                                            className={`border w-fit flex items-center mr-2 rounded-full text-sm font-normal px-2 py-[.7px] ${
                                                ele.status === "ongoing"
                                                    ? "bg-yellow-100 border-yellow-200 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                                                    : "bg-green-100 border-green-200 text-green-600 dark:bg-green-900 dark:text-green-300"
                                            }`}>
                                            {ele.status === "completed" ? (
                                                <BadgeCheck
                                                    size={16}
                                                    strokeWidth={1.75}
                                                    className="text-green-600 mr-1"
                                                />
                                            ) : (
                                                <BadgeInfo
                                                    size={16}
                                                    strokeWidth={1.75}
                                                    className="text-yellow-600 mr-1"
                                                />
                                            )}
                                            {`${ele.status
                                                .charAt(0)
                                                .toUpperCase()}${ele.status.slice(
                                                1
                                            )}`}
                                        </p>

                                        <p className="flex items-center my-2 w-fit bg-white rounded-xl font-extralight text-sm px-2 py-[.8px] transition-all duration-300">
                                            <History
                                                size={16}
                                                strokeWidth={1.75}
                                                className="text-neutral-500 mr-2"
                                            />
                                            {ele.updated_at}
                                        </p>
                                    </div>
                                    <div className="flex">
                                        <div className="flex flex-wrap mt-2 gap-2">
                                            {ele.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-neutral-100 rounded-full text-[12px] font-normal px-2 py-1 dark:bg-green-900 dark:text-green-300">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 gap-2">
                                        <p className="flex items-center my-2 w-fit bg-white rounded-full font-normal text-sm px-2 py-1 transition-all duration-300  ">
                                            {ele.type === "individual" ? (
                                                <User
                                                    size={16}
                                                    strokeWidth={1.75}
                                                    className="text-neutral-500 mr-1"
                                                />
                                            ) : (
                                                <Users
                                                    size={16}
                                                    strokeWidth={1.75}
                                                    className="text-neutral-500 mr-1"
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
                                            className="flex items-center group gap-2 text-md shadow-sm px-2 py-1 bg-white hover:bg-neutral-200 rounded-xl transition-all duration-300 transform hover:-translate-y-[2px]">
                                            Preview
                                            <Telescope
                                                size={20}
                                                strokeWidth={1.75}
                                                className="text-neutral-500"
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
                    className={`mt-4 bg-neutral-100 border flex items-center mx-auto border-neutral-200 px-3 py-1 rounded-full hover:bg-neutral-200 hover:border-neutral-300 shadow-sm
    }`}
                    onClick={toggleProjectsVisibility}
                    disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center text-sm text-black">
                            <span>Loading</span>
                            <Loader2
                                size={20}
                                strokeWidth={1.75}
                                className="ml-1 animate-spin h-5 w-5"
                            />
                        </div>
                    ) : numProjects === Repos.Repos.length ? (
                        <div className="text-neutral-600 flex items-center text-sm">
                            <span>Show Less</span>
                            <ChevronUp
                                className="ml-1 text-neutral-600"
                                size={20}
                                strokeWidth={1.75}
                            />
                        </div>
                    ) : (
                        <div className="text-neutral-600 flex items-center text-sm">
                            <span>Show More</span>
                            <ChevronDown
                                className="ml-1 text-neutral-600"
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
