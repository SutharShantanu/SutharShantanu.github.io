import React from "react";
import { HashLoader } from "react-spinners";

const CircularLoader = () => {
    return (
        <div class="loader m-auto">
            <svg class="circular" viewBox="25 25 50 50">
                <circle
                    class="path"
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    stroke-width="2"
                    stroke-miterlimit="10"
                />
            </svg>
        </div>
    );
};

export default CircularLoader;

export const MainLoader = () => {
    return (
        <div className="hash">
            <HashLoader color="rgba(38, 38, 38, 1)" />
        </div>
    );
};
