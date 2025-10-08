import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { toolbarIconStyles as styles } from '../../styles/garden/ToolbarIconStyles';

interface ToolbarIconProps {
  icon: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function ToolbarIcon({ icon, label, isSelected, onPress }: ToolbarIconProps) {
  return (
    <TouchableOpacity
      style={[styles.iconContainer, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrapper, isSelected && styles.selectedIconWrapper]}>
        <Text style={[styles.icon, isSelected && styles.selectedIcon]}>{icon}</Text>
      </View>
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}