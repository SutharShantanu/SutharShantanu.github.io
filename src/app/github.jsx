"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Link as LinkIcon, CheckCheck } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import GitHubCalendar from "react-github-calendar";
import GithubFetch from "@/Components/apiComponents/GithubFetch";
import RepoCard from "@/Components/RepoCard";
import { Loader } from "./Loading";
import { motion } from "framer-motion";

// Reusable Profile Component
const Profile = ({ userData, handleCopy, copied }) => (
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="border bg-neutral-200 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800 rounded-xl w-full lg:w-1/3 p-5 box-border"
  >
    <div className="flex items-start">
      <Image
        width={70}
        height={70}
        className="w-14 h-14 sm:w-[70px] sm:h-[70px] rounded-full box-border mr-4"
        src={userData.avatar_url}
        alt="Github Profile Picture"
      />
      <div className="overflow-auto">
        <Link
          href={userData.html_url}
          target="_black"
          className="text-xl sm:text-4xl font-extralight group items-center flex hover:underline dark:text-neutral-200 underline-offset-8 decoration-1 duration-300 transition-all"
        >
          @{userData.login}
          <LinkIcon className="ml-2" size={20} />
        </Link>
        <Badge variant="outline" className="my-2">
          <p className="font-light text-xs">Focusing</p>
        </Badge>
      </div>
    </div>
    <Separator className="my-3 dark:bg-neutral-700 bg-neutral-300" />
    <p className="text-sm sm:text-base dark:text-neutral-300">{userData.bio}</p>
    <p className="text-sm sm:text-base dark:text-neutral-300">{userData.followers} followers</p>
    <p className="text-sm sm:text-base dark:text-neutral-300">{userData.location}</p>
    <p className="text-sm sm:text-base dark:text-neutral-300">
      {userData.email}
      <Copy
        size={18}
        strokeWidth={1.25}
        className={`ml-2 ${copied ? "hidden" : ""}`}
        onClick={handleCopy}
      />
      <CheckCheck
        size={18}
        strokeWidth={1.25}
        className={`ml-2 ${copied ? "flex" : "hidden"}`}
      />
    </p>
  </motion.div>
);

// Reusable Repo Component
const RepoSection = ({ repoData }) => (
  <motion.section
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 rounded-xl w-full lg:w-[65%] min-w-[50%] text-wrap p-5"
  >
    <RepoCard slides={repoData} />
    <Separator className="my-5 dark:bg-neutral-700" />
    <p className="text-4xl font-extralight">GitHub Calendar</p>
    <div className="shadow-xs rounded-xl p-4 mt-4">
      <GitHubCalendar username="SutharShantanu" />
    </div>
  </motion.section>
);

// Main Github Component
const Github = () => {
  const [copied, setCopied] = useState(false);
  const { userData, repoData, error, loading } = GithubFetch();

  const handleCopy = () => {
    navigator.clipboard.writeText(userData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error loading data</p>;

  return (
    <motion.section
      id="github"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 rounded-lg shadow-xs"
    >
      <div className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4 sm:pt-8 sm:pl-8">
        Github
      </div>
      <div className="m-6 mb-0 flex flex-col lg:flex-row gap-6 items-start justify-between box-border sm:p-0">
        {userData ? (
          <Profile userData={userData} handleCopy={handleCopy} copied={copied} />
        ) : (
          <Loader />
        )}
        <RepoSection repoData={repoData} />
      </div>
    </motion.section>
  );
};

export default Github;
