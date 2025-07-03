"use client";

import type { GitHubActivityEvent, GitHubUser, LinkedInProfile, GitHubActivityDay, SocialProps } from "./types/social.types";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Building, Calendar, Users, Globe, BookOpen, MessageSquare, Languages, BadgeCheck, Briefcase, UserRoundPlus, GitCommitVertical, GitPullRequestArrow } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "../ui/separator";
import { formatJobDuration, formatJoinDate } from "@/functions/period-calcutate";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../animate-ui/radix/tabs";
import 'react-calendar-heatmap/dist/styles.css';
import { Area, AreaChart, CartesianGrid, XAxis, } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { JSX, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, } from "../ui/card";
import { format } from "date-fns";

const Social = ({ github, linkedin }: SocialProps) => {
    return (
        <section className="flex flex-col items-center justify-between gap-10 overflow-hidden max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    Connect With Me
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore my professional journey across different platforms
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                <GitHubCard github={github} />
                <LinkedInCard linkedin={linkedin} />
            </div>
        </section>
    );
};

export default Social;

const GitHubActivityCalendar = ({
    activityData = [],
    totalCommits = 0,
}: {
    activityData: GitHubActivityDay[]
    totalCommits: number
}) => {
    const [selectedYear, setSelectedYear] = useState<string>("all")

    const years = useMemo(() => {
        const yearSet = new Set(
            activityData.map((day) => new Date(day.date).getFullYear().toString())
        )
        const sortedYears = Array.from(yearSet).sort((a, b) => +b - +a)
        return ["all", ...sortedYears]
    }, [activityData])

    const filtered = useMemo(() => {
        if (selectedYear === "all") return activityData
        return activityData.filter(
            (day) => new Date(day.date).getFullYear().toString() === selectedYear
        )
    }, [activityData, selectedYear])

    const areaChartData = useMemo(() => {
        const monthlyCounts: { [month: string]: number } = {}
        filtered.forEach((day) => {
            const date = new Date(day.date)
            const month = date.toLocaleString("default", { month: "short" })
            monthlyCounts[month] = (monthlyCounts[month] || 0) + day.count
        })
        return Object.entries(monthlyCounts)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) =>
                new Date(`${a.month} 1, 2000`).getMonth() -
                new Date(`${b.month} 1, 2000`).getMonth()
            )
    }, [filtered])

    const chartConfig = {
        count: {
            label: "Commits",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">
                    Activity Overview
                </h3>
                <Badge variant="outline" className="flex items-center gap-1">
                    <GitCommitVertical strokeWidth={1} className="size-5 fill-primary" />
                    <span className="text-xs text-muted-foreground">
                        {totalCommits} commits
                    </span>
                </Badge>
            </div>

            <div className="flex items-start gap-1 w-full">
                <Tabs
                    orientation="vertical"
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                    className="w-fit"
                >
                    <TabsList className="flex flex-col gap-1">
                        {years.map((year) => (
                            <TabsTrigger
                                key={year}
                                value={year}
                                className="text-xs capitalize"
                            >
                                {year === "all" ? "All" : year}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                <div className="p-0 w-full rounded-md border border-border overflow-hidden">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-h-[200px] bg-neutral-50 dark:bg-neutral-800"
                    >
                        <AreaChart
                            accessibilityLayer
                            data={areaChartData}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <ChartTooltip
                                cursor={true}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Area
                                dataKey="count"
                                type="natural"
                                fill="var(--color-count)"
                                fillOpacity={0.4}
                                stroke="var(--color-count)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    )
}

const RecentActivity = ({ recentActivities }: { recentActivities: GitHubActivityEvent[] }) => {
    const top3 = recentActivities.slice(0, 3);

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Recent Activity</h3>
            <div className="space-y-2">
                {top3.map((activity, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                    >
                        <div className="mt-0.5">
                            <GitPullRequestArrow className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-start gap-1 justify-between w-full">
                            <p className="text-sm text-foreground font-medium">{activity.type}</p>
                            <span className="text-xs text-muted-foreground">
                                {new Date(activity.created_at).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GitHubCard = ({ github }: { github: GitHubUser }) => {
    const {
        name,
        html_url,
        bio,
        location,
        company,
        created_at,
        public_repos,
        public_gists,
        followers,
        following,
        contributions = [],
        totalCommits = {},
        recentActivities = [],
    } = github;


    const totalCommitCount = Object.values(totalCommits).reduce((acc, val) => acc + val, 0);

    console.log(created_at)
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <Card className="h-full overflow-hidden border border-border bg-card gap-0">
                <Link
                    href={html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <CardHeader className="hover:bg-neutral-50 p-4 dark:hover:bg-neutral-800 transition-colors cursor-pointer group border-b">
                        <div className="flex items-center gap-2 w-full justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-foreground w-fit">
                                    {name}
                                </h2>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Badge className="text-xs bg-[#1f2328]">
                                                <BadgeCheck className=" text-[#1f2328] fill-neutral-50" />
                                                Github
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Verified</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <ArrowRight strokeWidth={1} className="w-5 h-5 group-hover:-rotate-45 transition-all ease-in-out" />
                        </div>
                        <div className="flex flex-col items-start justify-between gap-2">
                            {bio && (
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                    {bio}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {location && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1 text-xs font-light rounded-full"
                                    >
                                        <MapPin className="size-3" strokeWidth={1} />
                                        <span>{location}</span>
                                    </Badge>
                                )}
                                {company && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1 text-xs font-light rounded-full"
                                    >
                                        <Building className="size-3" strokeWidth={1} />
                                        <span>{company}</span>
                                    </Badge>
                                )}
                                {created_at && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1 text-xs font-light rounded-full"
                                    >
                                        <Calendar className="size-3" strokeWidth={1} />
                                        <span>Joined {format(new Date(created_at), 'MMMM yyyy')}</span>
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Link>

                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                            <div className="text-lg font-semibold text-foreground">{public_repos}</div>
                            <div className="text-xs text-muted-foreground">Repos</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                            <div className="text-lg font-semibold text-foreground">{followers}</div>
                            <div className="text-xs text-muted-foreground">Followers</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                            <div className="text-lg font-semibold text-foreground">{following}</div>
                            <div className="text-xs text-muted-foreground">Following</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                            <div className="text-lg font-semibold text-foreground">{public_gists}</div>
                            <div className="text-xs text-muted-foreground">Gists</div>
                        </div>
                    </div>

                    {contributions.length > 0 && (
                        <GitHubActivityCalendar
                            activityData={contributions}
                            totalCommits={totalCommitCount}
                        />
                    )}

                    {recentActivities.length > 0 && (
                        <RecentActivity recentActivities={recentActivities} />
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

const LinkedInCard = ({ linkedin }: { linkedin: LinkedInProfile }) => {
    const {
        connection_count,
        current_company_join_month,
        current_company_join_year,
        current_job_duration,
        follower_count,
        full_name,
        headline,
        is_verified,
        job_title,
        languages,
        linkedin_url,
        location,
        profile_status,
        recommendations_received,
    } = linkedin;

    const languageIcons: Record<string, JSX.Element> = {
        English: <Globe className="size-3" strokeWidth={1} />,
        Hindi: <BookOpen className="size-3" strokeWidth={1} />,
        Punjabi: <MessageSquare className="size-3" strokeWidth={1} />,
        default: <Languages className="size-3" strokeWidth={1} />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <Card className="h-full overflow-hidden border border-border bg-card gap-0">
                <Link
                    href={linkedin_url ? linkedin_url : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <CardHeader className="hover:bg-neutral-50 p-4 dark:hover:bg-neutral-800 transition-colors cursor-pointer group border-b border-">
                        <div className="flex items-center gap-2 w-full justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-foreground w-fit">
                                    {full_name}
                                </h2>
                                {is_verified && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Badge className="text-xs bg-[#0a66c2]">
                                                    <BadgeCheck className=" text-[#0a66c2] fill-neutral-50" />
                                                    Linkedin
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Verified</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            <ArrowRight strokeWidth={1} className="w-5 h-5 group-hover:-rotate-45 transition-all ease-in-out" />
                        </div>
                        <div className="flex flex-col items-start justify-between gap-2">
                            {headline && (
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                    {headline}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {location && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1 text-xs font-light rounded-full"
                                    >
                                        <MapPin className="size-3" strokeWidth={1} />
                                        <span>{location}</span>
                                    </Badge>
                                )}
                                <Separator orientation="vertical" className="h-5" />
                                {profile_status?.joined_date && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1 text-xs font-light rounded-full"
                                    >
                                        <Calendar className="size-3" strokeWidth={1} />
                                        <span>Joined {profile_status.joined_date}</span>
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Link>

                <CardContent className="p-4 space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        {follower_count !== undefined && (
                            <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                <div className="text-lg font-semibold text-foreground">
                                    {follower_count.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">Followers</div>
                            </div>
                        )}
                        {connection_count !== undefined && (
                            <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                <div className="text-lg font-semibold text-foreground">
                                    {connection_count.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">Connections</div>
                            </div>
                        )}
                    </div>

                    {/* Current Position */}
                    {job_title && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2 text-sm">
                                <Briefcase className="w-4 h-4" />
                                Current Position
                            </h3>
                            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                <p className="font-medium text-sm">{job_title}</p>
                                {current_job_duration && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Duration: {formatJobDuration(current_job_duration)}
                                    </p>
                                )}
                                {current_company_join_month && current_company_join_year && (
                                    <p className="text-xs text-muted-foreground">
                                        Started: {formatJoinDate(
                                            current_company_join_month,
                                            current_company_join_year
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2 text-sm">
                                <Languages className="size-4" />
                                Languages
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {languages.map((lang, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs rounded-full select-none font-light flex items-center gap-1"
                                    >
                                        {languageIcons[lang.name] || languageIcons.default}
                                        {lang.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {recommendations_received && recommendations_received.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <UserRoundPlus className="mr-1 size-4" />
                                Recommendations ({recommendations_received.length})
                            </div>

                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {recommendations_received.map((rec, index) => {
                                    const linkedInUsername =
                                        rec.profile_url?.split("/in/")[1]
                                            ?.replace(/\/$/, "")
                                            ?.replace(/[0-9]+/g, "") ?? "LinkedIn User";

                                    const highlightedText = rec.text;

                                    return (
                                        <AccordionItem
                                            key={index}
                                            value={`rec-${index}`}
                                            className="border rounded-md"
                                        >
                                            <AccordionTrigger className="text-left font-light px-4 py-2 hover:no-underline overflow-hidden">
                                                <p
                                                    className="text-xs text-muted-foreground leading-relaxed line-clamp-1 italic truncate"
                                                    dangerouslySetInnerHTML={{
                                                        __html: `"${highlightedText}"`,
                                                    }}
                                                />
                                                <span className="text-nowrap text-xs ">@{linkedInUsername}</span>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 pt-1">
                                                <ScrollArea className="max-h-48 pr-2 overflow-y-scroll">
                                                    <blockquote className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border-l-2 border-border p-3">
                                                        <p
                                                            className="text-xs text-muted-foreground italic mb-2 leading-relaxed"
                                                            dangerouslySetInnerHTML={{
                                                                __html: `"${highlightedText}"`,
                                                            }}
                                                        />
                                                        <cite className="text-xs justify-end text-muted-foreground not-italic font-medium flex items-center gap-1">
                                                            —{" "}
                                                            <Link
                                                                href={rec.profile_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Badge
                                                                    variant="outline"
                                                                    className="gap-1 inline-flex items-center rounded-full border-ring"
                                                                >
                                                                    <Users className="!size-3" />@
                                                                    {linkedInUsername}
                                                                </Badge>
                                                            </Link>
                                                        </cite>
                                                    </blockquote>
                                                </ScrollArea>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};
