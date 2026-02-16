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
import { GitHubUserExtended, LinkedInProfile, Recommendation } from "@/components/sections/types/social.types";
import { Octokit } from "octokit";
import React, { Suspense } from "react";
import { DotLoader } from "@/components/ui/dot-loader";

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

  const githubReposRes = await fetch(`https://api.github.com/users/${username}/repos`, {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/vnd.github.mercy-preview+json",
    },
  });

  if (!githubReposRes.ok) {
    console.log("Failed to fetch GitHub repos");
  }
  const repos = await githubReposRes.json();

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

  const octokit = new Octokit({
    auth: process.env.NEXT_GITHUB_TOKEN,
  });

  const { data: github } = await octokit.rest.users.getByUsername({
    username,
  });

  let calendarData: any = { contributions: {}, total: 0 };
  try {
    const calendarRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    calendarData = calendarRes.ok ? await calendarRes.json() : { contributions: {}, total: 0 };
  } catch (e) {
    console.log("Failed to fetch GitHub contributions calendar:", e);
  }

  const rawContributions = calendarData.contributions ?? {};

  const activityRes = await fetch(`https://api.github.com/users/${username}/events/public`);
  const activityData = activityRes.ok ? await activityRes.json() : [];

  const encodedUrl = encodeURIComponent(`https://www.linkedin.com/in/${linkedinUsername}/`);
  const linkedinRes = await fetch(
    `https://${process.env.RAPIDAPI_HOST}/enrich-lead?linkedin_url=${encodedUrl}&include_skills=false&include_certifications=true&include_publications=false&include_honors=false&include_volunteers=false&include_projects=false&include_patents=false&include_courses=false&include_organizations=true&include_profile_status=true&include_company_public_url=true`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
      },
      next: { revalidate: 86400 },
    }
  );

  let linkedinProfile: Record<string, unknown> = { data: {} };
  let certificates: CertificationType[] = [];

  if (!linkedinRes.ok) {
    const errorText = await linkedinRes.text();
    console.log("Failed to fetch LinkedIn profile:", errorText);
  } else {
    linkedinProfile = await linkedinRes.json();
    certificates = (linkedinProfile?.data as Record<string, unknown>)?.certifications as CertificationType[] || [];
  }

  const recommendationRes = await fetch(
    `https://fresh-linkedin-profile-data.p.rapidapi.com/get-recommendations-received?linkedin_url=${encodedUrl}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": "fresh-linkedin-profile-data.p.rapidapi.com",
      },
      next: { revalidate: 86400 },
    }
  );

  let recommendations: Recommendation[] = [];

  if (!recommendationRes.ok) {
    console.log("Failed to fetch LinkedIn recommendations");
  } else {
    const recommendationsRaw = await recommendationRes.json();
    const rawData = recommendationsRaw?.data ?? [];
    recommendations = rawData.map((rec: Recommendation) => ({
      ...rec,
      username: rec.profile_url?.split("/in/")[1]?.replace(/\/$/, "") ?? "unknown-user",
    }));
  }

  const linkedinData = (linkedinProfile as { data?: Record<string, unknown> })?.data ?? {};
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
    ...github,
    contributions: rawContributions,
    totalCommits: calendarData.total,
    recentActivities: activityData,
    topLanguages: topLanguages || {},
  }

  return (
    <div className="min-h-screen w-full -z-10 dark:bg-[radial-gradient(#262626_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]">
      <div className="max-w-[90vw] lg:max-w-5xl mx-auto flex flex-col gap-4">
        <Hero />
        <Summary />
        <ExperienceTimeline />
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
