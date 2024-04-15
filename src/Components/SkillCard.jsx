import React from "react";
import Image from "next/image";

const SkillCard = ({ card }) => {
    return (
        <div className="p-4 rounded-xl cursor-pointer shadow-sm dark:bg-neutral-900 dark:hover:bg-neutral-800  transition-all">
            <div className="flex justify-between items-center space-x-1">
                <span
                    className="inline-block border border-green-200 dark:border-green-400
                    bg-green-100 dark:bg-green-900 rounded-lg text-green-500 text-xs sm:text-sm font-normal me-2 px-2.5 py-0.5 dark:text-green-300">
                    {card.category}
                </span>
                <span className="font-medium">{card.title}</span>
            </div>
            <div className="mt-2 flex justify-center items-center h-28">
                <Image
                    width={100}
                    height={100}
                    // layout="fill"
                    objectFit="cover"
                    src={card.imageUrl}
                    alt={card.title}
                />
            </div>
        </div>
    );
};

export default SkillCard;
