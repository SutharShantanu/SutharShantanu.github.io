import { useState, useEffect } from "react";

const GithubFetch = () => {
    const [userData, setUserData] = useState(null);
    const [repoData, setRepoData] = useState(null);
    const [specificRepoData, setSpecificRepoData] = useState(null);
    const [error, setError] = useState(null);
    const [retryIntervalId, setRetryIntervalId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);

            try {
                const response = await fetch("/api/github");
                const data = await response.json();
                if (response.status === 200) {
                    setUserData(data.userData);
                    setRepoData(data.repoData);
                    setSpecificRepoData(data.specificRepoData);
                    clearInterval(retryIntervalId); // Data fetched successfully, stop retrying
                } else {
                    throw new Error(data.error || "An error occurred.");
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
                setError(error.message);
            }
        };

        const intervalId = setInterval(() => {
            fetchData();
        }, 3000);

        setRetryIntervalId(intervalId);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return { userData, repoData, specificRepoData, error };
};

export default GithubFetch;
