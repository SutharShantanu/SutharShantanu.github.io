import { useState, useEffect } from "react";
import axios from "axios";

const GithubFetch = () => {
    const [userData, setUserData] = useState(null);
    const [repoData, setRepoData] = useState(null);
    const [specificRepoData, setSpecificRepoData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/github');
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setUserData(result.userData);
                setRepoData(result.repoData);
                setSpecificRepoData(result.specificRepoData);
                setError(null);
            } catch (error) {
                setError(error.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { userData, repoData, specificRepoData, error, loading };
};

export default GithubFetch;
