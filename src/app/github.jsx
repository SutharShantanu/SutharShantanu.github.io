/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Link as LinkIcon, CheckCheck } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import GitHubCalendar from "react-github-calendar";
import {
    MoveRight,
    CircleUser,
    Users,
    MapPin,
    Mail,
    ExternalLink,
} from "lucide-react";
import { Separator } from "@/Components/ui/separator";
import GithubFetch from "@/Components/apiComponents/GithubFetch";
import RepoCard from "@/Components/RepoCard";
import Loading from "./Loading";

const Github = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(userData.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const { userData, repoData } = GithubFetch() ?? {
        userData: null,
        repoData: null,
    };
    const Repos = repoData;

    const OPTIONS = { dragFree: true, loop: true };

    const selectLast12Months = (contributions) => {
        const today = new Date();
        const startTimestamp = new Date(
            today.getFullYear(),
            today.getMonth() - 11,
            1
        ).getTime();
        const endTimestamp =
            new Date(today.getFullYear(), today.getMonth() + 1, 1).getTime() -
            1;

        return contributions.filter((day) => {
            const contributionTimestamp = new Date(day.date).getTime();

            return (
                contributionTimestamp >= startTimestamp &&
                contributionTimestamp <= endTimestamp
            );
        });
    };

    return (
        <section
            id="github"
            className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 rounded-lg shadow-sm">
            <div className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4 sm:pt-8 sm:pl-8">
                Github
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4"
                    size={40}
                    strokeWidth={2.5}
                />
            </div>
            <div className="m-6 mb-0 flex flex-col lg:flex-row gap-6 items-start justify-between box-border sm:p-0">
                <div className="border bg-neutral-200 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800 rounded-xl w-full lg:w-1/3 min-w-fit p-5 box-border">
                    <div className="flex items-start">
                        <Image
                            width={70}
                            height={70}
                            className="w-14 h-14 sm:w-[70px] sm:h-[70px] rounded-full box-border mr-4"
                            src="https://avatars.githubusercontent.com/u/110021464?v=4"
                            alt="Github Profile Picture"
                        />
                        <div>
                            <Link
                                href="https://github.com/SutharShantanu"
                                target="_black"
                                prefetch={true}
                                className="w-fit text-xl sm:text-4xl font-extralight group items-center text-center flex hover:underline  dark:text-neutral-200  underline-offset-8 decoration-1 duration-300 transition-all">
                                @{userData ? userData.login : <Loading />}
                                <ExternalLink
                                    size={30}
                                    strokeWidth={0.75}
                                    className="text-neutral-800 dark:text-neutral-200 w-5 h-5 ml-2 sm:hidden group-hover:inline"
                                />
                            </Link>
                            <Badge
                                variant="outline"
                                className="flex ml-1 border bg-green-100 border-green-200 dark:border-green-800 text-green-600 dark:bg-green-900 dark:text-green-300 my-2 w-fit px-2 py-[1.5px] font-medium items-start rounded-lg shadow-sm duration-300 transition-all">
                                <Image
                                    className="w-4 h-4 mr-1"
                                    width={100}
                                    height={100}
                                    src="https://cdn-icons-png.flaticon.com/512/3176/3176382.png"
                                    alt=""
                                />
                                <p className="font-light text-xs text-green-500 dark:text-green-300">
                                    Focusing
                                </p>
                            </Badge>
                        </div>
                    </div>
                    <Separator className="my-5 dark:bg-neutral-700 bg-neutral-300" />
                    <div>
                        <p className="flex items-center text-sm sm:text-base dark:text-neutral-300 text-neutral-800 font-light">
                            <CircleUser
                                size={20}
                                strokeWidth={1.75}
                                className="min-w-[20px] text-neutral-400 mr-2"
                            />
                            {userData ? userData.bio : <Loading />}
                        </p>
                        <p className="flex mt-2 text-sm sm:text-base items-center dark:text-neutral-300 text-neutral-800 font-light">
                            <Users
                                size={20}
                                strokeWidth={1.75}
                                className="text-neutral-400 mr-2"
                            />
                            <b className="font-medium">
                                {userData ? userData.followers : <Loading />}
                                &nbsp;
                            </b>
                            followers
                            <Separator
                                className="h-5 bg-neutral-300 dark:bg-neutral-700 mx-2"
                                orientation="vertical"
                            />
                            <b className="font-medium">
                                {userData ? userData.following : <Loading />}
                            </b>
                            &nbsp;following
                        </p>
                        <p className="flex mt-2 text-sm sm:text-base items-center dark:text-neutral-300 text-neutral-800 font-light">
                            <MapPin
                                size={20}
                                strokeWidth={1.75}
                                className="text-neutral-400 mr-2"
                            />
                            <b className="font-light">
                                {userData ? userData.location : <Loading />},
                                Rajasthan
                            </b>
                        </p>
                        <p className="flex mt-2 text-sm sm:text-base items-center dark:text-neutral-300 text-neutral-800 font-light">
                            <Mail
                                size={20}
                                strokeWidth={1.75}
                                className="text-neutral-400 mr-2"
                            />
                            {userData ? userData.email : <Loading />}
                            <Copy
                                size={18}
                                strokeWidth={1.25}
                                className={` ml-2 cursor-pointer ${
                                    copied ? "hidden" : "text-neutral-400"
                                }`}
                                onClick={handleCopy}
                                title="Copy email address"
                            />
                            <CheckCheck
                                size={18}
                                strokeWidth={1.25}
                                className={` ml-2 cursor-pointer ${
                                    copied
                                        ? "text-green-300 flex"
                                        : "text-neutral-400 hidden"
                                }`}
                            />
                        </p>
                        <p className="flex mt-2 text-sm sm:text-base items-center dark:text-neutral-300 text-neutral-800 font-light">
                            <LinkIcon
                                size={20}
                                strokeWidth={1.75}
                                className="text-neutral-400 mr-2"
                            />
                            <Link
                                href="https://linktr.ee/shantanu_suthar"
                                target="_blank"
                                prefetch={true}
                                className="hover:underline underline-offset-2 flex items-center transition-all duration-300">
                                https://linktr.ee/shantanu_suthar
                            </Link>
                        </p>
                    </div>
                    <Separator className="my-5 dark:bg-neutral-700 bg-neutral-300" />
                    <div>
                        <p className="pb-2">Achievements</p>
                        <div className="flex items-center justify-around w-fit">
                            <div className="relative">
                                <Image
                                    src="https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png"
                                    alt="Pull Shark"
                                    width={80}
                                    height={80}
                                    className="w-16 sm:w-20"
                                />
                                <p className="absolute bottom-2 right-0 shadow-sm border border-red-200 dark:border-red-400 text-red-500 dark:text-red-300 bg-red-100 dark:bg-red-900 rounded-2xl  text-xs px-2.5 py-0.5">
                                    X2
                                </p>
                            </div>
                            <Image
                                src="https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png"
                                alt="Quickdraw"
                                width={80}
                                height={80}
                                className="w-16 sm:w-20"
                            />
                            <Image
                                src="https://github.githubassets.com/assets/yolo-default-be0bbff04951.png"
                                alt="Yolo"
                                width={80}
                                height={80}
                                className="w-16 sm:w-20"
                            />
                        </div>
                    </div>
                    <Separator className="my-5 dark:bg-neutral-700 bg-neutral-300" />
                    <div>
                        <p className="pb-2">Organizations</p>
                        <div className="flex items-center justify-between w-fit mt-2 gap-3">
                            {/* <div className="relative  overflow-hidden"> */}
                            <Image
                                src="https://infyni-prod-upgrade.s3.amazonaws.com/static/assets/images/logos/logo.png"
                                alt="infyni logo"
                                width={90}
                                height={40}
                                className="border border-neutral-300 dark:border-neutral-700 shadow-sm m-2 px-2 py-1 rounded-xl"
                            />

                            {/* </div> */}
                            {/* <div className="relative overflow-hidden"> */}
                            <Image
                                src="https://masai-website-images.s3.ap-south-1.amazonaws.com/logo.png"
                                alt="masai logo"
                                width={90}
                                height={40}
                                className="border border-neutral-300 dark:border-neutral-700 shadow-sm m-2 px-2 py-1 rounded-xl"
                            />
                            {/* </div> */}
                        </div>
                    </div>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 rounded-xl w-full lg:w-[65%] min-w-[50%] text-wrap p-5 mb-6">
                    <RepoCard slides={Repos} options={OPTIONS} />
                    <Separator className="my-5 dark:bg-neutral-700" />
                    <p className="mt-4 text-4xl font-extralight">
                        Github Calender
                    </p>
                    <div className="shadow-sm rounded-xl p-4 mt-4">
                        <GitHubCalendar
                            transformData={selectLast12Months}
                            username="SutharShantanu"
                            colorScheme="light"
                            blockSize={12.8}
                            fontSize={14}
                            showColorLegend></GitHubCalendar>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between mx-6 mb-6 lg:mb-6 lg:mt-4 shadow-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800  gap-4 rounded-xl p-5">
                <div className="flex-grow flex justify-center">
                    <Image
                        src="https://github-readme-streak-stats.herokuapp.com/?user=SutharShantanu&hide_border=true&border_radius=12"
                        alt="Shantanu Stats"
                        width={300}
                        height={300}
                        className="filter w-full h-auto dark:invert grayscale max-w-[500px]"
                    />
                </div>
                <Separator orientation="vertical" className="hidden sm:block" />
                <div className="flex-grow flex justify-center">
                    <Image
                        src="https://github-readme-stats.vercel.app/api/top-langs/?username=SutharShantanu&hide_border=true&border_radius=12"
                        alt="Shantanu Stats"
                        width={300}
                        height={300}
                        className="filter w-full h-auto dark:invert grayscale max-w-[400px]"
                    />
                </div>
                <Separator orientation="vertical" className="hidden sm:block" />
                <div className="flex-grow flex justify-center">
                    <Image
                        src="https://github-readme-stats.vercel.app/api?username=SutharShantanu&count_private=true&show_icons=true&hide_border=true&border_radius=12&title_color=000000&text_color=808080&icon_color=9CA3AF"
                        alt="Shantanu Stats"
                        width={300}
                        height={300}
                        className="filter w-full h-auto dark:invert grayscale max-w-[500px]"
                    />
                </div>
            </div>
        </section>
    );
};

export default Github;
