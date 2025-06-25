import { GITHUB_USERNAME, LINKEDIN_USERNAME } from "@/components/sections/constants/social.constant";
import ExperienceTimeline from "@/components/sections/experience-timeline";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Social from "@/components/sections/social";
import { Summary } from "@/components/sections/summary";
import { GitHubRepo, ProjectType } from "@/components/sections/types/projects.types";
import { Octokit } from "octokit";

export default async function Home() {
  const githubReposRes = await fetch("https://api.github.com/users/SutharShantanu/repos", {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/vnd.github.mercy-preview+json",
    },
  });

  if (!githubReposRes.ok) throw new Error("Failed to fetch GitHub repos");
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

  // GitHub Profile
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  const { data: github } = await octokit.rest.users.getByUsername({
    username: process.env.GITHUB_USERNAME ?? GITHUB_USERNAME,
  });

  const encodedUrl = encodeURIComponent(`https://www.linkedin.com/in/${process.env.LINKEDIN_USERNAME ?? LINKEDIN_USERNAME}/`);
  const linkedinRes = await fetch(
    `https://${process.env.RAPIDAPI_HOST}/get-linkedin-profile?linkedin_url=${encodedUrl}&include_skills=false&include_certifications=true&include_publications=false&include_honors=false&include_volunteers=false&include_projects=false&include_patents=false&include_courses=false&include_organizations=true&include_profile_status=true&include_company_public_url=true`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
      },
      next: { revalidate: 86400 },
    }
  );

  if (!linkedinRes.ok) throw new Error("Failed to fetch LinkedIn profile");

  const linkedinProfile = await linkedinRes.json();

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

  if (!recommendationRes.ok) throw new Error("Failed to fetch LinkedIn recommendations");

  const recommendations = await recommendationRes.json();

  const linkedin = {
    ...linkedinProfile.data,
    recommendations_received: recommendations?.data ?? [],
  };

  console.log("LinkedIn Profile:", linkedin);

  return (
    <div className="min-h-screen w-full -z-10 dark:bg-[radial-gradient(#262626_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-[90vw] lg:max-w-5xl mx-auto flex flex-col gap-4">
        <Hero />
        <Summary />
        <ExperienceTimeline />
        <Skills />
        <Projects projects={projects} />
        <Social github={github} linkedin={linkedin} />
      </div>
    </div>
  );
}
