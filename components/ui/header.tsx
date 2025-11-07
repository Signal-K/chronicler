"use client"

import { Cloud, CloudRain, Droplets, LogOut, Settings, Sun, User } from "lucide-react"
import { useState } from "react"

export type Weather = "sunny" | "cloudy" | "rainy"

type GameHeaderProps = {
  coins: number
  water: number
  weather: Weather
}

export function GameHeader({ coins, water, weather }: GameHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const WeatherIcon = weather === "rainy" ? CloudRain : weather === "cloudy" ? Cloud : Sun

  return (
    <header className="relative z-20 flex items-center justify-between px-4 py-3 bg-amber-900/90 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <WeatherIcon
          className={`w-6 h-6 ${weather === "rainy" ? "text-blue-300" : weather === "cloudy" ? "text-gray-300" : "text-yellow-300"}`}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Water balance */}
        <div className="flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-full border-2 border-blue-950">
          <Droplets className="w-4 h-4 text-blue-600" />
          <span className="text-blue-950 font-bold text-sm">{water}</span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-2 bg-amber-100 px-3 py-1.5 rounded-full border-2 border-amber-950">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" className="text-yellow-500" />
            <circle cx="12" cy="12" r="6" className="text-yellow-400" />
          </svg>
          <span className="text-amber-950 font-bold text-sm">{coins}</span>
        </div>

        {/* Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-950 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <svg className="w-6 h-6 text-amber-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-amber-50 border-2 border-amber-950 rounded-lg shadow-xl z-40 overflow-hidden">
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-amber-100 transition-colors text-left">
                  <User className="w-4 h-4 text-amber-900" />
                  <span className="text-amber-950 font-medium">Profile</span>
                </button>
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-amber-100 transition-colors text-left">
                  <Settings className="w-4 h-4 text-amber-900" />
                  <span className="text-amber-950 font-medium">Settings</span>
                </button>
                <div className="border-t border-amber-200" />
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-100 transition-colors text-left">
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 font-medium">Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};