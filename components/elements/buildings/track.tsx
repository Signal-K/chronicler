"use client"

interface TrackProps {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    strokeWidth?: number;
};

// Right now - connects train station and greenhouse
// Container for minecart animation
export function MinecartTrack({
    fromX,
    fromY,
    toX,
    toY,
    strokeWidth = 3,
}: TrackProps) {
    const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY, 2));
    const angle = Math.atan2(toY - fromY, toX - fromX);

    return (
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }} className="pointer-events-none">
            {/* Main rails */}
            <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="#8B4513" strokeWidth={strokeWidth * 0.6} />
            <line x1={fromX} y1={fromY + 8} x2={toX} y2={toY + 8} stroke="#8B4513" strokeWidth={strokeWidth * 0.6} />

            {/* Sleepers (cross ties) */}
            {Array.from({ length: 8 }).map((_, i) => {
                const t = i / 7
                const x = fromX + (toX - fromX) * t
                const y = fromY + (toY - fromY) * t
                const sleeperLen = 20
                const perpX = Math.cos(angle + Math.PI / 2) * sleeperLen
                const perpY = Math.sin(angle + Math.PI / 2) * sleeperLen

                return (
                    <line
                        key={`sleeper-${i}`}
                        x1={x - perpX}
                        y1={y - perpY}
                        x2={x + perpX}
                        y2={y + perpY}
                        stroke="#D2691E"
                        strokeWidth={strokeWidth * 0.4}
                    />
                )
            })}
        </svg>
    );
};