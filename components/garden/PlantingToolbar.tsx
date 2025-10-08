import React, { useState } from "react";
import { View } from "react-native";
import { plantingToolbarStyles as styles } from '../../styles/garden/PlantingToolbarStyles';
import ToolbarIcon from "./ToolbarIcon";

export type ToolType = "till" | "grass" | "lilac" | "watering-can" | null;

interface PlantingToolbarProps {
  onToolSelect: (tool: ToolType) => void;
}

export default function PlantingToolbar({
  onToolSelect,
}: PlantingToolbarProps) {
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);

  const handleToolPress = (tool: ToolType) => {
    const newTool = selectedTool ? null : tool;
    setSelectedTool(newTool);
    onToolSelect(newTool);
  };

  const tools = [
    {
      id: "till" as ToolType,
      icon: "🔨",
      label: "Till",
    },
    {
      id: "grass" as ToolType,
      icon: "🌱",
      label: "Grass",
    },
    {
      id: "lilac" as ToolType,
      icon: "🌸",
      label: "Lilac",
    },
    {
      id: "watering-can" as ToolType,
      icon: "🚿",
      label: "Water",
    },
  ];

  return (
    <View style={styles.toolbar}>
        <View style={styles.toolContainer}>
            {tools.map((tool) => (
                <ToolbarIcon
                    key={tool.id}
                    icon={tool.icon}
                    label={tool.label}
                    isSelected={selectedTool === tool.id}
                    onPress={() => handleToolPress(tool.id)}
                />
            ))}
        </View>
    </View>
  );
};
