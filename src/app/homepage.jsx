"use client";

import React from "react";

import { CardStack } from "@/Components/ui/card-stack";
const Homepage = () => {
    return (
        <section
            id="homepage"
            className="border min-h-screen sm:min-h-[87vh] box-border border-black w-[90%] w- 2xl:w-4/5 xl:w-5/6 m-auto mt-24 sm:p-8 rounded-lg shadow-sm">
            <div className="box-border h-[80vh] flex flex-col sm:flex-row justify-around items-center ">
                <div className="w-[90%] box-border sm:w-3/6 inline-block">
                    <h1 className="text-5xl sm:text-[11rem] text-center sm:text-left inline-block bg-gray-100 leading-normal">
                        Hey, I&apos;m
                    </h1>
                    <h1 className="text-5xl sm:text-[11rem] box-border w-min text-center sm:text-left  bg-gray-300 leading-relaxed">
                        Shantanu
                    </h1>
                </div>
                <div className="m-auto w-full sm:w-2/6 ">
                    <CardStack />
                </div>
            </div>
        </section>
    );
};

export default Homepage;
