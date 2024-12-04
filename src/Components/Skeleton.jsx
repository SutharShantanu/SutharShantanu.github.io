import React from "react";
import { Skeleton } from "./ui/skeleton";

const CardSkeleton = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:w-[49vw]">
            {Array(4).fill().map((_, index) => (
                <Skeleton key={index} className="p-6 rounded-xl flex flex-col items-center gap-y-4">
                    <div className="w-28 h-8 rounded-full bg-stone-300 dark:bg-stone-700" />
                    <div className="w-20 h-20 rounded-full bg-stone-300 dark:bg-stone-700" />
                    <div className="w-24 h-6 rounded-full bg-stone-300 dark:bg-stone-700" />
                </Skeleton>
            ))}
        </div>
    );
};

export default CardSkeleton;