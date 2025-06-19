import { StaticImageData } from "next/image";

export interface Project {
    title: string;
    description: string;
    category: string;
    repositoryUrl: string;
    livePreviewUrl?: string;
    image: string | StaticImageData;
}
