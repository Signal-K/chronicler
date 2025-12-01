"use client"

import type React from "react";

interface BlockProps {
    size?: number;
    color?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export function Block({
    size = 40,
    color = "#8BC34A",
    children,
    className = "",
    style = {}
}: BlockProps) {
    return (
        <div
            className={`relative ${className}`}
            style={{
                width: size,
                height: size,
                ...style,
            }}
        >  
            {children}
        </div>
    );
};

interface SVGBlockProps extends BlockProps {
    viewBox?: string;
};

export function SVGBlock({
    size = 40,
    color = '#8BC34A',
    viewBox = '0 0 40 40',
    children,
    className = " ",
}: SVGBlockProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox={viewBox}
            className={`block ${className}`}
            style={{ "--block-color": color } as React.CSSProperties}
        >
            {children}
        </svg>
    )
}