"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type { Tool } from "../../types/SoilPlot"

type ToolbarProps = {
  selectedTool: Tool
  onToolSelect: (tool: Tool) => void
  onPlantSelect?: (plantType: string) => void
}

export function Toolbar({ selectedTool, onToolSelect, onPlantSelect }: ToolbarProps) {
  const [showPlantMenu, setShowPlantMenu] = useState(false)

  const availablePlants = [
    { id: "tomato", name: "Tomato", icon: "🍅", color: "bg-red-500" },
    { id: "pumpkin", name: "Pumpkin", icon: "🎃", color: "bg-orange-500" },
    { id: "wheat", name: "Wheat", icon: "🌾", color: "bg-yellow-600" },
    { id: "potato", name: "Potato", icon: "🥔", color: "bg-yellow-700" },
  ]

  const handlePlantClick = () => {
    setShowPlantMenu(!showPlantMenu)
    if (selectedTool === "plant") {
      onToolSelect(null)
      setShowPlantMenu(false)
    }
  }

  const handlePlantSelection = (plantId: string) => {
    onToolSelect("plant")
    setShowPlantMenu(false)
    if (onPlantSelect) {
      onPlantSelect(plantId)
    }
  }

  return (
    <div className="relative z-20 bg-amber-900 border-t-4 border-amber-950 p-3">
      <div className="flex justify-center items-center gap-4 max-w-md mx-auto">
        {/* Till Tool */}
        <motion.button
          onClick={() => onToolSelect(selectedTool === "till" ? null : "till")}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 shadow-lg ${
            selectedTool === "till"
              ? "bg-orange-500 border-orange-950 ring-4 ring-yellow-400"
              : "bg-orange-600 border-orange-950"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 20h10" />
            <path d="M10 20v-4" />
            <path d="M14 20v-4" />
            <path d="M12 16V4" />
            <path d="M9 9l-3 3" />
            <path d="M15 9l3 3" />
          </svg>
          <span className="text-xs text-white font-bold mt-1">TILL</span>
        </motion.button>

        {/* Water Tool */}
        <motion.button
          onClick={() => onToolSelect(selectedTool === "water" ? null : "water")}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 shadow-lg ${
            selectedTool === "water"
              ? "bg-blue-500 border-blue-950 ring-4 ring-cyan-400"
              : "bg-blue-600 border-blue-950"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span className="text-xs text-white font-bold mt-1">WATER</span>
        </motion.button>

        {/* Plant Tool */}
        <div className="relative">
          <motion.button
            onClick={handlePlantClick}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 shadow-lg ${
              selectedTool === "plant" || showPlantMenu
                ? "bg-green-500 border-green-950 ring-4 ring-lime-400"
                : "bg-green-600 border-green-950"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.5 6 6 8 3 9c3.5 1 6 3.5 7 7 1-3.5 3.5-6 7-7-3-1-5.5-3-7-7z" />
            </svg>
            <span className="text-xs text-white font-bold mt-1">PLANT</span>
          </motion.button>

          <AnimatePresence>
            {showPlantMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-green-800 border-4 border-green-950 rounded-xl shadow-2xl p-3 min-w-[200px]"
              >
                <div className="text-white text-sm font-bold mb-2 text-center">Select Plant</div>
                <div className="grid grid-cols-2 gap-2">
                  {availablePlants.map((plant) => (
                    <motion.button
                      key={plant.id}
                      onClick={() => handlePlantSelection(plant.id)}
                      className={`${plant.color} border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl mb-1">{plant.icon}</span>
                      <span className="text-xs text-white font-bold">{plant.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
};