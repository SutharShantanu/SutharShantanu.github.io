/**
 * Progressive blur (adapted from Magic UI "Progressive Blur").
 * Stacked backdrop-filter layers, each masked to its own band, so blur ramps up toward the edge.
 * Fewer layers than the original (5 vs 8): each is a full-width backdrop filter repainted while scrolling.
 */
import React from "react";

const LEVELS = [1, 2, 4, 8, 16];

export function ProgressiveBlur({
    position = "bottom",
    className = "",
    style,
}: {
    position?: "top" | "bottom";
    className?: string;
    style?: React.CSSProperties;
}) {
    const dir = position === "bottom" ? "to bottom" : "to top";
    const band = 100 / LEVELS.length;
    return (
        <div aria-hidden="true" className={`pointer-events-none ${className}`} style={style}>
            {LEVELS.map((blur, i) => {
                // Layer i fades in across its own band, then stays on: the first layer starts
                // fully transparent at the edge, so the blur ramps in with no visible seam.
                const from = i * band;
                const mid = (i + 1) * band;
                const mask = `linear-gradient(${dir}, transparent ${from}%, black ${mid}%, black 100%)`;
                return (
                    <div
                        key={blur}
                        className="absolute inset-0"
                        style={{ backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, maskImage: mask, WebkitMaskImage: mask }}
                    />
                );
            })}
        </div>
    );
}
