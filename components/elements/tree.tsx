"use client"

export function Tree({ size = 140 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
            {/* Trunk - larger with detail */}
            <rect
                x={size * 0.4}
                y={size * 0.5}
                width={size * 0.2}
                height={size * 0.45}
                fill="#8B4513"
                stroke="#654321"
                strokeWidth="1.5"
            />

            {/* Trunk highlight - left side light */}
            <rect x={size * 0.4} y={size * 0.5} width={size * 0.08} height={size * 0.45} fill="#A0522D" opacity="0.7" />

            {/* Trunk shadow - right side dark */}
            <rect x={size * 0.52} y={size * 0.5} width={size * 0.08} height={size * 0.45} fill="#5C2E0A" opacity="0.5" />

            {/* Root detail at base */}
            {[-0.08, 0.08].map((offset) => (
                <path
                key={`root-${offset}`}
                d={`M ${size * (0.5 + offset)} ${size * 0.95} Q ${size * (0.48 + offset)} ${size * 1.0} ${size * (0.46 + offset)} ${size * 0.98}`}
                stroke="#654321"
                strokeWidth="1.5"
                fill="none"
                />
            ))}

            {/* Foliage - 4 layers for fullness and depth */}

            {/* Bottom-back layer - darkest, widest */}
            <circle
                cx={size * 0.5}
                cy={size * 0.5}
                r={size * 0.26}
                fill="#1a6b1a"
                stroke="#0d3d0d"
                strokeWidth="1"
                opacity="0.9"
            />

            {/* Middle-back layer */}
            <circle cx={size * 0.5} cy={size * 0.35} r={size * 0.24} fill="#228B22" stroke="#1a6b1a" strokeWidth="1" />

            {/* Side layers - left and right */}
            <circle cx={size * 0.32} cy={size * 0.4} r={size * 0.22} fill="#32CD32" stroke="#228B22" strokeWidth="1" />

            <circle cx={size * 0.68} cy={size * 0.4} r={size * 0.22} fill="#32CD32" stroke="#228B22" strokeWidth="1" />

            {/* Top layer - lightest, fullest */}
            <circle cx={size * 0.5} cy={size * 0.25} r={size * 0.23} fill="#3CB371" stroke="#228B22" strokeWidth="1" />

            {/* Top accent - bright light green */}
            <circle cx={size * 0.5} cy={size * 0.2} r={size * 0.15} fill="#7CFC00" opacity="0.4" />

            {/* Foliage shadow detail - depth */}
            <ellipse cx={size * 0.45} cy={size * 0.45} rx={size * 0.12} ry={size * 0.15} fill="#0d3d0d" opacity="0.3" />
        </svg>
    );
};