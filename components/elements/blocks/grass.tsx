"use client"

import { SVGBlock } from "./block";

interface GrassBlockProps {
    size?: number;
    shadeIndex?: 0 | 1 | 2;
    className?: string;
};

const GRASS_SHADES = {
    0: "#7DC850",
    1:  "#6BA842",
    2: "#5A9236",
};

// Grass blocks that tile/piece together. Terrain depth enabled through the shade variants
export function GrassBlock({
    size = 40,
    shadeIndex = 0,
    className = " "
}: GrassBlockProps) {
    const color = GRASS_SHADES[shadeIndex];

    return (
        <SVGBlock size={size} color={color} className={`grass-block ${className}`}>
            {/* Grass top surface */}
            <path d={`M 0 ${size * 0.6} L ${size} ${size * 0.6} L ${size} ${size} L 0 ${size} Z`} fill={color} />

            {/* Darker grass shading */}
            <path
                d={`M 0 ${size * 0.65} Q ${size * 0.5} ${size * 0.62} ${size} ${size * 0.65} L ${size} ${size} L 0 ${size} Z`}
                fill={`${color}99`}
                opacity="0.6"
            />

            {/* Grass texture strokes */}
            <line
                x1={size * 0.15}
                y1={size * 0.55}
                x2={size * 0.15}
                y2={size * 0.8}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="0.5"
            />
            <line
                x1={size * 0.5}
                y1={size * 0.55}
                x2={size * 0.5}
                y2={size * 0.8}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="0.5"
            />
            <line
                x1={size * 0.85}
                y1={size * 0.55}
                x2={size * 0.85}
                y2={size * 0.8}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="0.5"
            />

            {/* Soil/dirt base */}
            <rect x="0" y={size} width={size} height={size * 0.2} fill="#8B7355" />
        </SVGBlock>
    );
};