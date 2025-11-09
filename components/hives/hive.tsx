import { HiveCellProps } from "@/types/hive";

export default function HiveCell({ hive, isSelected }: HiveCellProps) {
    const healthColor =
        hive.health > 70
            ? "from-green-400 to-green-600"
            : hive.health > 40
                ? "from-yellow-400 to-yellow-600"
                : "from-red-400 to-red-600"

    return (
        <div className="relative w-24 h-24">
            <svg
                viewBox="0 0 200 200"
                className={`w-full h-full transition-all ${isSelected ? "drop-shadow-lg scale-110" : "drop-shadow-md"}`}
            >
                {/* Wood texture background */}
                <defs>
                <pattern id={`wood-${hive.id}`} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" fill="#92400e" />
                    <line x1="0" y1="0" x2="4" y2="4" stroke="#78350f" strokeWidth="0.5" opacity="0.3" />
                </pattern>
                </defs>

                {/* Main hexagon body */}
                <polygon
                points="100,20 170,60 170,140 100,180 30,140 30,60"
                fill={`url(#wood-${hive.id})`}
                stroke="#78350f"
                strokeWidth="3"
                />

                {/* Entrance hole */}
                <circle cx="100" cy="140" r="12" fill="#1a1a1a" stroke="#2d2d2d" strokeWidth="1" />

                {/* Health gradient bar at bottom */}
                <defs>
                <linearGradient id={`health-${hive.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={hive.health > 70 ? "#22c55e" : hive.health > 40 ? "#eab308" : "#ef4444"} />
                    <stop offset="100%" stopColor={hive.health > 70 ? "#16a34a" : hive.health > 40 ? "#ca8a04" : "#dc2626"} />
                </linearGradient>
                </defs>

                <rect x="35" y="165" width="130" height="8" fill="#3d3d3d" stroke="#1a1a1a" strokeWidth="1" />
                <rect
                x="35"
                y="165"
                width={(130 * hive.health) / 100}
                height="8"
                fill={`url(#health-${hive.id})`}
                stroke="none"
                />

                {/* Decorative honey frames */}
                <g opacity="0.6">
                <line x1="60" y1="50" x2="140" y2="50" stroke="#d4a574" strokeWidth="1" />
                <line x1="50" y1="85" x2="150" y2="85" stroke="#d4a574" strokeWidth="1" />
                <line x1="50" y1="120" x2="150" y2="120" stroke="#d4a574" strokeWidth="1" />
                </g>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <div className="text-lg font-bold text-yellow-100 drop-shadow-md">{hive.beeCount}</div>
                <div className="text-xs text-yellow-50 drop-shadow-md">bees</div>
            </div>

            {/* Selection ring */}
            {isSelected && (
                <div className="absolute inset-0 rounded-lg ring-4 ring-blue-400 shadow-xl opacity-75 animate-pulse" />
            )}
        </div>
    );
};