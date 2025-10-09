import React, { useState } from "react";
import { View } from "react-native";
import { plantingToolbarStyles as styles } from '../../styles/garden/PlantingToolbarStyles';
import ToolbarIcon from "./ToolbarIcon";

export type ToolType = "till" | "grass" | "lilac" | "watering-can" | null;

interface PlantingToolbarProps {
  onToolSelect: (tool: ToolType) => void;
  showTill?: boolean;
  toolbarTop?: number;
};

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

 const tools = [
    ...(showTill ? [{ id: 'till' as ToolType, icon: '🔨', label: 'Till' }] : []),
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
};
