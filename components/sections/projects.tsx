"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ClearFiltersButtonProps,
    ProjectsProps,
    ProjectType,
    SortSelectProps,
} from "./types/projects.types";
import SectionHeader from "../ui/section-header/section-header";
import { Briefcase, Clock, SortAscIcon, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectsSkeleton from "./skeletons/project-card";
import ProjectCard from "../cards/project-card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "../ui/multi-select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // shadcn pagination

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

    // Generate options for MultiSelect with label, value and icon
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

    // Filter and sort projects
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

    // Pagination logic: calculate projects for current page
    const totalProjects = filteredSortedProjects.length;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    const currentProjects = useMemo(() => {
        const startIdx = (currentPage - 1) * projectsPerPage;
        return filteredSortedProjects.slice(startIdx, startIdx + projectsPerPage);
    }, [filteredSortedProjects, currentPage, projectsPerPage]);

    // When filter or sort or perPage changes, reset to first page
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTechs, sortKey, projectsPerPage]);

    function clearFilters() {
        setSortKey("updatedAt");
        setSelectedTechs([]);
    }

    const FilterSelect = () => (
        <MultiSelect
            options={techOptions}
            onValueChange={setSelectedTechs}
            defaultValue={selectedTechs}
            placeholder="Filter by Tech"
            variant="inverted"
            animation={2}
            maxCount={3}
            className="w-fit justify-end bg-neutral-50 dark:bg-neutral-800"
        />
    );

    const SortSelect = ({ value, onChange }: SortSelectProps) => (
        <Select
            value={value}
            onValueChange={(v) => onChange(v as SortKey)}
            aria-label="Sort projects"
        >
            <SelectTrigger className="w-fit justify-end bg-neutral-50 dark:bg-neutral-800">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
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

    const ClearFiltersButton = ({ onClear }: ClearFiltersButtonProps) => (
        <Button
            variant="outline"
            onClick={onClear}
            aria-label="Clear filters"
            className="flex items-center gap-2"
        >
            Clear Filters
            <X className="h-4 w-4" />
        </Button>
    );

    // Per page selector options
    const perPageOptions = [3, 4, 5, 6];

    return (
        <section id="projects" className="max-w-6xl flex flex-col gap-2 mx-auto px-6 my-20">
            <SectionHeader
                title="Projects"
                description="Browse my repositories"
                icon={<Briefcase />}
                center={false}
            />
            <motion.div className="flex items-center gap-3 flex-wrap w-fit ml-auto">
                <SortSelect value={sortKey} onChange={setSortKey} />
                <FilterSelect />
                <ClearFiltersButton onClear={clearFilters} />
            </motion.div>
            {loading ? (
                <ProjectsSkeleton />
            ) : (
                <motion.div className="flex flex-col gap-1">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            className="border border-border overflow-hidden"
                            layout
                        >
                            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-border">
                                {currentProjects.length === 0 && (
                                    <p className="text-center text-muted-foreground col-span-full">
                                        No projects match your criteria.
                                    </p>
                                )}

                                {currentProjects.map((project) => (
                                    <div key={project.id}>
                                        <ProjectCard {...project} />
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                    <motion.div className="flex items-center gap-1 w-fit mx-auto">
                        {totalPages > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                isActive={currentPage === i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                        <Select
                            value={projectsPerPage.toString()}
                            onValueChange={(v) => setProjectsPerPage(Number(v))}
                            aria-label="Projects per page"

                        >
                            <SelectTrigger className="w-fit justify-end bg-neutral-50 dark:bg-neutral-800">
                                <SelectValue>{projectsPerPage} per page</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Projects per page</SelectLabel>
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
            )}
        </section>
    );
};

export default Projects;
