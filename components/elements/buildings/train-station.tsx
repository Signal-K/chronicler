"use client"

export function TrainStation({ size = 180 }: { size?: number }) {
    const baseX = 0;
    const baseY = 0;

    return (
        <svg width={size} height={size * 1.1} viewBox={`0 0 ${size} ${size * 1.1}`} className="block">
            {/* Platform base */}
            <rect x="0" y={size * 0.65} width={size} height={size * 0.45} fill="#9B8B7E" stroke="#6B5B4F" strokeWidth="2" />

            {/* Platform edge detail */}
            <line x1="0" y1={size * 0.65} x2={size} y2={size * 0.65} stroke="#6B5B4F" strokeWidth="1.5" />

            {/* Platform boards */}
            {[0, 0.25, 0.5, 0.75].map((offset) => (
                <line
                key={`board-${offset}`}
                x1={size * offset}
                y1={size * 0.65}
                x2={size * offset}
                y2={size * 1.1}
                stroke="#6B5B4F"
                strokeWidth="1.5"
                opacity="0.4"
                />
            ))}

            {/* Left pillar */}
            <rect
                x={size * 0.1}
                y={size * 0.2}
                width={size * 0.12}
                height={size * 0.45}
                fill="#8B6F47"
                stroke="#654321"
                strokeWidth="1.5"
            />

            {/* Right pillar */}
            <rect
                x={size * 0.78}
                y={size * 0.2}
                width={size * 0.12}
                height={size * 0.45}
                fill="#8B6F47"
                stroke="#654321"
                strokeWidth="1.5"
            />

            {/* Main roof structure */}
            <polygon
                points={`${size * 0.08},${size * 0.2} ${size * 0.92},${size * 0.2} ${size * 0.9},${size * 0.05} ${size * 0.1},${size * 0.05}`}
                fill="#A0522D"
                stroke="#654321"
                strokeWidth="2"
            />

            {/* Roof detail - horizontal beams */}
            {[0.1, 0.35, 0.6].map((offset) => (
                <line
                key={`roof-beam-${offset}`}
                x1={size * 0.1}
                y1={size * (0.2 - offset * 0.08)}
                x2={size * 0.9}
                y2={size * (0.2 - offset * 0.08)}
                stroke="#8B6F47"
                strokeWidth="1"
                opacity="0.5"
                />
            ))}

            {/* Shelter side panels - left */}
            <rect
                x={size * 0.08}
                y={size * 0.15}
                width={size * 0.08}
                height={size * 0.5}
                fill="#A0826D"
                opacity="0.4"
                stroke="#654321"
                strokeWidth="1"
            />

            {/* Shelter side panels - right */}
            <rect
                x={size * 0.84}
                y={size * 0.15}
                width={size * 0.08}
                height={size * 0.5}
                fill="#A0826D"
                opacity="0.4"
                stroke="#654321"
                strokeWidth="1"
            />

            {/* Window opening - shelter interior */}
            <rect
                x={size * 0.25}
                y={size * 0.25}
                width={size * 0.5}
                height={size * 0.3}
                fill="none"
                stroke="#654321"
                strokeWidth="2"
            />

            {/* Window panes */}
            <line x1={size * 0.5} y1={size * 0.25} x2={size * 0.5} y2={size * 0.55} stroke="#654321" strokeWidth="1" />
            <line x1={size * 0.25} y1={size * 0.4} x2={size * 0.75} y2={size * 0.4} stroke="#654321" strokeWidth="1" />

            {/* Support beams under roof */}
            {[0.25, 0.5, 0.75].map((offset) => (
                <line
                key={`support-${offset}`}
                x1={size * offset}
                y1={size * 0.2}
                x2={size * offset}
                y2={size * 0.65}
                stroke="#8B6F47"
                strokeWidth="1.2"
                opacity="0.3"
                />
            ))}

            {/* Decorative roof accent */}
            <polygon
                points={`${size * 0.5},${size * 0.02} ${size * 0.55},${size * 0.08} ${size * 0.45},${size * 0.08}`}
                fill="#654321"
                opacity="0.6"
            />
        </svg>
    );
};