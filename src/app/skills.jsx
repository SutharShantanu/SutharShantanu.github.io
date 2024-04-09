"use client";

import React, { useState } from "react";
import { MoveRight } from "lucide-react";
import SkillCard from "@/Components/SkillCard";

const Skills = () => {
    const [selectedTab, setSelectedTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const skillsPerPage = 8;

    const handleTabChange = (value) => {
        setSelectedTab(value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredCards.length / skillsPerPage))
        );
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
        <section
            id="skills"
            className="border min-h-[87vh] border-gray-200 w-full 2xl:w-4/5 xl:w-5/6  m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <div className="group inline-block text-left text-5xl w-fit hover:font-bold hover transition-all">
                Skills
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4 group-hover:line-through"
                    size={40}
                    strokeWidth={2.5}
                />
            </div>
            <div className="flex items-stretch justify-between mt-4">
                <div className="w-[65%]">
                    <div className="w-full h-fit" onChange={handleTabChange}>
                        <div className="w-full">
                            <div className="flex border border-gray-200 rounded-xl mb-4 p-2 bg-gray-100">
                                <button
                                    onClick={() => handleTabChange("all")}
                                    className={`${
                                        selectedTab === "all"
                                            ? "bg-white shadow-md"
                                            : ""
                                    } w-1/4 p-2 text-center rounded-xl  mr-2 hover:cursor-pointer transition-all duration-300 ease-in-out`}>
                                    All
                                </button>
                                <button
                                    onClick={() => handleTabChange("Frontend")}
                                    className={`${
                                        selectedTab === "Frontend"
                                            ? "bg-white rounded-xl shadow-md"
                                            : ""
                                    } w-1/4 p-2 text-center hover:cursor-pointer transition-all ease-in-out`}>
                                    Frontend
                                </button>
                                <button
                                    onClick={() => handleTabChange("Backend")}
                                    className={`${
                                        selectedTab === "Backend"
                                            ? "bg-white rounded-xl shadow-md"
                                            : ""
                                    } w-1/4 p-2 text-center hover:cursor-pointer transition-all ease-in-out`}>
                                    Backend
                                </button>
                                <button
                                    onClick={() =>
                                        handleTabChange("Deployment")
                                    }
                                    className={`${
                                        selectedTab === "Deployment"
                                            ? "bg-white rounded-xl shadow-md"
                                            : ""
                                    } w-1/4 p-2 text-center hover:cursor-pointer transition-all ease-in-out`}>
                                    Deployment
                                </button>

                                <button
                                    onClick={() => handleTabChange("Tools")}
                                    className={`${
                                        selectedTab === "Tools"
                                            ? "bg-white rounded-xl shadow-md"
                                            : ""
                                    } w-1/4 p-2 text-center hover:cursor-pointer transition-all ease-in-out `}>
                                    Tools
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 grid-rows-2 gap-4 w-full">
                            {visibleCards.map((card) => (
                                <SkillCard key={card.index} card={card} />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-4 space-x-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`${
                                currentPage === 1
                                    ? "bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300 cursor-pointer"
                            } py-1 px-3 rounded-xl  transition-all ease-in-out  shadow-sm`}>
                            Previous
                        </button>

                        {Array.from({
                            length: Math.min(
                                5,
                                Math.ceil(filteredCards.length / skillsPerPage)
                            ),
                        }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`${
                                    currentPage === index + 1
                                        ? "bg-white border border-gray-400"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                } border border-gray-300 py-1 px-3 rounded-xl  transition-all ease-in-out cursor-pointer shadow-sm`}>
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={
                                currentPage ===
                                Math.ceil(filteredCards.length / skillsPerPage)
                            }
                            className={`${
                                currentPage ===
                                Math.ceil(filteredCards.length / skillsPerPage)
                                    ? "bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300 cursor-pointer"
                            } py-1 px-3 rounded-xl  transition-all ease-in-out  shadow-sm`}>
                            Next
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-4 grid-rows-3 gap-4 w-[33%] max-h-[600px] lg:w-40%">
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

const SkillGrid = ({ unit, title }) => {
    return (
        <div className="col-span-2 row-span-1 bg-black rounded-xl text-white">
            <div className="h-full flex items-center justify-center">
                <div className="text-center p-4">
                    <div className="text-3xl">{unit}</div>
                    <div>{title}</div>
                </div>
            </div>
        </div>
    );
};

const SkillGridFull = ({ unit, title }) => {
    return (
        <div className="col-span-4 row-span-1 bg-black rounded-xl text-white">
            <div className="h-full flex items-center justify-center">
                <div className="text-center p-4">
                    <div className="text-3xl">{unit}</div>
                    <div>{title}</div>
                </div>
            </div>
        </div>
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
        imageUrl:
            "https://seeklogo.com/images/G/github-logo-5F384D0265-seeklogo.com.png",
    },
];
