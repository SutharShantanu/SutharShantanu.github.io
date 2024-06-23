import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

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
    console.log("backend API called !");
        const userResponse = await fetch(
            `https://api.github.com/users/${username}`,
            {
                headers: {
                    Authorization: `token ${token}`,
                },
            }
        );

        if (!userResponse.ok) {
            throw new Error(
                `Error fetching user data: ${userResponse.statusText}`
            );
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

        if (!repoResponse.ok) {
            throw new Error(`Error fetching repos: ${repoResponse.statusText}`);
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
                throw new Error(
                    `Error fetching specific repo: ${specificRepoResponse.statusText}`
                );
            }

            specificRepoData = await specificRepoResponse.json();
        }
        console.log(`This console is from route.js`);
        return NextResponse.json(
            { userData, repoData, specificRepoData },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
