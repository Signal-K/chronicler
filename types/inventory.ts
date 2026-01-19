
export type BottledHoney = {
  id: string;
  type: string; // e.g. "wildflower", "clover", "light", "amber", "dark", "specialty"
  color: string; // hex color for honey type
  amount: number; // number of bottles
};

export type InventoryProps = {
  inventory: {
    coins: number;
    water: number;
    seeds: Record<string, number>;
    harvested: Record<string, number>;
    bottledHoney?: BottledHoney[];
    items?: Record<string, number>; // For glass bottles, tools, etc.
  };
  setInventory: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}