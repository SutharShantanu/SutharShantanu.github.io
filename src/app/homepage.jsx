"use client";

import React from "react";

import { CardStack } from "@/Components/ui/card-stack";
import MobileCarousel from "@/Components/MobileCarousel";
import ImageA from "../../public/A.jpg";
import ImageB from "../../public/B.jpg";
import ImageC from "../../public/C.jpg";
import ImageD from "../../public/D.jpg";

const Homepage = () => {
    const OPTIONS = { loop: true };
    const SLIDES = [
        { id: 0, image: ImageA },
        { id: 1, image: ImageB },
        { id: 2, image: ImageC },
        { id: 3, image: ImageD },
    ];
    return (
        <section
            id="homepage"
            className="border min-h-[80vh] sm:min-h-[87vh] box-border dark:bg-neutral-900 dark:border-neutral-800 border-black w-[90%] 2xl:w-4/5 xl:w-5/6 m-auto mt-24 sm:p-8 rounded-lg shadow-sm">
            <div className="box-border h-[80vh] grid grid-cols-1 sm:grid-cols-2 justify-around items-center ">
                <div className="w-[85%] box-border sm:w-3/6 inline-block m-auto">
                    <h1 className="text-6xl sm:text-[11rem] text-center sm:text-left inline-block bg-neutral-100 dark:bg-neutral-800 dark:text-slate-200 leading-normal">
                        Hey, I&apos;m
                    </h1>
                    <h1 className="text-6xl sm:text-[11rem] box-border w-min text-center sm:text-left  bg-neutral-300 dark:bg-neutral-600  dark:text-slate-200 leading-relaxed">
                        Shantanu
                    </h1>
                </div>
                <div className="m-auto w-full sm:w-2/6">
                    <CardStack />
                    <MobileCarousel slides={SLIDES} options={OPTIONS} />
                </div>
            </div>
        </section>
    );
};

export default Homepage;
