"use client"

import { SoilPlotProps } from "@/types/SoilPlot"
import { AnimatePresence, motion } from "framer-motion"
import { Droplets, Sparkles } from "lucide-react"
import { CropSprite } from "../sprites/CropSprite"

export function SoilPlot({ plot, onClick, selectedTool }: SoilPlotProps) {
    const getPlotStyle = () => {
        if (!plot.tilled) {
            return {
                background: "linear-gradient(135deg, #a16207 0%, #94200e 50%, #78350f 100%)",
                border: "4px solid #451a03",
            };
        };

        if (plot.watered) {
            return {
                background: "linear-gradient(135deg, #3f1f0a 0%, #2d1508 50%, #1a0d05 100%)",
                border: "4px solid #0c0a09",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(59, 130, 246, 0.3)",
            };
        };

        return {
            background: "linear-gradient(135deg, #b45309 0%, #92400e 50%, #78350f 100%)",
            border: "4px solid #451a03",
        };
    };

    const plotStyle = getPlotStyle();
    const isHarvestable = plot.growthStage === 4;

    return (
        <motion.button
            onClick={onClick}
            className="relative aspect-square rounded-lg shadow-lg overflow-hidden min-h-[100px] sm:min-h-[120px]"
            style={plotStyle}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: selectedTool || isHarvestable ? 1.05 : 1 }}
        >
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://w3.org/2000/svg">
                <defs>
                    <pattern
                        id={`soil-texture-${Math.random()}`}
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="3" cy="3" r="1" fill="#451a03" opacity="0.6" />
                        <circle cx="12" cy="8" r="1.5" fill="#451a03" opacity="0.5" />
                        <circle cx="7" cy="15" r="1" fill="#451a03" opacity="0.7" />
                        <circle cx="16" cy="14" r="1" fill="#451a03" opacity="0.6" />
                        <circle cx="5" cy="10" r="0.8" fill="#78350f" opacity="0.5" />
                        <circle cx="18" cy="5" r="1.2" fill="#78350f" opacity="0.4" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#soil-texture-${Math.random()})`} />
            </svg>

            {/* Tilled texture/lines */}
            {plot.tilled && (
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col justify-around p-2"
                >
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-0.5 bg-black/50 rounded" />
                    ))}
                </motion.div>
            )}

{/* Water effects */}
      {plot.watered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-2 right-2">
            <Droplets className="w-8 h-8 sm:w-9 sm:h-9 text-blue-300 drop-shadow-[0_0_12px_rgba(147,197,253,1)]" />
          </div>
          <div className="absolute bottom-2 left-2">
            <Droplets className="w-7 h-7 sm:w-8 sm:h-8 text-blue-200 drop-shadow-[0_0_10px_rgba(191,219,254,1)]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-blue-500/25" />
        </motion.div>
      )}

      <AnimatePresence>
        {plot.crop && plot.growthStage > 0 && <CropSprite crop={plot.crop} growthStage={plot.growthStage} />}
      </AnimatePresence>

      {/* Tool hints */}
      {selectedTool && !plot.crop && (
        <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
          <div className="text-white/70 text-sm sm:text-base font-bold">
            {selectedTool === "till" && !plot.tilled && "TILL"}
            {selectedTool === "water" && plot.tilled && "WATER"}
            {selectedTool === "plant" && plot.tilled && !plot.crop && "PLANT"}
          </div>
        </div>
      )}

      {/* Water needs indicator */}
      {plot.needsWater && plot.growthStage < 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-1 right-1">
          <Droplets className="w-6 h-6 sm:w-7 sm:h-7 text-red-400 animate-pulse" />
        </motion.div>
      )}

      {/* Harvestable indicator */}
      {isHarvestable && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="absolute top-1 left-1"
        >
          <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300 drop-shadow-lg" />
        </motion.div>
      )}
    </motion.button>
  )
};