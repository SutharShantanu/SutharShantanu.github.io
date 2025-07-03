"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Loading projects">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[360px] rounded-lg" />
            ))}
        </div>
    );
}
export default ProjectsSkeleton;