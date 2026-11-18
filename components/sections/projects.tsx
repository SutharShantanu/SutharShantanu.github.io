"use client";

import React from "react";
import { Github, ExternalLink, Sparkles, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Card, Chip, Link, Button, Tooltip } from "@heroui/react";
import { FluidReveal, FluidItem } from "../ui/fluid-reveal";
import { ProjectType } from "./types/projects.types";

interface ProjectPreviewCard {
    title: string;
    caption: string;
    badge?: string;
    type: "interface" | "architecture";
    metrics?: string[];
}

interface ProjectItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    liveUrl?: string;
    githubUrl: string;
    tech: string[];
    previews: ProjectPreviewCard[];
}

const PROJECTS: ProjectItem[] = [
    {
        id: "boozeblues",
        title: "Boozeblues E-Commerce",
        subtitle: "Storefront & checkout engine",
        description:
            "High-performance modern beverage storefront with React Server Components (RSC), real-time cart mutations, streaming SSR, and sub-second Largest Contentful Paint (LCP 0.9s).",
        liveUrl: "https://boozeblues.vercel.app",
        githubUrl: "https://github.com/SutharShantanu/boozeblues",
        tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "TanStack Query"],
        previews: [
            {
                title: "Curated Storefront UI",
                caption: "Fluid product catalog with sub-second LCP and edge-cached catalog assets",
                badge: "LCP 0.9s",
                type: "interface",
                metrics: ["RSC Streaming", "Instant Cart", "Zero-CLS"],
            },
            {
                title: "Checkout & Inventory Engine",
                caption: "Optimistic UI mutations, atomic stock validation, and Stripe integration",
                badge: "99.9% Uptime",
                type: "architecture",
                metrics: ["TanStack Query", "Zod Validation", "Edge Middleware"],
            },
        ],
    },
    {
        id: "geekycart",
        title: "Geekycart Tech Store",
        subtitle: "Full-stack MERN application",
        description:
            "Electronics marketplace featuring multi-tiered category filtering, Redux Toolkit cart synchronization, JWT session authorization, and compound-indexed MongoDB queries.",
        liveUrl: "https://geekycart.vercel.app",
        githubUrl: "https://github.com/SutharShantanu/geekycart",
        tech: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB"],
        previews: [
            {
                title: "Interactive Catalog Grid",
                caption: "Multi-parameter facet search, price sliders, and real-time stock levels",
                badge: "MERN Stack",
                type: "interface",
                metrics: ["Redux Toolkit", "Compound Indexes", "JWT Auth"],
            },
            {
                title: "Scalable API & Cache Pipeline",
                caption: "RESTful architecture with token refreshes and optimized aggregation pipelines",
                badge: "40ms API",
                type: "architecture",
                metrics: ["Express Routing", "Mongo Aggregations", "Bcrypt Hashing"],
            },
        ],
    },
    {
        id: "portfolio",
        title: "Glass Editorial Portfolio",
        subtitle: "Fluid whitespace personal site",
        description:
            "Minimalist personal website featuring 3D physical folders, fluid handwritten signature, and frosted glass depth. Built with Next.js 16, React 19, and Tailwind CSS.",
        liveUrl: "https://sutharshantanu.github.io",
        githubUrl: "https://github.com/SutharShantanu/SutharShantanu.github.io",
        tech: ["Next.js 16", "React 19", "HeroUI v3", "Framer Motion", "Tailwind CSS v4"],
        previews: [
            {
                title: "Single-Column Editorial",
                caption: "468px reading column with liquid glass sphere optics and 3D folder physics",
                badge: "HeroUI v3",
                type: "interface",
                metrics: ["SVG Ink Engine", "3D Folders", "Zero-Clutter"],
            },
            {
                title: "Micro-Animation System",
                caption: "Spring-damped physics, scroll-triggered reveals, and tactile micro-states",
                badge: "60 FPS",
                type: "architecture",
                metrics: ["Framer Motion 12", "HeroUI Tokens", "Accessible ARIA"],
            },
        ],
    },
];

interface ProjectsProps {
    projects?: ProjectType[];
}

