import { NextResponse } from "next/server";
import { LINKEDIN_USERNAME, NEXT_GITHUB_USERNAME } from "@/components/sections/constants/social.constant";
import { PROJECTS } from "@/components/sections/constants/featured-projects.constant";
import { SKILLS } from "@/components/sections/constants/skills.constant";
import { EMAIL, RESUME_URL } from "@/components/sections/constants/social.constant";
import { getPortfolioData } from "@/lib/portfolio-data";

// Same data the site renders, as JSON for the Android app (apps/android).
// Underlying fetchers are cached (lib/cached-fetchers.ts); this response is cached 30 min at the edge.
export const revalidate = 1800;

export async function GET() {
    const data = await getPortfolioData(
        process.env.NEXT_GITHUB_USERNAME ?? NEXT_GITHUB_USERNAME,
        process.env.LINKEDIN_USERNAME ?? LINKEDIN_USERNAME
    );
    return NextResponse.json({ ...data, projects: PROJECTS, skills: SKILLS, email: EMAIL, resumeUrl: RESUME_URL }, {
        headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" },
    });
}
