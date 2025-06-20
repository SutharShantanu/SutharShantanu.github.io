"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

interface LinkButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: "outline" | "default";
    tooltip: string;
}

function LinkButton({ href, children, variant = "outline", tooltip }: LinkButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant={variant} asChild size="sm" className="flex-1" tabIndex={0}>
                    <Link href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                        {children}
                    </Link>
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
    return (
        <motion.div
            key={id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            tabIndex={-1}
            className="flex flex-col h-full"
        >
            <Card className="hover:shadow-lg gap-0 transition-shadow flex flex-col h-full border-none">
                <CardHeader className="p-0">
                    <Image
                        src={image ? image : DefaultProject}
                        alt={`${title} screenshot`}
                        width={400}
                        height={200}
                        className="object-cover rounded-t-lg w-full h-[200px]"
                        priority={false}
                    />
                </CardHeader>

                <CardContent className="flex flex-col flex-grow p-4">
                    <h3 className="font-semibold text-xl mb-2">{title}</h3>
                    <p className="text-muted-foreground mb-3 flex-grow line-clamp-3">{description}</p>

                    <div className="text-sm mb-3 space-y-1 text-muted-foreground">
                        <p>
                            <strong>Language:</strong> {language} | ⭐ {stars} | 🍴 {forks} | ⚠️ {openIssues} open
                            issues
                        </p>
                        <p>
                            Updated: {updatedAt} | Size: {sizeKB} KB | License: {license}
                        </p>
                    </div>

                    {topics && topics.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {topics.map((topic: string) => (
                                <Badge variant="secondary" key={topic} className="text-xs cursor-default">
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
                        <LinkButton href={livePreviewUrl} variant="default" tooltip="Live project demo">
                            Live Demo
                        </LinkButton>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