export default function Projects({ projects }: ProjectsProps) {
    void projects;
    return (
        <FluidReveal id="work" aria-labelledby="work-heading" className="scroll-mt-12">
            <h2
                id="work-heading"
                className="relative text-foreground text-[15px] font-medium leading-6 mb-8"
            >
                <span
                    aria-hidden="true"
                    className="sm:absolute sm:top-0 sm:right-[calc(100%+12px)] text-muted font-normal tabular-nums mr-2 sm:mr-0 inline-block"
                >
                    2
                </span>
                Selected work
            </h2>

            <div className="grid gap-16 sm:gap-20">
                {PROJECTS.map((project, idx) => (
                    <FluidItem key={project.id} delay={idx * 0.1} className="flex flex-col gap-4">
                        {/* Project Heading & Repo Link with HeroUI v3 Components */}
                        <div className="flex items-center justify-between gap-4">
                            <Link
                                href={project.liveUrl || project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-baseline gap-1.5 font-medium text-foreground hover:underline underline-offset-4"
                            >
                                <span className="text-[16px]">{project.title}</span>
                                <Link.Icon className="size-3.5 text-muted opacity-70 group-hover:opacity-100" />
                            </Link>

                            <div className="flex items-center gap-2">
                                {project.liveUrl && (
                                    <Tooltip delay={150}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="size-8 p-0 rounded-full text-muted hover:text-foreground"
                                            onPress={() => window.open(project.liveUrl, "_blank", "noopener,noreferrer")}
                                            aria-label={`${project.title} live demo`}
                                        >
                                            <ExternalLink className="size-3.5" />
                                        </Button>
                                        <Tooltip.Content>Open live demo</Tooltip.Content>
                                    </Tooltip>
                                )}
                                <Tooltip delay={150}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="size-8 p-0 rounded-full text-muted hover:text-foreground"
                                        onPress={() => window.open(project.githubUrl, "_blank", "noopener,noreferrer")}
                                        aria-label={`${project.title} source code`}
                                    >
                                        <Github className="size-4" />
                                    </Button>
                                    <Tooltip.Content>View source repository</Tooltip.Content>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Subtitle */}
                        <span className="text-muted text-[13px] -mt-2 block font-normal">
                            {project.subtitle}
                        </span>

                        {/* Narrative Description */}
                        <p className="text-muted text-[15px] leading-relaxed">
                            {project.description}
                        </p>

                        {/* Interactive Horizontal Snapshot Gallery built with uncustomized HeroUI v3 Cards */}
                        <div className="relative mt-2 -mx-2 sm:-mx-3">
                            <div className="no-scrollbar scroll-fade-x flex gap-3.5 overflow-x-auto px-2 sm:px-3 py-2 snap-x snap-mandatory">
                                {project.previews.map((preview, pIdx) => (
                                    <motion.div
                                        key={pIdx}
                                        whileHover={{ y: -3, scale: 1.015 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                        className="flex-shrink-0 snap-start"
                                    >
                                        <Card
                                            variant="default"
                                            className="w-[240px] sm:w-[260px] shadow-surface h-full flex flex-col justify-between"
                                        >
                                            <Card.Header>
                                                <div className="flex items-center justify-between w-full mb-2">
                                                    <div className="flex items-center gap-1.5 opacity-60">
                                                        <div className="size-2 rounded-full bg-red-500/80" />
                                                        <div className="size-2 rounded-full bg-yellow-500/80" />
                                                        <div className="size-2 rounded-full bg-emerald-500/80" />
                                                    </div>
                                                    {preview.badge && (
                                                        <Chip
                                                            size="sm"
                                                            variant="soft"
                                                            color={preview.type === "interface" ? "accent" : "default"}
                                                            className="text-[11px]"
                                                        >
                                                            {preview.type === "interface" ? (
                                                                <Sparkles className="size-2.5 mr-1" />
                                                            ) : (
                                                                <Activity className="size-2.5 mr-1" />
                                                            )}
                                                            {preview.badge}
                                                        </Chip>
                                                    )}
                                                </div>
                                                <Card.Title className="text-[13px] font-medium text-foreground">
                                                    {preview.title}
                                                </Card.Title>
                                                <Card.Description className="text-[12px] text-muted line-clamp-2 mt-1">
                                                    {preview.caption}
                                                </Card.Description>
                                            </Card.Header>

                                            {preview.metrics && (
                                                <Card.Footer className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                                                    {preview.metrics.map((metric) => (
                                                        <Chip
                                                            key={metric}
                                                            size="sm"
                                                            variant="tertiary"
                                                            className="text-[10px] font-mono"
                                                        >
                                                            {metric}
                                                        </Chip>
                                                    ))}
                                                </Card.Footer>
                                            )}
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Tech Stack Chips using HeroUI v3 Chip with semantic variants */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.tech.map((t) => (
                                <Chip key={t} size="sm" variant="secondary" className="font-mono text-xs">
                                    {t}
                                </Chip>
                            ))}
                        </div>
                    </FluidItem>
                ))}
            </div>
        </FluidReveal>
    );
}
