/**
 * Same-origin proxy for the résumé PDF (source of truth stays on Google Drive).
 * Browsers can't reliably fetch Drive cross-origin, so the PDF viewer loads this instead.
 *
 *   GET /api/resume             → inline (for the viewer)
 *   GET /api/resume?download=1  → attachment
 */
import { NextRequest, NextResponse } from "next/server";
import { RESUME_PDF_URL } from "@/components/sections/constants/social.constant";

export const revalidate = 86400; // re-pull from Drive at most once a day

export async function GET(request: NextRequest) {
    const upstream = await fetch(RESUME_PDF_URL, { next: { revalidate: 86400, tags: ["resume"] } }).catch(() => null);
    if (!upstream?.ok) {
        return NextResponse.json({ error: "Résumé temporarily unavailable" }, { status: 502 });
    }

    const pdf = await upstream.arrayBuffer();
    // Guard against Drive returning an HTML interstitial instead of the file.
    if (new TextDecoder().decode(pdf.slice(0, 5)) !== "%PDF-") {
        return NextResponse.json({ error: "Résumé temporarily unavailable" }, { status: 502 });
    }

    const download = request.nextUrl.searchParams.has("download");
    return new NextResponse(pdf, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `${download ? "attachment" : "inline"}; filename="Shantanu-Suthar-Resume.pdf"`,
            "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        },
    });
}
