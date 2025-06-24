import { motion, MotionConfig } from "framer-motion";
import NumberFlow, { useCanAnimate } from "@number-flow/react";
import clsx from "clsx";

const MotionNumberFlow = motion.create(NumberFlow);

type AnimatedNumberProps = {
    value: number;
    isPercentage?: boolean;
    className?: string;
};

export default function AnimatedNumber({ value, isPercentage = false, className }: AnimatedNumberProps) {
    const canAnimate = useCanAnimate();

    return (
        <MotionConfig
            transition={{
                layout: canAnimate
                    ? { duration: 0.9, bounce: 0, type: "spring" }
                    : { duration: 0 },
            }}
        >
            <motion.span
                className={clsx(
                    "inline-flex items-center px-1 text-description font-description transition-all ease-in-out",
                    className
                )}
                layout
            >
                <MotionNumberFlow
                    value={isPercentage ? value / 100 : value}
                    className="text-neutral-800 dark:text-neutral-50"
                    format={
                        isPercentage
                            ? { style: "percent", maximumFractionDigits: 2 }
                            : { maximumFractionDigits: 2 }
                    }
                    style={{
                        "--number-flow-char-height": "0.85em",
                        "--number-flow-mask-height": "0.3em",
                    } as React.CSSProperties}
                    layout
                    layoutRoot
                />
            </motion.span>
        </MotionConfig>
    );
}