"use client"

import { useEffect, useRef, useState } from "react"
import { Greenhouse } from "../../components/elements/buildings/greenhouse"
import { Minecart } from "../../components/elements/buildings/minecart"
import { GrainSilo } from "../../components/elements/buildings/silo"
import { MinecartTrack } from "../../components/elements/buildings/track"
import { TrainStation } from "../../components/elements/buildings/train-station"
import { WaterPipe } from "../../components/elements/buildings/water-pipe"
import { WaterTank } from "../../components/elements/buildings/water-tank"
import { Tree } from "../../components/elements/tree"
import { LandscapeGrassBackground } from "../../components/landscape/background"

export default function LandscapeScene() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({
        width: 800,
        height: 600,
    });
    
    // Example water value - in a real app this would come from game state
    const [water] = useState(75);
    const maxWater = 100;

    useEffect(() => {
        const updateDimensions = () => {
            if (sceneRef.current) {
                setDimensions({
                    width: sceneRef.current.clientWidth,
                    height: sceneRef.current.clientHeight,
                });
            };
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const stationX = dimensions.width * 0.85;
    const stationY = dimensions.height * 0.15;
    const greenhouseX = dimensions.width * 0.25;
    const greenhouseY = dimensions.height * 0.35;
    
    // Water tank positioning - further away from greenhouse
    const waterTankX = dimensions.width * 0.02;
    const waterTankY = dimensions.height * 0.12;
    const waterTankSize = 120;
    
    // Pipe connection points
    const pipeFromX = waterTankX + waterTankSize * 0.9;
    const pipeFromY = waterTankY + waterTankSize * 0.85;
    const pipeToX = greenhouseX - 20;
    const pipeToY = greenhouseY + 40;

    return (
        <div
            ref={sceneRef}
            className="w-full h-full relative overflow-hidden bg-green-700"
            style={{ maxWidth: '100vw', maxHeight: '100vh' }}
        >
            {/* Grass background layer fills the entire scene */}
            <LandscapeGrassBackground />

            {/* Water tank behind greenhouse */}
            <div
                style={{
                    position: "absolute",
                    left: waterTankX,
                    top: waterTankY,
                }}
            >
                <WaterTank size={waterTankSize} water={water} maxWater={maxWater} />
            </div>

            {/* Water pipe connecting tank to greenhouse */}
            <WaterPipe 
                fromX={pipeFromX} 
                fromY={pipeFromY} 
                toX={pipeToX} 
                toY={pipeToY} 
                strokeWidth={3}
            />

            {/* Track & minecart is on top of the grass layer */}
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    pointerEvents: 'none'
                }}
            >
                <MinecartTrack fromX={stationX} fromY={stationY} toX={greenhouseX} toY={greenhouseY} strokeWidth={4} />
                <Minecart size={50} isMoving={true} />
            </div>

            {/* Train station */}
            <div
                style={{
                    position: "absolute",
                    right: -35,
                    top: 10,
                    overflow: "hidden",
                }}
            >
                <TrainStation size={220} />
            </div>

            {/* Greenhouse */}
            <div
                style={{
                    position: "absolute",
                    left: `${((dimensions.width * 0.25) / dimensions.width) * 100}%`,
                    top: `${((dimensions.height * 0.35) / dimensions.height) * 100}`,
                }}
            >  
                <Greenhouse size={200} />
            </div>

            {/* Tree */}
            <div
                style={{
                    position: "absolute",
                    left: dimensions.width * 0.05,
                    top: dimensions.height * 0.3,
                }}
            >   
                <Tree size={180} />
            </div>

            {/* Three silos; bottom of scene */}
            <div
                style={{
                position: "absolute",
                left: dimensions.width * 0.05,
                bottom: 20,
                }}
            >
                <GrainSilo size={140} opacity={0.45} />
            </div>

            <div
                style={{
                position: "absolute",
                left: dimensions.width * 0.38,
                bottom: 15,
                }}
            >
                <GrainSilo size={160} opacity={0.5} />
            </div>

            <div
                style={{
                position: "absolute",
                right: dimensions.width * 0.05,
                bottom: 20,
                }}
            >
                <GrainSilo size={145} opacity={0.48} />
            </div>
        </div>
    );
};