import { useState, useEffect, useRef } from "react";

const GithubFetch = () => {
    const [userData, setUserData] = useState(null);
    const [repoData, setRepoData] = useState(null);
    const [specificRepoData, setSpecificRepoData] = useState(null);
    const [error, setError] = useState(null);
    const retryIntervalId = useRef(null);

    const fetchData = async () => {
        console.log("GithubFetch called !");
        setError(null);
        try {
            const response = await fetch("/api/github");
            const data = await response.json();
            if (response.status === 200) {
                setUserData(data.userData);
                setRepoData(data.repoData);
                setSpecificRepoData(data.specificRepoData);
                clearInterval(retryIntervalId.current); // Data fetched successfully, stop retrying
            } else {
                setError(data.error);
                throw new Error(data.error || "An error occurred.");
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
            setError(error.message);
        }
    };

    useEffect(() => {
        // Retry fetch every 3 seconds
        retryIntervalId.current = setInterval(() => {
            if (!userData || !repoData || (repoData && specificRepoData === null)) {
                fetchData();
            } else {
                clearInterval(retryIntervalId.current); // Stop retrying if data is fetched
            }
        }, 3000);

        // Cleanup function to clear the interval when the component unmounts
        return () => {
            clearInterval(retryIntervalId.current);
        };
    }, [userData, repoData, specificRepoData]);

    return { userData, repoData, specificRepoData, error };
};

export default GithubFetch;
