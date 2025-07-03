import { StaticImageData } from "next/image";
import { SortKey } from "../constants/project.constant";
export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    updated_at: string;
    size: number;
    license: { name: string } | null;
    topics?: string[];
}

export interface ProjectType {
    id: number;
    title: string;
    description?: string;
    category?: string;
    repositoryUrl: string;
    livePreviewUrl?: string | null;
    image?: string | StaticImageData;
    updatedAt?: string;
    language?: string | null;
    stars?: number;
    forks?: number;
    openIssues?: number;
    sizeKB?: number;
    license?: string | null;
    topics?: string[];
}

export interface ProjectsProps {
    projects: ProjectType[];
}


export interface SortSelectProps {
    value: SortKey;
    onChange: (value: SortKey) => void;
}

export interface FilterSelectProps {
    value: string;
    options: string[];
    onChange: (value: string) => void;
}