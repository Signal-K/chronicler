export function WaterPipe({ 
    fromX, 
    fromY, 
    toX, 
    toY, 
    strokeWidth = 2 
}: { 
    fromX: number; 
    fromY: number; 
    toX: number; 
    toY: number; 
    strokeWidth?: number;
}) {
    // Calculate SVG dimensions to fit the pipe
    const minX = Math.min(fromX, toX) - strokeWidth * 2;
    const minY = Math.min(fromY, toY) - strokeWidth * 2;
    const maxX = Math.max(fromX, toX) + strokeWidth * 2;
    const maxY = Math.max(fromY, toY) + strokeWidth * 2;
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Adjust coordinates to SVG viewBox
    const adjustedFromX = fromX - minX;
    const adjustedFromY = fromY - minY;
    const adjustedToX = toX - minX;
    const adjustedToY = toY - minY;
    
    return (
        <svg 
            width={width} 
            height={height} 
            viewBox={`0 0 ${width} ${height}`}
            style={{
                position: 'absolute',
                left: minX,
                top: minY,
                pointerEvents: 'none',
            }}
            className="block"
        >
            {/* Outer pipe casing */}
            <line 
                x1={adjustedFromX} 
                y1={adjustedFromY} 
                x2={adjustedToX} 
                y2={adjustedToY} 
                stroke="#5A6A7A" 
                strokeWidth={strokeWidth * 2} 
                strokeLinecap="round"
            />
            {/* Inner pipe highlight */}
            <line 
                x1={adjustedFromX} 
                y1={adjustedFromY} 
                x2={adjustedToX} 
                y2={adjustedToY} 
                stroke="#7A8A9A" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round"
            />
            {/* Pipe connectors/joints every so often */}
            {Array.from({ length: 4 }).map((_, i) => {
                const t = (i + 1) / 5;
                const x = adjustedFromX + (adjustedToX - adjustedFromX) * t;
                const y = adjustedFromY + (adjustedToY - adjustedFromY) * t;
                
                return (
                    <circle 
                        key={`joint-${i}`}
                        cx={x} 
                        cy={y} 
                        r={strokeWidth * 1.5} 
                        fill="#6A7A8A" 
                        stroke="#4A5A6A" 
                        strokeWidth="1"
                    />
                );
            })}
        </svg>
    );
}
