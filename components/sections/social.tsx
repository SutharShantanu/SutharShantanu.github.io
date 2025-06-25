"use client";

import React, { JSX } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ArrowRight, BadgeCheck, BookOpen, Github, Globe, MapPinned, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GitHubUser, LinkedInProfile } from "./types/social.types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { formatJobDuration, formatJoinDate } from "@/functions/period-calcutate";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";


const Social = ({ github, linkedin }: { github: GitHubUser; linkedin: LinkedInProfile }) => {

    return (
        <section className="min-h-screen px-6 py-20 max-w-6xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center">Connect With Me</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <GitHubCard github={github} />
                <LinkedInCard linkedin={linkedin} />
            </div>
        </section>
    );
}

export default Social;

const GitHubCard = ({ github }: { github: GitHubUser }) => {
    return (
        <Card>
            <CardHeader className="flex items-center gap-4">
                <Image
                    src={github.avatar_url}
                    alt={`GitHub Avatar of ${github.name}`}
                    width={64}
                    height={64}
                    className="rounded-full"
                />
                <div>
                    <h2 className="text-xl font-semibold">{github.name}</h2>
                    <p className="text-sm text-muted-foreground">@{github.login}</p>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{github.bio}</p>
                <div className="flex items-center gap-4 text-sm mt-4">
                    <span>📦 {github.public_repos} Repos</span>
                    <span>👥 {github.followers} Followers</span>
                </div>
            </CardContent>
            <CardFooter>
                <Link
                    href={github.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                >
                    <Github className="mr-2 w-4 h-4" />
                    View on GitHub
                </Link>
            </CardFooter>
        </Card>
    );
}

const LinkedInCard = ({ linkedin }: { linkedin: LinkedInProfile }) => {
    const {
        certifications,
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
        school,
        recommendations_received,
    } = linkedin;

    const languageIcons: Record<string, JSX.Element> = {
        English: <Globe className="inline-block w-4 h-4 mr-1" />,
        Hindi: <BookOpen className="inline-block w-4 h-4 mr-1" />,
        Punjabi: <MessageSquare className="inline-block w-4 h-4 mr-1" />,
        // fallback icon for other languages
        default: <Globe className="inline-block w-4 h-4 mr-1" />,
    };

    const currentUsername = linkedin.full_name?.split(" ")[0]?.toLowerCase();

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex items-center gap-4 p-4 group border-b border-border hover:bg-neutral-50 transition-all ease-in-out">
                <div className="flex flex-col gap-2">
                    <motion.div className="flex items-center gap-2">
                        <h2 className="text-xl">{full_name}</h2>
                        {is_verified && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <Badge
                                        variant="secondary"
                                        className="bg-[#0a66c2] text-white dark:bg-blue-600 text-xs rounded-full"
                                    >
                                        LinkedIn
                                        <BadgeCheck strokeWidth={1} className="text-[#0a66c2] fill-neutral-50 w-5 h-5" />
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="w-fit min-w-fit ">
                                    <p className="text-xs">Verified</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </motion.div>
                    {headline && <p className="text-xs text-muted-foreground">{headline}</p>}
                    {location && (<motion.div className="flex items-center gap-1 text-xs text-muted-foreground select-none">
                        <MapPinned className="w-4 h-4" strokeWidth={1} />
                        <p className="text-xs text-muted-foreground">{location}</p>
                    </motion.div>)}

                </div>
                <Button
                    href={linkedin_url}
                    asLink
                    variant="outline"
                    size="icon"
                    rel="noopener noreferrer"
                    className="text-xs rounded-full w-8 h-8 cursor-pointer"
                >
                    <ArrowRight strokeWidth={1} className="transition-all ease-in-out group-hover:-rotate-45 group-hover:translate-x-0" />
                </Button>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    {job_title && (
                        <div>
                            <b>Job Title:</b> {job_title}
                            {current_job_duration && (
                                <div>
                                    <b>Current Job Duration:</b> {formatJobDuration(current_job_duration)}
                                </div>
                            )}
                        </div>
                    )}
                    {profile_status.joined_date && <p>Joined: {profile_status.joined_date}</p>}

                    {school && (
                        <div>
                            <b>School:</b> {school}
                        </div>
                    )}
                    {/* Stats */}
                    {follower_count !== undefined && (
                        <div>
                            <b>Followers:</b> {follower_count}
                        </div>
                    )}
                    {connection_count !== undefined && (
                        <div>
                            <b>Connections:</b> {connection_count}
                        </div>
                    )}

                    {/* Job duration */}
                    {current_company_join_month && current_company_join_year && (
                        <div>
                            <b>Current Company Joined:</b> {formatJoinDate(current_company_join_month, current_company_join_year)}
                        </div>
                    )}

                </div>

                {/* Languages */}
                {languages?.length > 0 && (
                    <div>
                        <h3 className="font-medium">Languages</h3>
                        <ul className="list-disc ml-5 text-xs">
                            {languages.map((lang, i) => (
                                <li key={i}>
                                    {languageIcons[lang.name] || languageIcons.default}
                                    {lang.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {certifications?.length > 0 && (
                    <div>
                        <h3 className="font-medium">Certifications</h3>
                        <ul className="list-disc ml-5 text-xs">
                            {certifications.map((cert, i) => (
                                <li key={i}>
                                    <b>{cert.name}</b> by {cert.authority} ({cert.issued})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recommendations */}
                {recommendations_received?.length > 0 && (
                    <motion.div>
                        <h3 className="font-medium">Recommendations</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <ScrollArea className="max-h-[150px] overflow-y-auto pr-2">
                                {recommendations_received.map((rec, i) => {
                                    const highlightRegex = new RegExp(`\\b(${currentUsername})\\b`, "gi");
                                    const highlightedText = rec.text.replace(
                                        highlightRegex,
                                        `<b class="text-primary font-semibold">$1</b>`
                                    );
                                    return (
                                        <blockquote
                                            key={i}
                                            className="pl-4 border-l-2 italic"
                                            dangerouslySetInnerHTML={{ __html: `“${highlightedText}” — <b>${rec.profile_url}</b>` }}
                                        />
                                    );
                                })}
                            </ScrollArea>
                        </div>
                    </motion.div>
                )}
            </CardContent>

            <CardFooter>

            </CardFooter>
        </Card>
    );
};

