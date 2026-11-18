import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { NEXT_GITHUB_USERNAME, LINKEDIN_USERNAME } from "@/components/sections/constants/social.constant";
import ExperienceTimeline from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import { Summary } from "@/components/sections/summary";
import { GlassFolders } from "@/components/sections/glass-folders";
import { GitHubRepo, ProjectType } from "@/components/sections/types/projects.types";
import { Experience as LinkedInExperience } from "@/components/sections/types/social.types";
import React from "react";
import { safeFetch } from "@/lib/api-cache";
import {
  getGithubRepos,
  getLinkedInProfile,
  DEFAULT_LINKEDIN_PROFILE,
  DEFAULT_GITHUB_REPOS,
} from "@/lib/cached-fetchers";

export default async function Home() {
  const username = process.env.NEXT_GITHUB_USERNAME ?? NEXT_GITHUB_USERNAME;
  const linkedinUsername = process.env.LINKEDIN_USERNAME ?? LINKEDIN_USERNAME;

  const repos = await safeFetch(
    () => getGithubRepos(username),
    DEFAULT_GITHUB_REPOS,
    "GitHub repos"
  );

  const reposToUse = repos && repos.length > 0 ? repos : DEFAULT_GITHUB_REPOS;

  const projects = reposToUse.map((repo: GitHubRepo) => ({
    id: repo.id,
    title: repo.name,
    description: repo.description,
    repositoryUrl: repo.html_url || `https://github.com/${username}/${repo.name}`,
    livePreviewUrl: repo.homepage || undefined,
    language: repo.language,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    openIssues: repo.open_issues_count || 0,
    updatedAt: repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : "",
    sizeKB: repo.size || 0,
    license: repo.license?.name,
    topics: repo.topics || [],
    image: "",
  })) as ProjectType[];

  const linkedinProfileRaw = await safeFetch(
    () => getLinkedInProfile(linkedinUsername),
    { data: DEFAULT_LINKEDIN_PROFILE } as Record<string, unknown>,
    "LinkedIn profile"
  );

  const linkedinData = ((linkedinProfileRaw as { data?: Record<string, unknown> })?.data ?? DEFAULT_LINKEDIN_PROFILE) as Record<string, unknown>;
  const linkedinExperiences = (linkedinData?.experiences as LinkedInExperience[]) || [];

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Hero />
      <div className="mx-auto flex w-[min(480px,calc(100%-48px))] flex-col gap-24 sm:gap-28 pt-4 pb-20">
        <Summary />
        <Projects projects={projects} />
        <ExperienceTimeline linkedinExperiences={linkedinExperiences} />
        <GlassFolders />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
