"use client";

import React, { useEffect, useState } from "react";
import { MoveRight, ChevronRight, ChevronLeft } from "lucide-react";
import SkillCard from "@/Components/SkillCard";
import { Separator } from "@/Components/ui/separator";
import CardSkeleton from "@/Components/Skeleton";
import { motion } from "framer-motion";

const Skills = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const skillsPerPage = 8;

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const handleTabChange = (value) => {
    setLoading(true);
    setSelectedTab(value);
    setCurrentPage(1);
    setTimeout(() => setLoading(false), 2000);
  };

  const handlePreviousPage = () => {
    setLoading(true);
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    setTimeout(() => setLoading(false), 2000);
  };

  const handleNextPage = () => {
    setLoading(true);
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredCards.length / skillsPerPage))
    );
    setTimeout(() => setLoading(false), 2000);
  };

  const filteredCards =
    selectedTab === "all"
      ? cards
      : cards.filter((card) => card.category === selectedTab);
  const visibleCards = filteredCards.slice(
    (currentPage - 1) * skillsPerPage,
    currentPage * skillsPerPage
  );

  return (
    <section className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 rounded-lg shadow-xs">
      <motion.div
        className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4 sm:pt-8 sm:pl-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Skills
        <MoveRight
          className="hidden transition-all group-hover:inline-block group-hover:ml-4 group-hover:line-through"
          size={40}
          strokeWidth={2.5}
        />
      </motion.div>

      <div className="flex flex-col lg:flex-row items-stretch justify-between m-6">
        <div className="w-full lg:w-[65%]">
          <div className="w-full h-fit" onChange={handleTabChange}>
            <div className="w-full">
            <motion.div
    className="flex border border-neutral-200 dark:border-neutral-800 rounded-2xl mb-4 p-1 sm:p-2 bg-neutral-100 dark:bg-neutral-900 space-x-1"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    <TabButton
      value="all"
      selectedTab={selectedTab}
      onClick={handleTabChange}
    >
      All
    </TabButton>
    <TabButton
      value="Frontend"
      selectedTab={selectedTab}
      onClick={handleTabChange}
    >
      Frontend
    </TabButton>
    <TabButton
      value="Backend"
      selectedTab={selectedTab}
      onClick={handleTabChange}
    >
      Backend
    </TabButton>
    <TabButton
      value="Deployment"
      selectedTab={selectedTab}
      onClick={handleTabChange}
    >
      Deployment
    </TabButton>
    <TabButton
      value="Tools"
      selectedTab={selectedTab}
      onClick={handleTabChange}
    >
      Tools
    </TabButton>
  </motion.div>
              {loading ? (
                <CardSkeleton />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                    {visibleCards.map((card) => (
                    <motion.div
                        key={card.index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SkillCard card={card} />
                    </motion.div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredCards.length / skillsPerPage)}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            onPageChange={(page) => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
              setCurrentPage(page);
            }}
          />
        </div>

        <Separator className="mb-5 md:hidden bg-neutral-200 dark:bg-neutral-800" />
        <div className="grid grid-cols-4 grid-rows-3 gap-4 lg:w-[33%] max-h-[600px]">
            <SkillGridFull unit="1200+" title="Hrs Coding" />
            <SkillGrid unit="30+" title="Mini Projects" />
            <SkillGrid unit="5+" title="Major Projects" />
            <SkillGrid unit="300+" title="DSA Problems" />
            <SkillGrid unit="200+" title="Hrs Soft Skills" />
        </div>
      </div>
    </section>
  );
};

export default Skills;

const TabButton = ({ value, selectedTab, onClick, children }) => {
    return (
      <motion.button
        onClick={() => onClick(value)}
        className={`${
          selectedTab === value
            ? "bg-neutral-300 dark:bg-neutral-700 shadow-md"
            : "dark:hover:bg-neutral-800 hover:bg-neutral-200"
        } w-1/4 p-2 text-center rounded-xl hover:cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden text-ellipsis`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.button>
    );
  };  

  const Pagination = ({ currentPage, totalPages, onPrevious, onNext, onPageChange }) => {
    return (
      <div className="flex justify-center my-4 space-x-4">
        <motion.button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? "bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed "
              : "bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-300 cursor-pointer text-neutral-700 dark:text-neutral-300"
          } py-1 px-3 rounded-xl transition-all ease-in-out shadow-sm`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} strokeWidth={1.75} />
        </motion.button>
        {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`${
              currentPage === index + 1
                ? "bg-neutral-200 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-300 dark:border-neutral-800"
            } border-2 border-neutral-200 py-1 px-3 rounded-xl transition-all ease-in-out cursor-pointer shadow-sm`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {index + 1}
          </motion.button>
        ))}
        <motion.button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages
              ? "bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed "
              : "bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-300 cursor-pointer text-neutral-700 dark:text-neutral-300"
          } py-1 px-3 rounded-xl transition-all ease-in-out shadow-sm`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} strokeWidth={1.75} />
        </motion.button>
      </div>
    );
  };

  const SkillGrid = ({ unit, title }) => {
    return (
      <motion.div
        className="col-span-2 row-span-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all rounded-xl text-neutral-800 dark:text-neutral-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-4 select-none">
            {/* Animate the unit */}
            <motion.div
              className="text-3xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {unit}
            </motion.div>
  
            {/* Animate the title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              {title}
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  const SkillGridFull = ({ unit, title }) => {
    return (
      <motion.div
        className="col-span-4 row-span-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all rounded-xl text-neutral-800 dark:text-neutral-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-4 select-none">
            {/* Animate the unit */}
            <motion.div
              className="text-3xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {unit}
            </motion.div>
  
            {/* Animate the title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              {title}
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

const cards = [
    {
        index: 1,
        title: "HTML",
        category: "Frontend",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/174/174854.png",
    },
    {
        index: 2,
        title: "CSS",
        category: "Frontend",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
    },
    {
        index: 3,
        title: "Bootstrap",
        category: "Frontend",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/5968/5968672.png",
    },
    {
        index: 4,
        title: "Tailwind CSS",
        category: "Frontend",
        imageUrl:
            "https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg",
    },
    {
        index: 5,
        title: "JavaScript",
        category: "Frontend",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
    },
    {
        index: 6,
        title: "JSON",
        category: "Frontend",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/9423/9423278.png",
    },
    {
        index: 7,
        title: "React JS",
        category: "Frontend",
        imageUrl: "https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg",
    },
    {
        index: 8,
        title: "Next JS",
        category: "Frontend",
        imageUrl:
            "https://seeklogo.com/images/N/next-js-icon-logo-EE302D5DBD-seeklogo.com.png",
    },
    {
        index: 9,
        title: "Redux",
        category: "Frontend",
        imageUrl:
            "https://seeklogo.com/images/R/redux-logo-9CA6836C12-seeklogo.com.png",
    },
    {
        index: 10,
        title: "Typescript",
        category: "Frontend",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    },
    {
        index: 11,
        title: "Chakra UI",
        category: "Frontend",
        imageUrl: "https://img.icons8.com/?size=256&id=r9QJ0VFFrn7T&format=png",
    },
    {
        index: 12,
        title: "Material UI",
        category: "Frontend",
        imageUrl:
            "https://seeklogo.com/images/M/material-ui-logo-5BDCB9BA8F-seeklogo.com.png",
    },
    {
        index: 13,
        title: "Mantine UI",
        category: "Frontend",
        imageUrl:
            "https://seeklogo.com/images/M/mantine-logo-235E19C978-seeklogo.com.png",
    },
    {
        index: 14,
        title: "Node JS",
        category: "Backend",
        imageUrl:
            "https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png",
    },
    {
        index: 15,
        title: "Express JS",
        category: "Backend",
        imageUrl:
            "https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg",
    },
    {
        index: 16,
        title: "MongoDB",
        category: "Backend",
        imageUrl:
            "https://seeklogo.com/images/M/mongodb-logo-D13D67C930-seeklogo.com.png",
    },
    {
        index: 17,
        title: "Netlify",
        category: "Deployment",
        imageUrl: "https://www.vectorlogo.zone/logos/netlify/netlify-icon.svg",
    },
    {
        index: 18,
        title: "Vercel",
        category: "Deployment",
        imageUrl:
            "https://seeklogo.com/images/V/vercel-logo-F748E39008-seeklogo.com.png",
    },
    {
        index: 19,
        title: "Cyclic",
        category: "Deployment",
        imageUrl:
            "https://cdn-1.webcatalog.io/catalog/cyclic-sh/cyclic-sh-icon-filled-256.webp?v=1669863995747",
    },
    {
        index: 20,
        title: "Render",
        category: "Deployment",
        imageUrl:
            "https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_477db83f729d63210139ec7cd29c1351/render-render.png",
    },
    {
        index: 21,
        title: "PipeOps",
        category: "Deployment",
        imageUrl:
            "https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/zg8tedmsegz0yrtwonej",
    },
    {
        index: 22,
        title: "VS Code Insider",
        category: "Tools",
        imageUrl: "https://img.icons8.com/?size=256&id=hgQsZt1CslPF&format=png",
    },
    {
        index: 23,
        title: "Postman",
        category: "Tools",
        imageUrl:
            "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg",
    },
    {
        index: 24,
        title: "GitHub",
        category: "Tools",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/733/733553.png",
    },
];
