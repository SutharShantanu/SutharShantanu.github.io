"use client";

import { motion } from "framer-motion";
import { Chip } from "@heroui/react";

const PRINCIPLES = ["Clarity over clutter", "Accessible by default", "Performance matters"];

export function Summary() {
  return (
    <section id="about" className="editorial-shell editorial-section grid gap-10 md:grid-cols-[0.75fr_1.25fr] md:gap-20">
      <div>
        <p className="editorial-kicker">01 / A little about me</p>
        <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-[-0.055em] md:text-5xl">
          Good work starts with <span className="font-serif italic text-primary">good questions.</span>
        </h2>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55 }}
        className="flex flex-col justify-between gap-8"
      >
        <div className="space-y-5 text-base leading-8 text-muted-foreground md:text-lg">
          <p>
            I’m a frontend-focused developer who enjoys turning complex ideas into
            clear, useful interfaces. My day-to-day work revolves around React,
            Next.js and TypeScript, with a strong interest in thoughtful design
            systems and maintainable architecture.
          </p>
          <p>
            From building product dashboards to refining everyday interactions,
            I aim to make software feel fast, accessible and considered — not just
            visually polished.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRINCIPLES.map((principle) => (
            <Chip key={principle} size="sm" variant="secondary" className="rounded-none border-border px-2">
              {principle}
            </Chip>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
