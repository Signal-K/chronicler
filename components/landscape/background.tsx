"use client"

export function LandscapeGrassBackground() {
    const generateGrassBlades = () => {
        const blades = [];
        const bladeCount = 1200;
        for (let i = 0; i < bladeCount; i++) {
            const seed = (i * 73856093) ^ (i * 19349663);
            const x = ((seed >> 0) % 10000) / 100;
            const y = (( seed >> 10) % 7200) / 12;
            const height = 6 + ((seed >> 20) % 14);
            const tilt = ((seed >> 30) % 50) - 25;
            const shade = (seed >> 5) % 4;

            blades.push({
                x,
                y,
                height,
                tilt,
                shade
            });
        };

        return blades;
    };

    const shadeColors = [
        "#5A9236",
        "#6BA842",
        "#7DC850",
        "#4D7A2A",
    ];

    const blades = generateGrassBlades();

    return (
        <div className="absolute inset-0 overflow-hidden">
            <svg width="100%" height="100%" className="block" preserveAspectRatio="none">
                <defs>
                    <filter id="grassTexture">
                        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="5" seed="42" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                    </filter>
                </defs>

                <rect width="100%" height="100%" fill="#6BA842" />

                {blades.slice(0, 600).map((blade, i) => (
                    <path
                        key={`blade-1-${i}`}
                        d={`M ${blade.x} ${blade.y + blade.height} Q ${blade.x + blade.tilt * 0.6} ${blade.y + blade.height * 0.5} ${blade.x + blade.tilt * 0.8} ${blade.y}`}
                        stroke={shadeColors[blade.shade]}
                        strokeWidth={1 + (blade.shade % 2) * 0.4}
                        fill="none"
                        opacity={0.7 + Math.random() * 0.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}

                {blades.slice(600, 1200).map((blade, i) => (
                    <path
                        key={`blade-2-${i}`}
                        d={`M ${blade.x} ${blade.y + blade.height} Q ${blade.x + blade.tilt * 0.4} ${blade.y + blade.height * 0.6} ${blade.x + blade.tilt * 0.6} ${blade.y}`}
                        stroke={shadeColors[(blade.shade + 1) % 4]}
                        strokeWidth={0.6 + (blade.shade % 2) * 0.3}
                        fill="none"
                        opacity={0.5 + Math.random() * 0.15}
                        strokeLinecap="round"
                    />
                ))}

                <rect width="100%" height="100%" fill="#7DC850" opacity="0.08" />

                <ellipse cx="20%" cy="30%" rx="15%" ry="20%" fill="#5A9236" opacity="0.05" />
                <ellipse cx="20%" cy="60%" rx="12%" ry="18%" fill="#AD7A2A" opacity="0.06" />
                <ellipse cx="20%" cy="80%" rx="18%" ry="15%" fill="#5A9236" opacity="0.04" />
            </svg>
        </div>
    );
};