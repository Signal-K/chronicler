"use client"

import { motion } from "framer-motion"
import { Book, Package, SettingsIcon, ShoppingBag } from "lucide-react"

type NavigationBarProps = {
  onOpenAlmanac: () => void
  onOpenInventory: () => void
  onOpenShop: () => void
  onOpenSettings: () => void
}

export function NavigationBar({ onOpenAlmanac, onOpenInventory, onOpenShop, onOpenSettings }: NavigationBarProps) {
  return (
    <div className="relative z-20 bg-green-800 border-t-4 border-green-950 p-3">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {/* Shop Icon */}
        <motion.button
          onClick={onOpenShop}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-red-600 border-2 border-red-950 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingBag className="w-7 h-7 text-white" />
        </motion.button>

        {/* Inventory Icon */}
        <motion.button
          onClick={onOpenInventory}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-amber-700 border-2 border-amber-950 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Package className="w-7 h-7 text-white" />
        </motion.button>

        {/* Almanac Icon */}
        <motion.button
          onClick={onOpenAlmanac}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-amber-600 border-2 border-amber-950 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Book className="w-7 h-7 text-white" />
        </motion.button>

        {/* Settings Icon */}
        <motion.button
          onClick={onOpenSettings}
          className="flex items-center justify-center w-14 h-14 rounded-xl bg-green-900 border-2 border-green-950 shadow-lg"
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
        >
          <SettingsIcon className="w-6 h-6 text-green-300" />
        </motion.button>
      </div>
    </div>
  );
};