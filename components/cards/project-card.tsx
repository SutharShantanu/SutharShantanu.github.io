"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
    Star,
    GitBranch,
    AlertCircle,
    Calendar,
    File,
    Code,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

import DefaultProject from "@/public/DefaultProject.png";
import { ProjectType } from "../sections/types/projects.types";
import { Separator } from "../ui/separator";

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
};

function IconLabel({
    icon: Icon,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <span className="flex items-center gap-1 text-xs">
            <Icon className="w-4 h-4" />
            {children}
        </span>
    );
}

interface LinkButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: "outline" | "default";
    tooltip: string;
}

function LinkButton({
    href,
    children,
    variant = "outline",
    tooltip,
}: LinkButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={variant}
                    asLink
                    href={href}
                    size="sm"
                    className="flex-1"
                    tabIndex={0}
                    rel="noopener noreferrer"
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
}


export default function ProjectCard({
    id,
    title,
    description,
    repositoryUrl,
    livePreviewUrl,
    language,
    stars,
    forks,
    openIssues,
    updatedAt,
    sizeKB,
    license,
    topics,
    image,
}: ProjectType) {
    console.log("id", id, " title", title, "image", image, "repositoryUrl", repositoryUrl, "livePreviewUrl", livePreviewUrl, "language", language, "stars", stars, "forks", forks, "openIssues", openIssues, "updatedAt", updatedAt, "sizeKB", sizeKB, "license", license, "topics", topics);
    return (
        <motion.div
            key={id}
            variants={cardVariants}
            exit="exit"
            layout
            tabIndex={-1}
            className="flex flex-col h-full"
        >
            <Card className="hover:shadow-lg transition-all gap-0 shadow-none flex flex-col h-full border border-border">
                <CardHeader className="p-0">
                    <Image
                        src={image ? image : DefaultProject}
                        alt={`${title} screenshot`}
                        width={400}
                        height={200}
                        className="object-cover rounded-t-lg w-full h-[250px]"
                        priority={false}
                    />
                </CardHeader>

                <CardContent className="flex flex-col flex-grow justify-between p-4 gap-2">
                    <h3 className="font-semibold text-xl">{title}</h3>
                    <p className="text-muted-foreground line-clamp-3">{description}</p>

                    <div className="text-sm space-y-2 text-muted-foreground">
                        <div className="flex flex-wrap items-center gap-x-2">
                            {language && language.length > 0 && <IconLabel icon={Code}>{language}</IconLabel>}
                            <Separator orientation="vertical" className="mx-1 h-4" />
                            {stars && <IconLabel icon={Star}>{stars}</IconLabel>}
                            <Separator orientation="vertical" className="mx-1 h-4" />
                            {forks && <IconLabel icon={GitBranch}>{forks}</IconLabel>}
                            <Separator orientation="vertical" className="mx-1 h-4" />
                            {openIssues && <IconLabel icon={AlertCircle}>{openIssues} open</IconLabel>}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <IconLabel icon={Calendar}>Updated: {updatedAt}</IconLabel>
                            <Separator orientation="vertical" className="mx-1 h-4" />
                            <IconLabel icon={File}>Size: {sizeKB} KB</IconLabel>

                            {license && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-1"
                                >
                                    <Separator orientation="vertical" className="mx-1 h-4" />
                                    <IconLabel icon={File}>License: {license}</IconLabel>
                                </motion.div>
                            )}
                        </div>

                    </div>

                    {topics && topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topic) => (
                                <Badge
                                    variant="secondary"
                                    key={topic}
                                    className="text-xs cursor-default"
                                >
                                    {topic}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex gap-4 px-4 pb-4 pt-0">
                    <LinkButton href={repositoryUrl} tooltip="View source code on GitHub">
                        GitHub
                    </LinkButton>
                    {livePreviewUrl && (
                        <LinkButton
                            href={livePreviewUrl}
                            variant="default"
                            tooltip="Live project demo"
                        >
                            Live Demo
                        </LinkButton>
                    )}
                </CardFooter>
            </Card>
        </motion.div >
    );
}
