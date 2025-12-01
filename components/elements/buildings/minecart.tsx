"use client"

import { useEffect, useState } from "react";

interface MinecartProps {
    size?: number;
    isMoving?: boolean;
};

// ++ smooth animation that reverses direction
export function Minecart({ size = 40, isMoving = true}: MinecartProps) {
    const [position, setPosition] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);

    // Moving mechanic
    useEffect(() => {
        if (!isMoving) {
            return;
        };

        const interval = setInterval(() => {
            setPosition((prev) => {
                let newPos = prev + direction * 0.8;
                if (newPos >= 100) {
                    newPos = 100;
                    setDirection(-1);
                } else if (newPos <= 0) {
                    newPos = 0;
                    setDirection(1);
                };

                return newPos;
            });
        }, 40);

        return () => clearInterval(interval);
    }, [isMoving, direction]);

    return (
        <svg
            width={size}
            height={size * 0.7}
            viewBox={`0 0 ${size} ${size * 0.7}`}
            className="block"
            style={{
                position: "absolute",
                left: `${position}%`,
                transition: "none",
                transform: direction === -1 ? "scaleX(-1)" : "scaleX(1)",
            }}
            >
            {/* Cart body */}
            <rect
                x={size * 0.1}
                y={size * 0.15}
                width={size * 0.8}
                height={size * 0.4}
                fill="#CD5C5C"
                stroke="#8B3A3A"
                strokeWidth="1.5"
                rx="3"
            />

            {/* Cart interior detail */}
            <rect x={size * 0.15} y={size * 0.2} width={size * 0.7} height={size * 0.25} fill="#E8A8A8" opacity="0.6" />

            {/* Wheels */}
            <circle cx={size * 0.25} cy={size * 0.62} r={size * 0.1} fill="#1a1a1a" stroke="#000" strokeWidth="1" />
            <circle cx={size * 0.75} cy={size * 0.62} r={size * 0.1} fill="#1a1a1a" stroke="#000" strokeWidth="1" />

            {/* Wheel hubs */}
            <circle cx={size * 0.25} cy={size * 0.62} r={size * 0.045} fill="none" stroke="#666" strokeWidth="0.8" />
            <circle cx={size * 0.75} cy={size * 0.62} r={size * 0.045} fill="none" stroke="#666" strokeWidth="0.8" />

            {/* Wheel spokes */}
            {[0, 90, 180, 270].map((angle) => {
                const rad = (angle * Math.PI) / 180
                return (
                <line
                    key={`spoke-1-${angle}`}
                    x1={size * 0.25 + Math.cos(rad) * size * 0.04}
                    y1={size * 0.62 + Math.sin(rad) * size * 0.04}
                    x2={size * 0.25 + Math.cos(rad) * size * 0.08}
                    y2={size * 0.62 + Math.sin(rad) * size * 0.08}
                    stroke="#888"
                    strokeWidth="0.6"
                />
                )
            })}
        </svg>
    );
};