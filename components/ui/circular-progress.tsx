"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";

import { cn } from "@/lib/utils";
import AnimatedNumber from "./animated-number";

interface CircularProgressProps {
  value: number;
  renderLabel?: (progress: number) => number | string;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: "square" | "round";
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
}

const CircularProgress = ({
  value,
  // renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel,
  shape = "round",
  size = 100,
  strokeWidth,
  circleStrokeWidth = 5,
  progressStrokeWidth = 5,
}: CircularProgressProps) => {
  const radius = size / 2 - 10;
  const circumference = Math.ceil(3.14 * radius * 2);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 20, stiffness: 120 });
  const strokeDashoffset = useTransform(
    springValue,
    (latest) => circumference * ((100 - latest) / 100)
  );

  React.useEffect(() => {
    animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
  }, [value, motionValue]);

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox={`-${size * 0.125} -${size * 0.125} ${size * 1.25} ${size * 1.25}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(-90deg)" }}
        className="relative"
      >
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={0}
          className={cn("stroke-primary/25", className)}
        />

        <motion.circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeLinecap={shape}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          className={cn("stroke-primary", progressClassName)}
        />
      </svg>

      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center text-xs select-none",
            labelClassName
          )}
        >
          <AnimatedNumber value={value} isPercentage />
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
