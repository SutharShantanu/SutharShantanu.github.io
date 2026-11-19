/**
 * On-demand cache revalidation endpoint.
 *
 * Usage:
 *   GET /api/revalidate?secret=YOUR_SECRET&tag=linkedin
 *   GET /api/revalidate?secret=YOUR_SECRET&tag=github
 *   GET /api/revalidate?secret=YOUR_SECRET&tag=all
 *
 * Protected by REVALIDATION_SECRET env variable.
 * Triggered manually via GitHub Action or browser.
 */

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

const safeEqual = (a: string, b: string) => {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && timingSafeEqual(x, y);
};

export async function GET(request: NextRequest) {
    // Prefer the header so the secret stays out of URLs/access logs; query param kept for the existing GitHub Action.
    const secret = request.headers.get("x-revalidate-secret") ?? request.nextUrl.searchParams.get("secret") ?? "";
    const tag = request.nextUrl.searchParams.get("tag");

    // Validate secret
    if (!process.env.REVALIDATION_SECRET) {
        return NextResponse.json(
            { error: "REVALIDATION_SECRET not configured on the server" },
            { status: 500 }
        );
    }

    if (!safeEqual(secret, process.env.REVALIDATION_SECRET)) {
        return NextResponse.json(
            { error: "Invalid secret" },
            { status: 401 }
        );
    }

    // Validate tag
    const validTags = ["linkedin", "github", "all"];
    if (!tag || !validTags.includes(tag)) {
        return NextResponse.json(
            {
                error: `Invalid tag. Use one of: ${validTags.join(", ")}`,
            },
            { status: 400 }
        );
    }

    // Revalidate
    const revalidatedTags: string[] = [];

    if (tag === "linkedin" || tag === "all") {
        revalidateTag("linkedin", { expire: 0 });
        revalidatedTags.push("linkedin");
    }

    if (tag === "github" || tag === "all") {
        revalidateTag("github", { expire: 0 });
        revalidatedTags.push("github");
    }

    console.log(
        `[Revalidate] Cache busted for tags: ${revalidatedTags.join(", ")} at ${new Date().toISOString()}`
    );

    return NextResponse.json({
        success: true,
        revalidated: revalidatedTags,
        timestamp: new Date().toISOString(),
    });
}
