"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

const seededValue = (index: number, seed: number) => {
  const value = Math.sin((index + 1) * 127.1 + seed * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => (
  <>
    {Array.from({ length: Math.max(0, number) }, (_, index) => {
      const delay = minDelay + seededValue(index, 1) * (maxDelay - minDelay);
      const duration = minDuration + seededValue(index, 2) * (maxDuration - minDuration);
      const style = {
        "--angle": `${-angle}deg`,
        top: "-5%",
        left: `${seededValue(index, 3) * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      } as CSSProperties;

      return (
        <span
          key={index}
          style={style}
          className={cn(
            "pointer-events-none absolute size-0.5 rotate-(--angle) animate-meteor rounded-full bg-zinc-500 shadow-[0_0_0_1px_#ffffff10]",
            className,
          )}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-linear-to-r from-zinc-500 to-transparent" />
        </span>
      );
    })}
  </>
);
