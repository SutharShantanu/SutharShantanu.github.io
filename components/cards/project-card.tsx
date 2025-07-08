import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
    Star, GitBranch, AlertCircle, File, Code,
    Github,
    SquareArrowOutUpRight,
    CalendarDays
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip, TooltipTrigger, TooltipContent
} from "@/components/ui/tooltip";
import DefaultProject from "@/public/DefaultProject.png";
import { ProjectType } from "../sections/types/projects.types";
import { Separator } from "../ui/separator";
import formatDateWithSuffix from "@/functions/format-date-with-suffix";
import { formatFileSize } from "@/functions/file-size-calculate";

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

function LinkButton({
    href,
    children,
    variant = "outline",
    tooltip,
    className,
}: {
    href: string;
    children: React.ReactNode;
    variant?: "outline" | "default";
    tooltip: string;
    className?: string;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={variant}
                    asLink
                    href={href}
                    size="sm"
                    className={`flex-1 ${className}`}
                    tabIndex={0}
                    rel="noopener noreferrer"
                    aria-label={tooltip}
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
}: ProjectType & { metrics?: string }) {

    const formattedDate = updatedAt && formatDateWithSuffix(updatedAt);

    const metaFields = [
        {
            key: "language",
            icon: Code,
            value: language,
            show: !!language,
        },
        {
            key: "stars",
            icon: Star,
            value: stars,
            show: typeof stars === "number" && stars > 0,
        },
        {
            key: "forks",
            icon: GitBranch,
            value: forks,
            show: typeof forks === "number" && forks > 0,
        },
        {
            key: "openIssues",
            icon: AlertCircle,
            value: typeof openIssues === "number" && openIssues > 0 ? `${openIssues} open` : undefined,
            show: typeof openIssues === "number" && openIssues > 0,
        },
    ];
    const visibleMetaFields = metaFields.filter(field => field.show);

    return (
        <motion.div
            key={id}
            variants={cardVariants}
            exit="exit"
            layout
            tabIndex={-1}
            className="flex flex-col h-full"
        >
            <Card className="gap-1 shadow-none flex flex-col h-full border border-border">
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
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="font-semibold text-xl">{title}</h3>
                        <p className="text-muted-foreground text-xs line-clamp-3">
                            {description}
                        </p>
                    </motion.div>
                    <div className="text-sm space-y-2 text-muted-foreground">
                        <div className="flex flex-wrap items-center gap-2">
                            {visibleMetaFields.map((field) => (
                                <React.Fragment key={field.key}>
                                    <IconLabel icon={field.icon}>{field.value}</IconLabel>
                                    <Separator orientation="vertical" className="mx-1 h-4" />
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {updatedAt && (
                                <IconLabel icon={CalendarDays}>Updated: {formattedDate}</IconLabel>
                            )}
                            <Separator orientation="vertical" className="mx-1 h-4" />
                            {sizeKB && sizeKB > 0 && (
                                <IconLabel icon={File}>Size: {formatFileSize(sizeKB)}</IconLabel>
                            )}
                            {license && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-1"
                                >
                                    <Separator orientation="vertical" className="mx-1 h-4" />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>
                                                <IconLabel icon={File}>License: {license}</IconLabel>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{license}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {topics && topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {topics.slice(0, 5).map((topic) => (
                                <Badge
                                    variant="secondary"
                                    key={topic}
                                    className="text-xs font-normal cursor-default"
                                >
                                    {topic}
                                </Badge>
                            ))}
                            {topics.length > 5 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-normal cursor-pointer"
                                        >
                                            +{topics.length - 5} more
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="w-fit space-x-1 p-2">
                                        {topics.slice(5).map((topic) => (
                                            <Badge
                                                variant="secondary"
                                                key={topic}
                                                className="text-xs font-normal cursor-default"
                                            >
                                                {topic}
                                            </Badge>
                                        ))}
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex gap-4 px-4 pb-4 pt-0">
                    <LinkButton href={repositoryUrl} tooltip="View source code on GitHub" className="w-1/2">
                        <Github strokeWidth={1} />
                        GitHub
                    </LinkButton>
                    {livePreviewUrl && <Separator orientation="vertical" className="h-6" />}
                    {livePreviewUrl && (
                        <LinkButton
                            href={livePreviewUrl}
                            variant="default"
                            tooltip="Live project demo"
                            className="w-1/2"
                        >
                            <SquareArrowOutUpRight strokeWidth={1.5} />
                            Live Demo
                        </LinkButton>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
