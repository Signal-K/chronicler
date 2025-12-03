"use client"

export function GrainSilo({
    size = 110,
    opacity = 0.9,
}: { size?: number; opacity?: number }) {
    return (
        <svg width={size} height={size * 1.3} viewBox={`0 0 ${size} ${size * 1.3}`} className="block" style={{ opacity }}>
            {/* Roof cone - top */}
            <polygon
                points={`${size * 0.5},${size * 0.08} ${size * 0.8},${size * 0.25} ${size * 0.2},${size * 0.25}`}
                fill="#A0826D"
                stroke="#8B6F47"
                strokeWidth="1.5"
            />

            {/* Silo body - cylinder top cap */}
            <ellipse
                cx={size * 0.5}
                cy={size * 0.25}
                rx={size * 0.38}
                ry={size * 0.12}
                fill="#D2B48C"
                stroke="#A0826D"
                strokeWidth="1.5"
            />

            {/* Silo body - main cylindrical section */}
            <rect
                x={size * 0.12}
                y={size * 0.25}
                width={size * 0.76}
                height={size * 0.7}
                fill="#C9A876"
                stroke="#A0826D"
                strokeWidth="1.5"
            />

            {/* Silo body - bottom cap */}
            <ellipse
                cx={size * 0.5}
                cy={size * 0.95}
                rx={size * 0.38}
                ry={size * 0.15}
                fill="#B89968"
                stroke="#8B6F47"
                strokeWidth="1.5"
            />

            {/* Center seam - vertical detail */}
            <line
                x1={size * 0.5}
                y1={size * 0.25}
                x2={size * 0.5}
                y2={size * 0.95}
                stroke="#8B6F47"
                strokeWidth="1.2"
                opacity="0.6"
            />

            {/* Horizontal bands - metal rings for depth */}
            {[0.35, 0.5, 0.65, 0.8].map((yOffset) => (
                <g key={`band-${yOffset}`}>
                <ellipse
                    cx={size * 0.5}
                    cy={size * yOffset}
                    rx={size * 0.38}
                    ry={size * 0.04}
                    fill="none"
                    stroke="#8B6F47"
                    strokeWidth="1"
                    opacity="0.4"
                />
                </g>
            ))}

            {/* Side panel detail - left */}
            <rect x={size * 0.12} y={size * 0.3} width={size * 0.06} height={size * 0.6} fill="#8B6F47" opacity="0.2" />

            {/* Side panel detail - right */}
            <rect x={size * 0.82} y={size * 0.3} width={size * 0.06} height={size * 0.6} fill="#8B6F47" opacity="0.2" />

            {/* Bottom spout - small conical extension */}
            <polygon
                points={`${size * 0.42},${size * 0.95} ${size * 0.58},${size * 0.95} ${size * 0.5},${size * 1.15}`}
                fill="#8B6F47"
                stroke="#654321"
                strokeWidth="1"
                opacity="0.7"
            />

            {/* Shine/highlight on silo */}
            <ellipse cx={size * 0.25} cy={size * 0.5} rx={size * 0.1} ry={size * 0.3} fill="white" opacity="0.08" />
        </svg>
    );
};