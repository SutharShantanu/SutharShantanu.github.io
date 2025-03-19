import dotenv from "dotenv";
import { NextResponse } from "next/server";

dotenv.config();
export const dynamic = "force-dynamic";

export async function GET() {
  const { RAPIDAPI_KEY, RAPIDAPI_HOST, INSTAGRAM_USERNAME } = process.env;

  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST || !INSTAGRAM_USERNAME) {
    console.error("Missing Instagram credentials");
    return NextResponse.json(
      { error: "Missing Instagram credentials" },
      { status: 500 }
    );
  }

  console.log(`api called`)

  const fetchInstagramData = async (usernameOrId) => {
    const url = `https://${RAPIDAPI_HOST}/v1/user_posts?username_or_id=${usernameOrId}&count=12`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram media for ${usernameOrId}`);
    }
    return response.json();
  };

  try {
    let data = await fetchInstagramData(INSTAGRAM_USERNAME);

    if (!data.items || data.items.length === 0) {
      console.warn("No posts found for username. Trying with user ID...");
      const userId = data.user?.id;
      if (userId) {
        data = await fetchInstagramData(userId);
      } else {
        throw new Error("User ID not found. Cannot fetch posts.");
      }
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Instagram API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
