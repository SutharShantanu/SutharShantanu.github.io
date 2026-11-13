"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Download, Github, Linkedin } from "lucide-react";
import { Button, Chip } from "@heroui/react";
import AvatarImage from "@/public/AvatarImage.png";

const RESUME_URL = "https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13";

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="editorial-shell relative grid min-h-[calc(100svh-5rem)] items-center gap-12 overflow-hidden py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24"
    >
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <Chip size="sm" variant="soft" color="success">Available for opportunities</Chip>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
            Based in Gurugram, India
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <p className="editorial-kicker mb-5">Frontend developer · Portfolio 2026</p>
          <h1 className="max-w-4xl text-[clamp(3.4rem,8.8vw,7.8rem)] font-medium leading-[0.92] tracking-[-0.075em]">
            Thoughtful
            <br />
            interfaces.
            <br />
            <span className="font-serif font-normal italic tracking-[-0.065em] text-primary">
              Meaningful
            </span>
            <br />
            experiences.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            I’m Shantanu Suthar — a frontend developer building accessible,
            performant web experiences with React, Next.js and TypeScript.
            I care about the details that make digital products feel effortless.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Button onPress={scrollToProjects} variant="primary" className="h-12 rounded-none px-6 font-medium">
            Explore selected work <ArrowDownRight size={17} />
          </Button>
          <Button
            as="a"
            href={RESUME_URL}
            target="_self"
            variant="outline"
            className="h-12 rounded-none px-6 font-medium"
          >
            <Download size={16} /> Download résumé
          </Button>
        </motion.div>

        <div className="mt-12 flex items-center gap-5 border-t border-border pt-6">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Find me</span>
          <a className="inline-flex items-center gap-2 text-sm transition-colors hover:text-primary" href="https://github.com/SutharShantanu" target="_blank" rel="noreferrer">
            <Github size={16} /> GitHub <ArrowUpRight size={12} />
          </a>
          <a className="inline-flex items-center gap-2 text-sm transition-colors hover:text-primary" href="https://linkedin.com/in/shantanu-suthar" target="_blank" rel="noreferrer">
            <Linkedin size={16} /> LinkedIn <ArrowUpRight size={12} />
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.12 }}
        className="relative mx-auto flex w-full max-w-[27rem] items-center justify-center"
      >
        <div className="absolute inset-[8%] rounded-full border border-primary/15" />
        <div className="absolute inset-[17%] rounded-full border border-dashed border-border" />
        <div className="absolute right-[4%] top-[16%] h-2 w-2 rounded-full bg-primary" />
        <div className="absolute bottom-[18%] left-[5%] h-3 w-3 rounded-full border border-primary" />
        <div className="relative aspect-square w-full overflow-hidden rounded-full border border-border bg-secondary/50 p-5">
          <Image
            src={AvatarImage}
            alt="Illustrated avatar representing Shantanu Suthar"
            fill
            priority
            sizes="(max-width: 768px) 80vw, 420px"
            className="object-contain p-5 transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="absolute -bottom-2 right-0 border border-border bg-background px-4 py-3 shadow-sm">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">Currently focused on</p>
          <p className="mt-1 text-sm font-medium">React · Next.js · TypeScript</p>
        </div>
      </motion.div>
    </section>
  );
}
