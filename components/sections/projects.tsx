import Image from "next/image";
import { useState } from "react";
import { Project } from "./types/projects.types";

const projects: Project[] = [
    {
        title: "Portfolio Website",
        description: "Next.js portfolio with Tailwind and framer-motion.",
        category: "Web Apps",
        repositoryUrl: "https://github.com/shantanusuthar/portfolio",
        livePreviewUrl: "https://shantanusuthar.vercel.app",
        image: "/images/portfolio.png",
    },
    {
        title: "API Service",
        description: "REST API for managing tasks with Node.js and Express.",
        category: "API",
        repositoryUrl: "https://github.com/shantanusuthar/api-service",
        image: "/images/api.png",
    },
    // more projects...
];

const categories = ["All", "Web Apps", "API", "UI/UX"];

export function Projects() {
    const [selected, setSelected] = useState("All");

    const filtered = selected === "All" ? projects : projects.filter(p => p.category === selected);

    return (
        <section id="projects" className="max-w-6xl mx-auto px-6 my-20">
            <h2 className="text-3xl font-semibold mb-8 text-center">Projects</h2>
            <div className="flex justify-center gap-6 mb-12">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelected(cat)}
                        className={`px-4 py-2 rounded-md ${selected === cat ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {filtered.map(({ title, description, github, demo, image }) => (
                    <div key={title} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
                        <Image src={image} alt={`${title} screenshot`} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-semibold text-xl mb-2">{title}</h3>
                            <p className="text-muted-foreground mb-4">{description}</p>
                            <div className="flex gap-4">
                                <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                    GitHub
                                </a>
                                {demo && (
                                    <a href={demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
