import { useState, useEffect } from "react";

const GithubFetch = () => {
    const [userData, setUserData] = useState(null);
    const [repoData, setRepoData] = useState(null);
    const [specificRepoData, setSpecificRepoData] = useState(null);
    const [error, setError] = useState(null);

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
            } else {
                setError(data.error);
                throw new Error(data.error || "An error occurred.");
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
            setError(error.message);
        }
    };

    fetchData();

    return { userData, repoData, specificRepoData, error };
};

export default GithubFetch;
