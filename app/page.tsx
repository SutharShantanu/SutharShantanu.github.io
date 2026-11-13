import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Certifications from "@/components/sections/certificates";
import { CertificationType } from "@/components/sections/types/certificates.types";
import { NEXT_GITHUB_USERNAME, LINKEDIN_USERNAME } from "@/components/sections/constants/social.constant";
import ExperienceTimeline from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Social from "@/components/sections/social";
import { Summary } from "@/components/sections/summary";
import { GitHubRepo, ProjectType } from "@/components/sections/types/projects.types";
import { GitHubUserExtended, LinkedInProfile, Recommendation, Experience as LinkedInExperience } from "@/components/sections/types/social.types";
import React, { Suspense } from "react";
import { DotLoader } from "@/components/ui/dot-loader";
import { safeFetch } from "@/lib/api-cache";
import {
  getGithubRepos,
  getGithubUser,
  getGithubContributions,
  getGithubActivity,
  getLinkedInProfile,
  getLinkedInRecommendations,
} from "@/lib/cached-fetchers";

const game = [
  [14, 7, 0, 8, 6, 13, 20],
  [14, 7, 13, 20, 16, 27, 21],
  [14, 20, 27, 21, 34, 24, 28],
  [27, 21, 34, 28, 41, 32, 35],
  [34, 28, 41, 35, 48, 40, 42],
  [34, 28, 41, 35, 48, 42, 46],
  [34, 28, 41, 35, 48, 42, 38],
  [34, 28, 41, 35, 48, 30, 21],
  [34, 28, 41, 48, 21, 22, 14],
  [34, 28, 41, 21, 14, 16, 27],
  [34, 28, 21, 14, 10, 20, 27],
  [28, 21, 14, 4, 13, 20, 27],
  [28, 21, 14, 12, 6, 13, 20],
  [28, 21, 14, 6, 13, 20, 11],
  [28, 21, 14, 6, 13, 20, 10],
  [14, 6, 13, 20, 9, 7, 21],
];



export default async function Home() {
  const username = process.env.NEXT_GITHUB_USERNAME ?? NEXT_GITHUB_USERNAME;
  const linkedinUsername = process.env.LINKEDIN_USERNAME ?? LINKEDIN_USERNAME;

  // ─── Fetch all data through the global cache ───────────────
  // All fetchers use unstable_cache with tags for on-demand revalidation.
  // safeFetch wraps each call with a fallback so UI never breaks.

  const repos = await safeFetch(
    () => getGithubRepos(username),
    [] as GitHubRepo[],
    "GitHub repos"
  );

  const projects = repos.map((repo: GitHubRepo) => ({
    id: repo.id,
    title: repo.name,
    description: repo.description,
    repositoryUrl: repo.html_url,
    livePreviewUrl: repo.homepage,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    updatedAt: new Date(repo.updated_at).toLocaleDateString(),
    sizeKB: repo.size,
    license: repo.license?.name,
    topics: repo.topics || [],
    image: "",
  })) as ProjectType[];

  const github = await safeFetch(
    () => getGithubUser(username),
    null,
    "GitHub user"
  );

  const calendarData = await safeFetch(
    () => getGithubContributions(username),
    { contributions: {}, total: 0 },
    "GitHub contributions"
  );

  const rawContributions = calendarData.contributions ?? {};

  const activityData = await safeFetch(
    () => getGithubActivity(username),
    [],
    "GitHub activity"
  );

  const linkedinProfileRaw = await safeFetch(
    () => getLinkedInProfile(linkedinUsername),
    { data: {} } as Record<string, unknown>,
    "LinkedIn profile"
  );

  const linkedinData = (linkedinProfileRaw as { data?: Record<string, unknown> })?.data ?? {};
  const certificates = (linkedinData?.certifications as CertificationType[]) || [];
  const linkedinExperiences = (linkedinData?.experiences as LinkedInExperience[]) || [];

  const recommendationsRaw = await safeFetch(
    () => getLinkedInRecommendations(linkedinUsername),
    { data: [] },
    "LinkedIn recommendations"
  );

  const rawData = (recommendationsRaw as { data?: Recommendation[] })?.data ?? [];
  const recommendations: Recommendation[] = rawData.map((rec: Recommendation) => ({
    ...rec,
    username: rec.profile_url?.split("/in/")[1]?.replace(/\/$/, "") ?? "unknown-user",
  }));

  const linkedin = {
    ...linkedinData,
    recommendations_received: recommendations,
  } as LinkedInProfile;

  const topLanguages = repos.reduce((acc: { [lang: string]: number }, repo: GitHubRepo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const githubWithExtras: GitHubUserExtended = {
    ...(github ?? {}),
    contributions: rawContributions,
    totalCommits: calendarData.total,
    recentActivities: activityData,
    topLanguages: topLanguages || {},
  } as GitHubUserExtended;

  return (
    <div className="min-h-screen w-full -z-10 dark:bg-[radial-gradient(#262626_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]">
      <div className="max-w-[90vw] lg:max-w-5xl mx-auto flex flex-col gap-4">
        <Hero />
        <Summary />
        <ExperienceTimeline linkedinExperiences={linkedinExperiences} />
        <Skills />
        <Suspense fallback={<DotLoader
          frames={game}
          className="gap-0.5"
          dotClassName="bg-white/15 [&.active]:bg-white size-1.5"></DotLoader>}>
          <Certifications certifications={certificates} />
        </Suspense>
        <Projects projects={projects} />
        <Suspense fallback={<DotLoader
          frames={game}
          className="gap-0.5"
          dotClassName="bg-white/15 [&.active]:bg-white size-1.5"></DotLoader>}>
          <Social github={githubWithExtras} linkedin={linkedin} />
        </Suspense>
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
