import dotenv from "dotenv";
import { NextResponse } from "next/server";

dotenv.config();

export async function GET(req) {
  const username = process.env.NEXT_PUBLIC_Username;
  const token = process.env.NEXT_PUBLIC_Token;
  const repoName = process.env.NEXT_PUBLIC_REPONAME;

  if (!username || !token) {
    return NextResponse.json(
      { error: "Username and token are required" },
      { status: 400 }
    );
  }

  try {
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    // Log status and response for debugging
    if (!userResponse.ok) {
      const errorMessage = `Error fetching user data: ${userResponse.status} ${userResponse.statusText}`;
      console.log(errorMessage); // Log the error with status
      const errorBody = await userResponse.text(); // Read the response body
      console.log(errorBody); // Log the response body for further insight
      throw new Error(errorMessage);
    }

    const userData = await userResponse.json();

    const repoResponse = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    // Log status for debugging
    if (!repoResponse.ok) {
      const errorMessage = `Error fetching repos: ${repoResponse.status} ${repoResponse.statusText}`;
      console.log(errorMessage); // Log the error with status
      const errorBody = await repoResponse.text();
      console.log(errorBody); // Log the response body
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const repoData = await repoResponse.json();

    let specificRepoData = null;
    if (repoName) {
      const specificRepoResponse = await fetch(
        `https://api.github.com/repos/${username}/${repoName}`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      if (!specificRepoResponse.ok) {
        const errorMessage = `Error fetching specific repo: ${specificRepoResponse.status} ${specificRepoResponse.statusText}`;
        console.log(errorMessage); // Log the error with status
        throw new Error(errorMessage);
      }

      specificRepoData = await specificRepoResponse.json();
    }

    return NextResponse.json(
      { userData, repoData, specificRepoData },
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // Log full error for debugging
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
