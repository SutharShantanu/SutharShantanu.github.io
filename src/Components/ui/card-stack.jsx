import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import A from "../../../public/A.jpg";
import B from "../../../public/B.jpg";
import C from "../../../public/C.jpg";
import D from "../../../public/D.jpg";

let interval;
const items = [
    {
        id: 0,
        image: A,
        key: "A",
    },
    {
        id: 1,
        image: B,
        key: "B",
    },
    {
        id: 2,
        image: C,
        key: "C",
    },
    {
        id: 3,
        image: D,
        key: "D",
    },
];

export const CardStack = () => {
    const [cards, setCards] = useState(items);
    const isMobile = useMediaQuery({
        query: `(min-width: 768px)`,
    });

    useEffect(() => {
        startFlipping();
    }, []);

    const startFlipping = () => {
        interval = setInterval(() => {
            setCards((prevCards) => {
                const newArray = [...prevCards];
                newArray.unshift(newArray.pop());
                return newArray;
            });
        }, 3000);

        return () => clearInterval(interval);
    };

    return (
        <div className="relative sm:h-80 sm:w-60 border border-orange-600 h-60 w-full">
            {cards.map((card, index) => (
                <motion.div
                    key={card.key}
                    className={`absolute dark:bg-black bg-white h-48 w-48 sm:h-96 sm:w-96
         rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between transition-all
         `}
                    //  ${
                    //      index > 0 ? "blur-sm" : ""
                    //  }
                    //  hover:blur-none
                    style={{
                        transformOrigin: "top center",
                    }}
                    animate={{
                        left: isMobile ? index * 70 : index * 30,
                        top: isMobile ? index * -30 : 0,
                        rotateY: isMobile ? index * -5 : index * -2,
                        translateZ: isMobile ? index * -50 : index * -50,
                        zIndex: cards.length - index,
                    }}
                    // animate={{
                    //     left: index * 70,
                    //     top: index * -30,
                    //     rotateY: index * -5,
                    //     translateZ: index * -50,
                    //     zIndex: cards.length - index,
                    // }}
                >
                    <Image
                        src={card.image}
                        alt={`image-${card.id}`}
                        className="w-full h-3/4 object-cover rounded-3xl"
                        layout="fill"
                    />
                </motion.div>
            ))}
        </div>
    );
};
