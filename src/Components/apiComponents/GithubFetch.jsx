import { useState, useEffect } from "react";
import axios from "axios";

const GithubFetch = () => {
    const username = process.env.NEXT_PUBLIC_Username;
    const token = process.env.NEXT_PUBLIC_Token;
    const repoName = process.env.NEXT_PUBLIC_REPONAME;
    const [userData, setUserData] = useState(null);
    const [repoData, setRepoData] = useState(null);
    const [specificRepoData, setSpecificRepoData] = useState(null);
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

                if (repoName) {
                    const specificRepoResponse = await axios.get(
                        `https://api.github.com/repos/${username}/${repoName}`,
                        {
                            headers: {
                                Authorization: `token ${token}`,
                            },
                        }
                    );
                    setSpecificRepoData(specificRepoResponse.data);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        if ((username, token)) {
            fetchData();
        }
    }, [username, token, repoName]);

    return userData && repoData && specificRepoData
        ? { userData, repoData, specificRepoData }
        : error;
};

export default GithubFetch;
