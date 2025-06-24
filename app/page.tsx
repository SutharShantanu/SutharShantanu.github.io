import Hero from "@/components/sections/hero";
import Skills from "@/components/sections/skills";
import ExperienceTimeline from "@/components/sections/experience-timeline";
import { Summary } from "@/components/sections/summary";
import Projects from "@/components/sections/projects";
import { GitHubRepo, ProjectType } from "@/components/sections/types/projects.types";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";

export default async function Home() {
  const res = await fetch("https://api.github.com/users/SutharShantanu/repos", {
    next: { revalidate: 3600 },
    headers: { Accept: "application/vnd.github.mercy-preview+json" },
  });
  if (!res.ok) throw new Error("Failed to fetch repos");
  const data = await res.json();

  const projects = data.map((repo: GitHubRepo) => ({
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

  return (
    <div
      className="min-h-screen w-full -z-10 dark:bg-[radial-gradient(#262626_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
    >
      <div className="max-w-[90vw] lg:max-w-5xl mx-auto border border-red-500">
        <RevealOnScroll>
          <Hero />
        </RevealOnScroll>
        <Summary />
        <ExperienceTimeline />
        <Skills />
        <Projects projects={projects} />
      </div>
    </div>
  );
}
