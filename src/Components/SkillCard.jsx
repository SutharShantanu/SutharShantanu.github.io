import React from "react";
import Image from "next/image";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";

const SkillCard = ({ card }) => {
  return (
    <motion.div
      className="p-4 rounded-xl cursor-pointer shadow-xs bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-around items-center space-x-1 mb-2 sm:mb-0">
        <Badge
          className="inline-block border border-green-200 dark:border-green-400 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded-lg text-green-500 text-xs sm:text-sm font-normal sm:me-2 m-auto sm:m-0 px-2.5 py-0.5"
          variant="outline"
        >
          {card.category}
        </Badge>
        <Badge className="hidden sm:inline-block md:hidden font-medium overflow-hidden whitespace-nowrap text-ellipsis">
          {card.title}
        </Badge>
      </div>
      <div className="sm:mt-2 flex justify-center items-center h-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            width={100}
            height={100}
            objectFit="cover"
            src={card.imageUrl}
            alt={card.title}
          />
        </motion.div>
      </div>
      <Badge className="sm:hidden block md:block font-medium overflow-hidden whitespace-nowrap text-ellipsis text-center mx-auto mt-2 w-fit dark:bg-neutral-100 dark:text-neutral-900 bg-neutral-900 border-0 text-neutral-200">
        {card.title}
      </Badge>
    </motion.div>
  );
};

export default SkillCard;
