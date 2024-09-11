import React from "react";
import "ldrs/ring";
import { HashLoader, PuffLoader, ClimbingBoxLoader } from "react-spinners";

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
                    strokeWidth="2"
                    strokeMiterlimit="10"
                />
            </svg>

        </div>
    );
};

{/* <l-ring
                size="40"
                stroke="5"
                bg-opacity="0"
                speed="2"
                color="black"></l-ring> */}

export default CircularLoader;

export const MainLoader = () => {
    return (
        <div className="hash w-full bg-neutral-50">
            {/* <ClimbingBoxLoader color="rgba(38, 38, 38, 1)" size="30" /> */}
            {/* <PuffLoader color="rgba(38, 38, 38, 1)" size="150" /> */}
            <HashLoader color="rgba(38, 38, 38, 1)" size="80px" />
        </div>
    );
};
