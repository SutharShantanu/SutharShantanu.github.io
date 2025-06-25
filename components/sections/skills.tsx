"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CardTypes } from "./types/skills.types";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsContents } from "../animate-ui/radix/tabs";
import SectionHeader from "../ui/section-header/section-header";
import { motion } from "motion/react";
import { MagicCard } from "../magicui/magic-card";
import { Card, CardContent, CardHeader } from "../ui/card";

const cards: CardTypes[] = [

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
const categories = ["All", ...Array.from(new Set(cards.map((c) => c.category)))];

const PAGE_SIZE = 8;

const Skills = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [page, setPage] = useState(1);

    const filteredCards =
        selectedCategory === "All"
            ? cards
            : cards.filter((c) => c.category === selectedCategory);

    const totalPages = Math.ceil(filteredCards.length / PAGE_SIZE);

    const paginatedCards = filteredCards.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleTabChange = (cat: string) => {
        setSelectedCategory(cat);
        setPage(1);
    };

    return (
        <section className="flex flex-col items-center justify-center gap-10 p-6 overflow-hidden backdrop-blur-sm ring-border border rounded-2xl max-w-5xl">
            <SectionHeader
                title="Skills & Technologies"
                description="Explore the tools and technologies I use across frontend, backend, deployment, and more."
            />

            <Tabs
                value={selectedCategory}
                onValueChange={handleTabChange}
                className="flex flex-col items-center w-full"
            >
                <TabsList className="flex w-full justify-center gap-2 mb-6">
                    {categories.map((cat) => (
                        <TabsTrigger key={cat} value={cat}>
                            {cat}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContents className="w-full">
                    <TabsContent value={selectedCategory}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 overflow-hidden">
                            {paginatedCards.map(({ index, title, imageUrl, category }) => (
                                <SkillCard
                                    key={index}
                                    title={title}
                                    category={category}
                                    imageUrl={imageUrl}
                                    index={index}
                                />
                            ))}
                        </div>
                    </TabsContent>
                </TabsContents>
            </Tabs>

            <Pagination className="mx-auto w-fit flex justify-center">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            aria-disabled={page === 1}
                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i + 1}>
                            <PaginationLink
                                isActive={page === i + 1}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            aria-disabled={page === totalPages}
                            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </section>
    );
};

export default Skills;

const SkillCard = ({ title, category, imageUrl }: CardTypes) => {
    return (
        <motion.div
            transition={{ type: "spring", stiffness: 300 }}
            whileTap={{ scale: 0.98 }}
            tabIndex={0}
            aria-label={`${title} skill, category ${category}`}
        >
            <Card className="border-border rounded-lg shadow-none hover:shadow-md transition-shadow">
                <CardHeader className="flex items-center justify-center p-4 pb-0">
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain"
                        loading="lazy"
                        draggable={false}
                    />
                </CardHeader>

                <CardContent className="flex flex-col items-center text-center space-y-1 p-4">
                    <span className="font-medium text-base">{title}</span>
                    <small className="text-muted-foreground text-sm">{category}</small>
                </CardContent>
            </Card>
        </motion.div>
    );
};

