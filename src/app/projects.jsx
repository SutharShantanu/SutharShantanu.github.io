"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { motion } from "framer-motion";
import Repos from "./Repos.json";

// Framer Motion Variants
const variants = {
  card: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  },
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  image: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 25 },
    },
  },
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  },
};

const ProjectCard = ({ ele, index }) => (
  <motion.div
    key={ele.id}
    variants={variants.card}
    initial="hidden"
    animate="visible"
    transition={{ delay: index * 0.1 }}
    whileHover="hover"
  >
    <Card className="border bg-neutral-200 dark:bg-neutral-800 flex flex-col justify-between md:h-[620px] xl:h-[650px] 2xl:h-[640px] rounded-xl shadow-xs transition-all duration-300 group border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{ele.name}</CardTitle>
        <p className="line-clamp-4 xl:line-clamp-none">{ele.description}</p>
      </CardHeader>
      <Separator className="mb-5 hidden sm:w-[93%] mx-auto dark:bg-neutral-800" />
      <CardContent>
        <motion.div
          className="relative"
          variants={variants.image}
          initial="hidden"
          animate="visible"
        >
          <Image
            src={ele.img}
            alt={ele.name}
            width={500}
            height={500}
            className="h-[430px] w-full object-cover mx-auto object-top rounded-xl"
          />
          <motion.div
            variants={variants.overlay}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 bg-black bg-opacity-15 rounded-xl"
          >
            <Overlay ele={ele} />
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);

const Overlay = ({ ele }) => (
  <motion.div
    className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-linear-to-t from-neutral-600 to-transparent rounded-xl backdrop-filter backdrop-blur-xs"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 30 }}
  >
    <motion.div
      className="flex items-center h-5 mb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <StatusBadge status={ele.status} />
      <p className="flex items-center my-2 w-fit bg-neutral-100 dark:bg-neutral-800 rounded-xl font-extralight text-xs sm:text-sm px-2 py-1 sm:py-[.8px]">
        <History
          size={16}
          strokeWidth={1.75}
          className="text-neutral-500 dark:text-neutral-400 mr-2"
        />
        {ele.updated_at}
      </p>
    </motion.div>

    <motion.div
      className="mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Tags tags={ele.tags} />
    </motion.div>

    <motion.div
      className="flex items-center justify-between mt-2 gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <TypeBadge type={ele.type} />
      <Link
        target="_blank"
        href={ele.deployments_url}
        className="flex items-center group gap-2 text-sm shadow-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-all duration-300 transform hover:-translate-y-[2px]"
      >
        Preview
        <Telescope
          size={18}
          strokeWidth={1.75}
          className="text-neutral-500 dark:text-neutral-400"
        />
      </Link>
    </motion.div>
  </motion.div>
);

const StatusBadge = ({ status }) => (
  <motion.p
    className={`border w-fit flex items-center mr-2 rounded-full text-xs sm:text-sm font-normal px-2 py-1 sm:py-[.7px] ${
      status === "ongoing"
        ? "bg-yellow-100 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
        : "bg-green-100 border-green-200 dark:border-green-800 text-green-600 dark:bg-green-900 dark:text-green-300"
    }`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
  >
    {status === "completed" ? (
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
    {`${status.charAt(0).toUpperCase()}${status.slice(1)}`}
  </motion.p>
);

const Tags = ({ tags }) => (
  <motion.div
    className="flex flex-wrap mt-2 gap-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.5 }}
  >
    {tags.map((tag, index) => (
      <motion.span
        key={index}
        className="bg-neutral-100 rounded-full text-xs sm:text-sm font-normal px-2 py-1 text-neutral-500 dark:text-neutral-400 dark:bg-neutral-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
      >
        {tag}
      </motion.span>
    ))}
  </motion.div>
);

const TypeBadge = ({ type }) => (
  <motion.p
    className="flex items-center my-2 w-fit bg-neutral-100 dark:bg-neutral-800 rounded-full font-normal text-sm px-2 py-1 transition-all duration-300"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, type: "spring", stiffness: 150, damping: 25 }}
  >
    {type === "individual" ? (
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
    {`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
  </motion.p>
);

// Main Projects Component
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
    <motion.section
      id="projects"
      className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 rounded-lg shadow-xs"
      variants={variants.section}
      initial="hidden"
      animate="visible"
    >
      <Header />
      <div className="m-6 sm:mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-between box-border">
        {Repos.Repos.slice(0, numProjects).map((ele, index) => (
          <ProjectCard key={ele.id} ele={ele} index={index} />
        ))}
      </div>
      <ToggleButton
        isLoading={isLoading}
        numProjects={numProjects}
        totalProjects={Repos.Repos.length}
        toggleProjectsVisibility={toggleProjectsVisibility}
      />
    </motion.section>
  );
};

const Header = () => (
  <div className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4 sm:pt-8 sm:pl-8">
    Projects
    <MoveRight
      className="hidden transition-all group-hover:inline-block group-hover:ml-4"
      size={40}
      strokeWidth={2.5}
    />
  </div>
);

const ToggleButton = ({
  isLoading,
  numProjects,
  totalProjects,
  toggleProjectsVisibility,
}) => (
  <motion.div variants={variants.button} whileHover="hover" whileTap="tap">
    <Button
      className={`my-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border flex items-center justify-center mx-auto border-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700 dark:border-neutral-700 px-3 py-2 rounded-full shadow-xs min-w-[150px]`}
      onClick={toggleProjectsVisibility}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2
            size={20}
            strokeWidth={2}
            className="animate-spin text-neutral-700 dark:text-neutral-300"
          />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Loading
          </span>
        </div>
      ) : numProjects === totalProjects ? (
        <ShowLess />
      ) : (
        <ShowMore />
      )}
    </Button>
  </motion.div>
);

const ShowMore = () => (
  <div className="flex items-center">
    <span className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">
      Show More
    </span>
    <ChevronDown
      size={20}
      strokeWidth={1.75}
      className="ml-1 text-neutral-700 dark:text-neutral-300"
    />
  </div>
);

const ShowLess = () => (
  <div className="flex items-center">
    <span className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">
      Show Less
    </span>
    <ChevronUp
      size={20}
      strokeWidth={1.75}
      className="ml-1 text-neutral-700 dark:text-neutral-300"
    />
  </div>
);

export default Projects;
