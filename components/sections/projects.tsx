"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ProjectsProps,
    ProjectType,
    SortSelectProps,
} from "./types/projects.types";
import SectionHeader from "../ui/section-header/section-header";
import { Briefcase, Clock, SortAscIcon, Star } from "lucide-react";
import ProjectsSkeleton from "./skeletons/project-card";
import ProjectCard from "../cards/project-card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "../ui/multi-select";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const Projects = ({ projects }: ProjectsProps) => {
    type SortKey = "updatedAt" | "title" | "stars";

    const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
    const [loading, setLoading] = useState(true);
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage, setProjectsPerPage] = useState(3);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, []);

    const techOptions = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach((p) => {
            if (p.language) techSet.add(p.language);
        });
        return Array.from(techSet)
            .sort()
            .map((tech) => ({
                label: tech,
                value: tech,
                icon: undefined,
            }));
    }, [projects]);

    const filteredSortedProjects = useMemo(() => {
        const filtered = projects.filter((p) => {
            if (!p.description) return false;
            const wordCount = p.description.trim().split(/\s+/).length;
            if (wordCount < 10) return false;

            if (selectedTechs.length === 0) return true;
            return p.language ? selectedTechs.includes(p.language) : false;
        });

        filtered.sort((a: ProjectType, b: ProjectType) => {
            if (sortKey === "updatedAt") {
                return (
                    new Date(b.updatedAt || "").getTime() -
                    new Date(a.updatedAt || "").getTime()
                );
            }
            if (sortKey === "title") {
                return a.title.localeCompare(b.title);
            }
            if (sortKey === "stars") {
                return (b.stars || 0) - (a.stars || 0);
            }
            return 0;
        });

        return filtered;
    }, [projects, sortKey, selectedTechs]);

    const totalProjects = filteredSortedProjects.length;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    const currentProjects = useMemo(() => {
        const startIdx = (currentPage - 1) * projectsPerPage;
        return filteredSortedProjects.slice(startIdx, startIdx + projectsPerPage);
    }, [filteredSortedProjects, currentPage, projectsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTechs, sortKey, projectsPerPage]);

    const FilterSelect = () => (
        <MultiSelect
            options={techOptions}
            onValueChange={setSelectedTechs}
            defaultValue={selectedTechs}
            placeholder="Filter by Tech"
            maxCount={3}
            className="w-full sm:w-fit justify-end bg-neutral-50 dark:bg-neutral-800"
        />
    );

    const SortSelect = ({ value, onChange }: SortSelectProps) => (
        <Select
            value={value}
            onValueChange={(v) => onChange(v as SortKey)}
            aria-label="Sort projects"
        >
            <SelectTrigger className="w-full sm:w-fit justify-end bg-neutral-50 dark:bg-neutral-800">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectSeparator />
                    <SelectItem value="updatedAt" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Updated Recently
                    </SelectItem>
                    <SelectItem value="title" className="flex items-center gap-2">
                        <SortAscIcon className="h-4 w-4" /> Name (A-Z)
                    </SelectItem>
                    <SelectItem value="stars" className="flex items-center gap-2">
                        <Star className="h-4 w-4" /> Stars 4+
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );

    const renderPageButtons = (showEllipsis: boolean) => {
        return [...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            if (!showEllipsis) {
                return (
                    <PaginationItem key={page}>
                        <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            const isFirst = page === 1;
            const isLast = page === totalPages;
            const isNearCurrent = Math.abs(currentPage - page) <= 1;

            if (isFirst || isLast || isNearCurrent) {
                return (
                    <PaginationItem key={page}>
                        <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (page === currentPage - 2 && page > 2) {
                return (
                    <PaginationItem key="left-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            if (page === currentPage + 2 && page < totalPages - 1) {
                return (
                    <PaginationItem key="right-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            return null;
        });
    };

    const perPageOptions = [3, 4, 5, 6];

    return (
        <section id="projects" className="flex flex-col items-center justify-center p-6 gap-10 overflow-hidden backdrop-blur-sm ring-border border rounded-2xl max-w-5xl">
            <SectionHeader
                title="Projects"
                description="Browse my repositories"
                icon={<Briefcase />}
                center={false}
            />

            <motion.div layout className="flex flex-col sm:flex-row justify-end gap-1 w-full">
                <SortSelect value={sortKey} onChange={setSortKey} />
                <FilterSelect />
            </motion.div>

            {loading ? (
                <ProjectsSkeleton />
            ) : (
                <motion.div layout className="flex flex-col gap-4">
                    <motion.div
                        key={`${sortKey}-${selectedTechs.join(",")}-${currentPage}-${projectsPerPage}`}
                        layout
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.15,
                                    delayChildren: 0.1,
                                },
                            },
                        }}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                    >
                        <AnimatePresence mode="popLayout">
                            {currentProjects.length === 0 ? (
                                <motion.p
                                    layout
                                    key="no-results"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1 },
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="text-center text-muted-foreground col-span-full py-8"
                                >
                                    No projects match your criteria.
                                </motion.p>
                            ) : (
                                currentProjects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        variants={{
                                            hidden: { opacity: 0, scale: 0.95 },
                                            visible: { opacity: 1, scale: 1 },
                                            exit: { opacity: 0, scale: 0.95 },
                                        }}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                    >
                                        <ProjectCard {...project} />
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mt-4"
                    >
                        {totalPages > 1 && (
                            <Pagination className="mx-auto sm:mx-0">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                                            }
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    <div className="flex flex-row gap-1 sm:hidden">
                                        {renderPageButtons(true)}
                                    </div>

                                    <div className=" gap-1 hidden sm:flex">
                                        {renderPageButtons(false)}
                                    </div>

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                            }
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                        <motion.div className="w-fit">
                            <Select
                                value={projectsPerPage.toString()}
                                onValueChange={(v) => setProjectsPerPage(Number(v))}
                                aria-label="Projects per page"
                            >
                                <SelectTrigger className="w-full sm:w-fit justify-end bg-neutral-50 dark:bg-neutral-800">
                                    <SelectValue>{projectsPerPage} per page</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Projects per page</SelectLabel>
                                        <SelectSeparator />
                                        {perPageOptions.map((num) => (
                                            <SelectItem key={num} value={num.toString()}>
                                                {num}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
};

export default Projects;
