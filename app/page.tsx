"use client";

import Hero from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Summary } from "@/components/sections/summary";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full -z-10 dark:bg-[radial-gradient(#262626_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] border border-red-500"
    >
      <motion.div className="dark:bg-neutral-950 max-w-[90vw] lg:max-w-5xl mx-auto">
        <Hero />
        <Summary />
        <Skills />
      </motion.div>
    </div>
  );
}
