import dotenv from "dotenv";
import { NextResponse } from "next/server";

dotenv.config();

export async function GET() {
  const { RAPIDAPI_KEY, RAPIDAPI_HOST, INSTAGRAM_USERNAME } = process.env;

  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST || !INSTAGRAM_USERNAME) {
    return NextResponse.json(
      { error: "Missing Instagram credentials" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/v1/user_posts?username_or_id=${INSTAGRAM_USERNAME}&count=12`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram media");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Instagram API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
