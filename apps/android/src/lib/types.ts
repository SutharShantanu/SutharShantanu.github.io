// Mirror of the website's /api/portfolio response (lib/portfolio-data.ts + constants in the web repo).
export interface Role {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  duration: string;
  isCurrent: boolean;
  highlights: string[];
}

export interface Repo {
  id: number;
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
}

export interface Activity {
  id: string;
  kind: "push" | "pr" | "issue" | "create" | "star" | "fork" | "release" | "other";
  repo: string;
  repoUrl: string;
  title: string;
  branch?: string;
  url: string;
  commits: { sha: string; message: string; url: string }[];
  commitCount?: number;
  ago: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  liveUrl?: string;
  githubUrl: string;
  tech: string[];
  previews: { title: string; caption: string; badge?: string; metrics?: string[] }[];
}

export interface Portfolio {
  profile: {
    name: string;
    headline: string;
    location: string;
    jobTitle: string;
    company: string;
    followers: number;
    connections: number;
    joined: string;
    linkedinUrl: string;
    experienceYears: number;
    avatar: string;
  };
  roles: Role[];
  certifications: { name: string; authority: string; issued: string; url: string; preview?: string }[];
  recommendations: { text: string; name: string; username: string; profileUrl: string }[];
  github: {
    login: string;
    avatar: string;
    bio: string;
    url: string;
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    languages: { name: string; count: number }[];
    yearTotals: Record<string, number>;
    contributionTotal: number;
    activity: Activity[];
  };
  repos: Repo[];
  projects: Project[];
  skills: { title: string; category: string; icon: string }[];
  email: string;
  resumeUrl: string;
}
