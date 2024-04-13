import React from "react";
import { Github, Linkedin, History } from "lucide-react";
import GithubFetch from "./apiComponents/GithubFetch";
import Link from "next/link";

const Footer = () => {
    const { specificRepoData } = GithubFetch() ?? {};

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
            className="border border-gray-200 dark:bg-black w-full 2xl:w-4/5 xl:w-5/6 m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <div className="flex gap-4 items-center justify-between box-border">
                <span className="flex justify-between items-center hover:shadow-sm rounded-2xl cursor-pointer border hover:border-gray-200 dark:border-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white px-2 py-1 transition-all duration-75 ">
                    <History size={20} strokeWidth={1.75} className="mr-1" />
                    {updatedDate}
                </span>
                <span className="dark:text-white">
                    &copy; {new Date().getFullYear()} Shantanu. All Rights
                    Reserved.
                </span>
                <div className="max-w-fit flex justify-between space-x-2 items-center">
                    <Link
                        prefetch={true}
                        href="https://github.com/yourgithubusername"
                        target="_blank"
                        className="border hover:border-gray-200 bg-gray-100 hover:bg-gray-200 shadow-sm rounded-full p-2 transition-all duration-75 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
                        <Github size={20} strokeWidth={1.75} />
                    </Link>
                    <Link
                        href="https://linkedin.com/in/yourlinkedinusername"
                        prefetch={true}
                        target="_blank"
                        className="border hover:border-gray-200 bg-gray-100 hover:bg-gray-200 shadow-sm rounded-full p-2 transition-all duration-75 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
                        <Linkedin size={20} strokeWidth={1.75} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;
