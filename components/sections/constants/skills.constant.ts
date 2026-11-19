// Skills shown on the Skills tab. Logos are local copies from theSVG (https://thesvg.org),
// licences: CC0-1.0 / MIT / brand-use (trademarks used only to name the technology).
export type SkillCategory = "Frontend" | "Backend" | "Deployment" | "Tools";

const logo = (slug: string) => `/brands/${slug}.svg`;

export const SKILLS: { title: string; category: SkillCategory; icon: string }[] = [
    { title: "HTML", category: "Frontend", icon: logo("html5") },
    { title: "CSS", category: "Frontend", icon: logo("css3") },
    { title: "JavaScript", category: "Frontend", icon: logo("javascript") },
    { title: "TypeScript", category: "Frontend", icon: logo("typescript") },
    { title: "React", category: "Frontend", icon: logo("react") },
    { title: "Next.js", category: "Frontend", icon: logo("nextjs") },
    { title: "Redux", category: "Frontend", icon: logo("redux") },
    { title: "TanStack Query", category: "Frontend", icon: logo("tanstack") },
    { title: "Tailwind CSS", category: "Frontend", icon: logo("tailwindcss") },
    { title: "HeroUI", category: "Frontend", icon: logo("heroui") },
    { title: "Chakra UI", category: "Frontend", icon: logo("chakra-ui") },
    { title: "Material UI", category: "Frontend", icon: logo("material-ui") },
    { title: "Mantine", category: "Frontend", icon: logo("mantine") },
    { title: "Bootstrap", category: "Frontend", icon: logo("bootstrap") },
    { title: "Framer Motion", category: "Frontend", icon: logo("framer") },
    { title: "Zod", category: "Frontend", icon: logo("zod") },
    { title: "JSON", category: "Frontend", icon: logo("json") },
    { title: "Node.js", category: "Backend", icon: logo("nodejs") },
    { title: "Express", category: "Backend", icon: logo("express") },
    { title: "MongoDB", category: "Backend", icon: logo("mongodb") },
    { title: "Vercel", category: "Deployment", icon: logo("vercel") },
    { title: "Netlify", category: "Deployment", icon: logo("netlify") },
    { title: "Render", category: "Deployment", icon: logo("render") },
    { title: "VS Code", category: "Tools", icon: logo("visual-studio-code") },
    { title: "Postman", category: "Tools", icon: logo("postman") },
    { title: "GitHub", category: "Tools", icon: logo("github") },
];
