"use client"

export function Greenhouse({ size = 160}: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
            {/* Foundation */}
            <rect
                x={size * 0.1}
                y={size * 0.75}
                width={size * 0.8}
                height={size * 0.15}
                fill="#8B7355"
                stroke="#654321"
                strokeWidth="2"
            />

            {/* Body */}
            <rect
                x={size * 0.12}
                y={size * 0.25}
                width={size * 0.76}
                height={size * 0.5}
                fill="#90EE90"
                opacity="0.25"
                stroke="#228B22"
                strokeWidth="2.5"
            />

            {/* Roof */}
            <polygon
                points={`${size * 0.12},${size * 0.25} ${size * 0.88},${size * 0.25} ${size * 0.5},${size * 0.05}`}
                fill="#90EE90"
                opacity="0.3"
                stroke="#228B22"
                strokeWidth="2.5"
            />

            {/* Roof ridge */}
            <line x1={size * 0.5} y1={size * 0.05} x2={size * 0.5} y2={size * 0.25} stroke="#228B22" strokeWidth="1.5" />

            {/* Window grid */}
            {[0, 1, 2, 3, 4].map((col) =>
                [0, 1, 2].map((row) => (
                <g key={`window-${col}-${row}`}>
                    {/* Window pane */}
                    <rect
                    x={size * 0.18 + col * size * 0.14}
                    y={size * 0.32 + row * size * 0.12}
                    width={size * 0.11}
                    height={size * 0.1}
                    fill="#E0F7FF"
                    opacity="0.6"
                    stroke="#228B22"
                    strokeWidth="1.2"
                    />
                    {/* Window cross divider */}
                    <line
                    x1={size * 0.235 + col * size * 0.14}
                    y1={size * 0.32 + row * size * 0.12}
                    x2={size * 0.235 + col * size * 0.14}
                    y2={size * 0.42 + row * size * 0.12}
                    stroke="#228B22"
                    strokeWidth="0.8"
                    opacity="0.5"
                    />
                    <line
                    x1={size * 0.18 + col * size * 0.14}
                    y1={size * 0.37 + row * size * 0.12}
                    x2={size * 0.29 + col * size * 0.14}
                    y2={size * 0.37 + row * size * 0.12}
                    stroke="#228B22"
                    strokeWidth="0.8"
                    opacity="0.5"
                    />
                </g>
                )),
            )}

            {/* Door */}
            <rect
                x={size * 0.35}
                y={size * 0.6}
                width={size * 0.3}
                height={size * 0.25}
                fill="#8B4513"
                stroke="#654321"
                strokeWidth="1.5"
            />

            {/* Door handle */}
            <circle cx={size * 0.6} cy={size * 0.72} r={size * 0.03} fill="#FFD700" stroke="#DAA520" strokeWidth="1" />

            {/* Door frame detail */}
            <line x1={size * 0.5} y1={size * 0.6} x2={size * 0.5} y2={size * 0.85} stroke="#654321" strokeWidth="1" />

            {/* Interior plants - larger */}
            {[0.28, 0.5, 0.72].map((x) => (
                <g key={`plant-${x}`}>
                {/* Pot */}
                <polygon
                    points={`${size * x},${size * 0.62} ${size * (x - 0.05)},${size * 0.68} ${size * (x + 0.05)},${size * 0.68}`}
                    fill="#8B6F47"
                    stroke="#654321"
                    strokeWidth="1"
                />
                {/* Stem */}
                <line x1={size * x} y1={size * 0.62} x2={size * x} y2={size * 0.42} stroke="#228B22" strokeWidth="1.5" />
                {/* Leaves */}
                <ellipse
                    cx={size * (x - 0.04)}
                    cy={size * 0.5}
                    rx={size * 0.04}
                    ry={size * 0.08}
                    fill="#32CD32"
                    transform={`rotate(-30 ${size * (x - 0.04)} ${size * 0.5})`}
                />
                <ellipse
                    cx={size * (x + 0.04)}
                    cy={size * 0.48}
                    rx={size * 0.04}
                    ry={size * 0.08}
                    fill="#32CD32"
                    transform={`rotate(30 ${size * (x + 0.04)} ${size * 0.48})`}
                />
                {/* Top leaf */}
                <circle cx={size * x} cy={size * 0.38} r={size * 0.05} fill="#228B22" />
                </g>
            ))}

            {/* Glass shine effect */}
            <rect x={size * 0.14} y={size * 0.27} width={size * 0.72} height={size * 0.04} fill="white" opacity="0.15" />
        </svg>
    );
};