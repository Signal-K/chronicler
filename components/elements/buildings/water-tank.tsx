export function WaterTank({ size = 120, water = 100, maxWater = 100 }: { size?: number; water?: number; maxWater?: number }) {
    // Calculate water level percentage
    const waterLevel = Math.max(0, Math.min(1, water / maxWater));
    const waterHeight = size * 0.6 * waterLevel; // 60% of size is max water height
    const waterY = size * 0.85 - waterHeight; // Start from bottom and work up
    
    return (
        <svg width={size} height={size * 1.1} viewBox={`0 0 ${size} ${size * 1.1}`} className="block">
            {/* Base platform */}
            <ellipse 
                cx={size * 0.5} 
                cy={size * 0.95} 
                rx={size * 0.42} 
                ry={size * 0.12} 
                fill="#5A5A5A" 
                stroke="#3A3A3A" 
                strokeWidth="1.5" 
            />
            
            {/* Support legs */}
            {[0.25, 0.75].map((xOffset) => (
                <rect 
                    key={`leg-${xOffset}`}
                    x={size * (xOffset - 0.03)} 
                    y={size * 0.7} 
                    width={size * 0.06} 
                    height={size * 0.25} 
                    fill="#4A4A4A" 
                    stroke="#2A2A2A" 
                    strokeWidth="1" 
                />
            ))}
            
            {/* Main cylindrical tank body */}
            <ellipse 
                cx={size * 0.5} 
                cy={size * 0.25} 
                rx={size * 0.35} 
                ry={size * 0.1} 
                fill="#B8C5D0" 
                stroke="#7A8A9A" 
                strokeWidth="2" 
            />
            <rect 
                x={size * 0.15} 
                y={size * 0.25} 
                width={size * 0.7} 
                height={size * 0.6} 
                fill="#C5D5E5" 
                stroke="#7A8A9A" 
                strokeWidth="2" 
            />
            <ellipse 
                cx={size * 0.5} 
                cy={size * 0.85} 
                rx={size * 0.35} 
                ry={size * 0.1} 
                fill="#A8B8C8" 
                stroke="#7A8A9A" 
                strokeWidth="2" 
            />
            
            {/* Water inside tank - clipped to tank shape */}
            {waterHeight > 0 && (
                <>
                    {/* Water body */}
                    <rect 
                        x={size * 0.15} 
                        y={waterY} 
                        width={size * 0.7} 
                        height={waterHeight} 
                        fill="#4A9EDE" 
                        opacity="0.7" 
                    />
                    {/* Water top ellipse */}
                    <ellipse 
                        cx={size * 0.5} 
                        cy={waterY} 
                        rx={size * 0.35} 
                        ry={size * 0.1} 
                        fill="#5AB5F5" 
                        opacity="0.8" 
                    />
                    {/* Water shine effect */}
                    <ellipse 
                        cx={size * 0.5} 
                        cy={waterY + size * 0.02} 
                        rx={size * 0.25} 
                        ry={size * 0.06} 
                        fill="white" 
                        opacity="0.3" 
                    />
                </>
            )}
            
            {/* Tank horizontal bands for structure */}
            {[0.35, 0.5, 0.65, 0.75].map((yOffset) => (
                <ellipse 
                    key={`band-${yOffset}`} 
                    cx={size * 0.5} 
                    cy={size * yOffset} 
                    rx={size * 0.35} 
                    ry={size * 0.03} 
                    fill="none" 
                    stroke="#6A7A8A" 
                    strokeWidth="1" 
                    opacity="0.5" 
                />
            ))}
            
            {/* Side highlights for metallic effect */}
            <rect 
                x={size * 0.15} 
                y={size * 0.3} 
                width={size * 0.05} 
                height={size * 0.5} 
                fill="white" 
                opacity="0.15" 
            />
            <rect 
                x={size * 0.8} 
                y={size * 0.3} 
                width={size * 0.05} 
                height={size * 0.5} 
                fill="#1A2A3A" 
                opacity="0.2" 
            />
            
            {/* Outlet pipe at bottom */}
            <rect 
                x={size * 0.75} 
                y={size * 0.82} 
                width={size * 0.15} 
                height={size * 0.05} 
                fill="#6A7A8A" 
                stroke="#4A5A6A" 
                strokeWidth="1" 
                rx="2"
            />
            
            {/* Water level indicator gauge */}
            <rect 
                x={size * 0.88} 
                y={size * 0.3} 
                width={size * 0.04} 
                height={size * 0.5} 
                fill="#E8E8E8" 
                stroke="#888" 
                strokeWidth="1" 
                rx="1"
            />
            {/* Gauge level marker */}
            <rect 
                x={size * 0.87} 
                y={size * (0.8 - waterLevel * 0.5)} 
                width={size * 0.06} 
                height={size * 0.02} 
                fill={waterLevel > 0.5 ? "#4CAF50" : waterLevel > 0.25 ? "#FFA726" : "#F44336"} 
            />
        </svg>
    );
}
