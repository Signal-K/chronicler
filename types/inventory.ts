export type InventoryProps = {
  inventory: {
    coins: number
    water: number
    seeds: Record<string, number>
    harvested: Record<string, number>
  }
  setInventory: React.Dispatch<React.SetStateAction<any>>
  onClose: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  onSellCrop?: (cropType: string, count: number, coinsEarned: number, emoji: string) => void
}

export const CROP_PRICES: Record<string, number> = {
  tomato: 15,
  pumpkin: 12,
  wheat: 8,
  potato: 10,
}