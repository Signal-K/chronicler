import type { PlantingToolbarProps, ToolType } from '@/types/garden';
import React, { useState } from "react";
import { View } from "react-native";
import { plantingToolbarStyles as styles } from "../../styles/garden/PlantingToolbarStyles";
import ToolbarIcon from "./ToolbarIcon";

export default function PlantingToolbar({
  onToolSelect,
  showTill = false,
  toolbarTop,
}: PlantingToolbarProps) {
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);

  const handleToolPress = (tool: ToolType) => {
    const newTool = selectedTool ? null : tool;
    setSelectedTool(newTool);
    onToolSelect(newTool);
  };

  const baseTools = [
    // {
    //   id: "lilac" as ToolType,
    //   icon: "🌸",
    //   label: "Lilac",
    // },
    {
      id: "watering-can" as ToolType,
      icon: "🚿",
      label: "Water",
    },
    {
      id: "shovel" as ToolType,
      icon: "🪣",
      label: "Reset",
    },
  ];

  const tools = [
    ...(showTill
      ? [
          { id: "till" as ToolType, icon: "🔨", label: "Till" },
          { id: "grass" as ToolType, icon: "🌱", label: "Plant Grass" },
        ]
      : []),
    ...baseTools,
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
}
