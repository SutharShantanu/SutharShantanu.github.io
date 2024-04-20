import React from "react";
import Image from "next/image";
import { Badge } from "@/Components/ui/badge";

const SkillCard = ({ card }) => {
    return (
        <div className="p-4 rounded-xl cursor-pointer shadow-sm dark:bg-neutral-900 dark:hover:bg-neutral-800 transition-all">
            <div className="flex flex-col sm:flex-row sm:justify-around items-center space-x-1 mb-2 sm:mb-0">
                <Badge
                    className="inline-block border border-green-200 dark:border-green-400 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded-lg text-green-500 text-xs sm:text-sm font-normal sm:me-2 m-auto sm:m-0 px-2.5 py-0.5 "
                    variant="outline">
                    {card.category}
                </Badge>
                <Badge className="hidden sm:inline-block font-medium overflow-hidden whitespace-nowrap text-ellipsis">
                    {card.title}
                </Badge>
            </div>
            <div className="sm:mt-2 flex justify-center items-center h-28">
                <Image
                    width={100}
                    height={100}
                    objectFit="cover"
                    src={card.imageUrl}
                    alt={card.title}
                />
            </div>
            <Badge className="sm:hidden block font-medium overflow-hidden whitespace-nowrap text-ellipsis text-center m-auto w-fit dark:bg-neutral-900 border-0 dark:text-neutral-200">
                {card.title}
            </Badge>
        </div>
    );
};

export default SkillCard;
