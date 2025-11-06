"use client"

import { motion } from "framer-motion"

type CropSpriteProps = {
  crop: string
  growthStage: number // 1-4
}

export function CropSprite({ crop, growthStage }: CropSpriteProps) {
  const getCropColor = () => {
    switch (crop) {
      case "tomato":
        return { primary: "#ef4444", secondary: "#dc2626", leaf: "#22c55e" }
      case "carrot":
        return { primary: "#f97316", secondary: "#ea580c", leaf: "#16a34a" }
      case "wheat":
        return { primary: "#eab308", secondary: "#ca8a04", leaf: "#84cc16" }
      case "corn":
        return { primary: "#fbbf24", secondary: "#f59e0b", leaf: "#65a30d" }
      default:
        return { primary: "#22c55e", secondary: "#16a34a", leaf: "#15803d" }
    }
  }

  const colors = getCropColor()

  // Different animations for each crop type
  const getPlantAnimation = () => {
    switch (crop) {
      case "tomato":
        return {
          initial: { scale: 0, rotate: -180, y: 20 },
          animate: { scale: 1, rotate: 0, y: 0 },
          transition: { type: "spring" as const, stiffness: 200, damping: 15 },
        }
      case "carrot":
        return {
          initial: { scale: 0, y: -20 },
          animate: { scale: 1, y: 0 },
          transition: { type: "spring" as const, stiffness: 300, damping: 20 },
        }
      case "wheat":
        return {
          initial: { scaleY: 0, originY: 1 },
          animate: { scaleY: 1 },
          transition: { duration: 0.6, ease: "easeOut" as const },
        }
      case "corn":
        return {
          initial: { scale: 0, rotate: 90 },
          animate: { scale: 1, rotate: 0 },
          transition: { type: "spring" as const, stiffness: 250, damping: 18 },
        }
      default:
        return {
          initial: { scale: 0 },
          animate: { scale: 1 },
          transition: { duration: 0.4 },
        }
    }
  }

  const animation = getPlantAnimation()

  // Stage 1: Sprout
  if (growthStage === 1) {
    return (
      <motion.div {...animation} className="absolute inset-0 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-lg">
          <g>
            {/* Small sprout */}
            <path d="M20 30 Q18 25 20 20" stroke={colors.leaf} strokeWidth="2" fill="none" />
            <ellipse cx="18" cy="22" rx="3" ry="5" fill={colors.leaf} opacity="0.8" />
            <ellipse cx="22" cy="22" rx="3" ry="5" fill={colors.leaf} opacity="0.8" />
          </g>
        </svg>
      </motion.div>
    )
  }

  // Stage 2: Growing
  if (growthStage === 2) {
    return (
      <motion.div {...animation} className="absolute inset-0 flex items-center justify-center">
        <svg width="50" height="50" viewBox="0 0 50 50" className="drop-shadow-lg">
          <g>
            {/* Stem */}
            <rect x="23" y="20" width="4" height="15" fill={colors.leaf} rx="2" />
            {/* Leaves */}
            <ellipse cx="18" cy="25" rx="5" ry="7" fill={colors.leaf} />
            <ellipse cx="32" cy="25" rx="5" ry="7" fill={colors.leaf} />
            <ellipse cx="25" cy="20" rx="4" ry="6" fill={colors.leaf} opacity="0.9" />
          </g>
        </svg>
      </motion.div>
    )
  }

  // Stage 3: Maturing
  if (growthStage === 3) {
    return (
      <motion.div {...animation} className="absolute inset-0 flex items-center justify-center">
        <svg width="60" height="60" viewBox="0 0 60 60" className="drop-shadow-lg">
          <g>
            {/* Stem */}
            <rect x="28" y="25" width="4" height="20" fill={colors.leaf} rx="2" />
            {/* Leaves */}
            <ellipse cx="20" cy="30" rx="6" ry="9" fill={colors.leaf} />
            <ellipse cx="40" cy="30" rx="6" ry="9" fill={colors.leaf} />
            {/* Small fruit/flower bud */}
            <circle cx="30" cy="22" r="5" fill={colors.secondary} opacity="0.7" />
          </g>
        </svg>
      </motion.div>
    )
  }

  // Stage 4: Ready to harvest - Full grown with fruit
  return (
    <motion.div {...animation} className="absolute inset-0 flex items-center justify-center">
      <svg width="70" height="70" viewBox="0 0 70 70" className="drop-shadow-xl">
        <g>
          {/* Stem */}
          <rect x="33" y="30" width="4" height="25" fill={colors.leaf} rx="2" />
          {/* Leaves */}
          <ellipse cx="23" cy="35" rx="7" ry="10" fill={colors.leaf} />
          <ellipse cx="47" cy="35" rx="7" ry="10" fill={colors.leaf} />
          <ellipse cx="35" cy="28" rx="5" ry="8" fill={colors.leaf} />

          {/* Crop-specific mature fruit */}
          {crop === "tomato" && (
            <>
              <circle cx="35" cy="20" r="8" fill={colors.primary} />
              <circle cx="35" cy="20" r="6" fill={colors.secondary} opacity="0.6" />
              <path d="M35 12 L32 15 L35 15 L38 15 Z" fill={colors.leaf} />
            </>
          )}
          {crop === "carrot" && (
            <>
              <path d="M35 20 L30 35 L40 35 Z" fill={colors.primary} />
              <ellipse cx="35" cy="18" rx="6" ry="3" fill={colors.leaf} />
              <line x1="32" y1="25" x2="32" y2="32" stroke={colors.secondary} strokeWidth="1" />
              <line x1="38" y1="25" x2="38" y2="32" stroke={colors.secondary} strokeWidth="1" />
            </>
          )}
          {crop === "wheat" && (
            <>
              <rect x="32" y="15" width="6" height="12" fill={colors.primary} rx="3" />
              <circle cx="33" cy="17" r="2" fill={colors.secondary} />
              <circle cx="37" cy="17" r="2" fill={colors.secondary} />
              <circle cx="33" cy="21" r="2" fill={colors.secondary} />
              <circle cx="37" cy="21" r="2" fill={colors.secondary} />
            </>
          )}
          {crop === "corn" && (
            <>
              <ellipse cx="35" cy="20" rx="5" ry="10" fill={colors.primary} />
              <path d="M30 15 Q28 20 30 25" stroke={colors.leaf} strokeWidth="2" fill="none" />
              <path d="M40 15 Q42 20 40 25" stroke={colors.leaf} strokeWidth="2" fill="none" />
              {[...Array(6)].map((_, i) => (
                <line
                  key={i}
                  x1="32"
                  y1={15 + i * 2}
                  x2="38"
                  y2={15 + i * 2}
                  stroke={colors.secondary}
                  strokeWidth="0.5"
                />
              ))}
            </>
          )}
        </g>
      </svg>
    </motion.div>
  );
};