import React, { useEffect, useState } from "react";
import { Github, Linkedin, History } from "lucide-react";
import GithubFetch from "./apiComponents/GithubFetch";
import Link from "next/link";

const Footer = () => {
    const { specificRepoData } = GithubFetch() ?? {};
    const [showDate, setShowDate] = useState(false);

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const updateDate = () => {
            setCurrentDate(new Date());
        };
        const intervalId = setInterval(updateDate, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const timeOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };

    const dateOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    const formattedTime = currentDate.toLocaleTimeString("en-US", timeOptions);
    const formattedDate = currentDate.toLocaleDateString("en-US", dateOptions);

    const desiredFormat = `
    ${formattedTime}`;
    // ${formattedDate}

    const updatedDate = specificRepoData
        ? new Date(specificRepoData.updated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        })
        : "";

    return (
        <div
            id="footer"
            className="border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 bg-neutral-100 w-full 2xl:w-4/5 xl:w-5/6 m-auto py-6 px-2 sm:p-8 rounded-lg shadow-sm">
            <div className="flex gap-4 items-center justify-between box-border">
                <span

                    className="flex justify-between items-center rounded-2xl cursor-pointer border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50 px-2 py-[6px] transition-all duration-75 text-xs sm:text-sm text-nowrap">
                    <History size={20} strokeWidth={1.75} className="w-4" />
                    <span
                        className="inline transition-opacity ease-in-out duration-500 text-neutral-500 ml-1 opacity-100">
                        {updatedDate}
                    </span>
                </span>
                {/* <span className="dark:text-neutral-50 text-xs sm:text-sm text-center">
                    {desiredFormat}
                </span> */}
                <div className="max-w-fit flex justify-between space-x-2 items-center">
                    <Link
                        prefetch={true}
                        href="https://github.com/SutharShantanu"
                        target="_blank"
                        className="border hover:border-neutral-200 bg-neutral-100 hover:bg-neutral-200 shadow-sm rounded-full px-2 py-[6px] transition-all duration-75 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-50">
                        <Github size={20} strokeWidth={1.75} className="w-4" />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/shantanu-suthar/"
                        prefetch={true}
                        target="_blank"
                        className="border hover:border-neutral-200 bg-neutral-100 hover:bg-neutral-200 shadow-sm rounded-full px-2 py-[6px] transition-all duration-75 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-50">
                        <Linkedin
                            size={20}
                            strokeWidth={1.75}
                            className="w-4"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;
