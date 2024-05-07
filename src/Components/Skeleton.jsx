import React from "react";
import { Skeleton } from "./ui/skeleton";

const CardSkeleton = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:w-[49vw]">
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
        </div>
    );
};

export default CardSkeleton;
