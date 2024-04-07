"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const GithubFetch = () => {
    const username = process.env.NEXT_PUBLIC_Username;
    const token = process.env.NEXT_PUBLIC_Token;
    const [userData, setUserData] = useState(null);
    const [repoData, setRepoData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const userResponse = await axios.get(
                    `https://api.github.com/users/${username}`,
                    {
                        headers: {
                            Authorization: `token ${token}`,
                        },
                    }
                );
                setUserData(userResponse.data);

                const repoResponse = await axios.get(
                    `https://api.github.com/users/${username}/repos`,
                    {
                        headers: {
                            Authorization: `token ${token}`,
                        },
                    }
                );
                setRepoData(repoResponse.data);
            } catch (error) {
                setError(error.message);
            }
        };

        if ((username, token)) {
            fetchData();
        }
    }, [username, token]);

    return userData && repoData ? { userData, repoData } : error;
};

export default GithubFetch;
