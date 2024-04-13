/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
// import ReactTooltip from "react-tooltip";
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

const Github = () => {
    const [loading, setLoading] = useState("Loading...");

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
            className="border border-gray-200 w-full 2xl:w-4/5 xl:w-5/6  m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <div className="group inline-block text-left text-5xl w-fit hover:font-bold hover transition-all">
                Github
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4 group-hover:line-through"
                    size={40}
                    strokeWidth={2.5}
                />
            </div>
            <div className="mt-4 flex items-start justify-between box-border">
                <div className="border border-gray-200 rounded-xl w-[33%] p-5 box-border">
                    <div className="flex items-start">
                        <Image
                            width={70}
                            height={70}
                            className="rounded-full box-border mr-4"
                            src="https://avatars.githubusercontent.com/u/110021464?v=4"
                            alt="Github Profile Picture"
                        />
                        <div className="">
                            <Link
                                href="https://github.com/SutharShantanu"
                                target="_black"
                                prefetch={true}
                                className="w-fit text-4xl font-extralight group items-center text-center flex hover:underline underline-offset-8 decoration-1 duration-300 transition-all">
                                @{userData ? userData.login : loading}
                                <ExternalLink
                                    size={30}
                                    strokeWidth={0.75}
                                    className="text-gray-600 ml-2 hidden group-hover:inline"
                                />
                            </Link>
                            <div className="flex ml-1 border border-green-200 my-2 w-fit px-2 py-[1.5px] font-medium items-start rounded-lg shadow-sm bg-green-100 hover:bg-gray-100 hover:border-gray-300 duration-300 transition-all">
                                <Image
                                    className="w-4 h-4 mr-1"
                                    width={100}
                                    height={100}
                                    src="https://cdn-icons-png.flaticon.com/512/3176/3176382.png"
                                    alt=""
                                />
                                <p className="font-light text-[12px] text-green-600">
                                    Focusing
                                </p>
                            </div>
                        </div>
                    </div>
                    <Separator className="my-5" />
                    <div>
                        <p className="flex items-center text-gray-600 font-light">
                            <CircleUser
                                size={20}
                                strokeWidth={1.75}
                                className="text-gray-400 mr-2"
                            />
                            {userData ? userData.bio : loading}
                        </p>
                        <p className="flex mt-2 items-center text-gray-600 font-light">
                            <Users
                                size={20}
                                strokeWidth={1.75}
                                className="text-gray-400 mr-2"
                            />
                            <b className="font-medium">
                                {userData ? userData.followers : loading}&nbsp;
                            </b>
                            followers
                            <Separator
                                className="h-5 bg-gray-300 mx-2"
                                orientation="vertical"
                            />
                            <b className="font-medium">
                                {userData ? userData.following : loading}
                            </b>
                            &nbsp;following
                        </p>
                        <p className="flex mt-2 items-center text-gray-600 font-light">
                            <MapPin
                                size={20}
                                strokeWidth={1.75}
                                className="text-gray-400 mr-2"
                            />
                            <Link
                                href="https://maps.app.goo.gl/ZXzT7SteAp3m8J867"
                                className="hover:underline underline-offset-2 transition-all duration-300"
                                prefetch={true}
                                target="_black">
                                <b className="font-light">
                                    {userData ? userData.location : loading},
                                    Rajasthan
                                </b>
                            </Link>
                        </p>
                        <p className="flex mt-2 items-center text-gray-600 font-light">
                            <Mail
                                size={20}
                                strokeWidth={1.75}
                                className="text-gray-400 mr-2"
                            />
                            <Link
                                href={`mailto:${
                                    userData ? userData.email : loading
                                }?subject=Greeting%20Message&body=Dear%20Shantanu,%0D%0A%0D%0AHow%20are%20you%20doing%20today?`}
                                target="_blank"
                                prefetch={true}
                                className="hover:underline underline-offset-2 flex items-center group transition-all duration-300">
                                {userData ? userData.email : loading}
                                <ExternalLink
                                    size={18}
                                    strokeWidth={1.25}
                                    className="text-gray-600 ml-2 hidden group-hover:block"
                                />
                            </Link>
                        </p>
                        <p className="flex mt-2 items-center text-gray-600 font-light">
                            <LinkIcon
                                size={20}
                                strokeWidth={1.75}
                                className="text-gray-400 mr-2"
                            />
                            <Link
                                href="https://linktr.ee/shantanu_suthar"
                                target="_blank"
                                prefetch={true}
                                className="hover:underline underline-offset-2 flex items-center group transition-all duration-300">
                                https://linktr.ee/shantanu_suthar
                                <ExternalLink
                                    size={18}
                                    strokeWidth={1.25}
                                    className="text-gray-600 ml-2 hidden group-hover:block"
                                />
                            </Link>
                        </p>
                    </div>
                    <Separator className="my-5" />
                    <div>
                        <p>Achievements</p>

                        <div className="flex items-center justify-around w-fit">
                            <div className="relative">
                                <Image
                                    src="https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png"
                                    alt="Pull Shark"
                                    width={80}
                                    height={80}
                                />
                                <p className="absolute bottom-2 right-0 shadow-sm bg-red-100 rounded-2xl text-red-600 text-xs px-2.5 py-0.5 border border-red-200">
                                    X2
                                </p>
                            </div>

                            <Image
                                src="https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png"
                                alt="Quickdraw"
                                width={80}
                                height={80}
                            />
                            <Image
                                src="https://github.githubassets.com/assets/yolo-default-be0bbff04951.png"
                                alt="Yolo"
                                width={80}
                                height={80}
                            />
                        </div>
                    </div>
                    <Separator className="my-5" />
                    <div>
                        <p>Organizations</p>
                        <div className="flex items-center justify-between w-fit mt-2 gap-3">
                            <div className="border border-gray-200 rounded-full px-3 py-1 shadow-sm hover:shadow-md">
                                <Image
                                    src="https://infyni-prod-upgrade.s3.amazonaws.com/static/assets/images/logos/logo.png"
                                    alt="infyni logo"
                                    width={80}
                                    height={40}
                                />
                            </div>
                            <div className="border border-gray-200 rounded-full px-1 py-0 shadow-sm hover:shadow-md">
                                <Image
                                    src="https://masai-website-images.s3.ap-south-1.amazonaws.com/logo.png"
                                    alt="masai logo"
                                    width={100}
                                    height={40}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border border-gray-200 rounded-xl w-[65%] p-5">
                    <RepoCard slides={Repos} options={OPTIONS} />
                    <Separator className="my-5" />
                    <p className="mt-4 text-4xl font-extralight">
                        Github Calender
                    </p>
                    <div className="shadow-sm rounded-xl border border-gray-200 p-4 mt-4">
                        <GitHubCalendar
                            transformData={selectLast12Months}
                            username="SutharShantanu"
                            colorScheme="light"
                            blockSize={12.8}
                            fontSize={14}
                            showColorLegend>
                            {/* <ReactTooltip delayShow={20} html /> */}
                        </GitHubCalendar>
                    </div>
                </div>
            </div>
            {/* <div className="flex items-center justify-between mt-4 shadow-sm border border-gray-200 h-64 space-x-4 rounded-xl p-5">
                <img
                    src="https://github-readme-streak-stats.herokuapp.com/?user=SutharShantanu&hide_border=true&border_radius=12"
                    alt="Shantanu Stats"
                />
                <Separator orientation="vertical" />
                <img
                    src="https://github-readme-stats.vercel.app/api/top-langs/?username=SutharShantanu&hide_border=true&border_radius=12"
                    alt="Shantanu Language"
                />
                <Separator orientation="vertical" />
                <img
                    src="https://github-readme-stats.vercel.app/api?username=SutharShantanu&count_private=true&show_icons=true&hide_border=true&border_radius=12&title_color=000000&text_color=808080&icon_color=9CA3AF"
                    alt="Shantanu Stats"
                />
            </div> */}
        </section>
    );
};

export default Github;
