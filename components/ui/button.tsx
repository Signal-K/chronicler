
import * as React from "react";
import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
  disabled?: boolean;
  onPress?: () => void;
}

const variantStyles: Record<Variant, ViewStyle> = {
  default: { backgroundColor: "#007AFF" },
  destructive: { backgroundColor: "#FF3B30" },
  outline: { borderWidth: 1, borderColor: "#007AFF", backgroundColor: "transparent" },
  secondary: { backgroundColor: "#EFEFEF" },
  ghost: { backgroundColor: "transparent" },
  link: { backgroundColor: "transparent" },
};

const sizeStyles: Record<Size, ViewStyle> = {
  default: { height: 40, paddingHorizontal: 16, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  sm: { height: 36, paddingHorizontal: 12, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  lg: { height: 48, paddingHorizontal: 24, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  icon: { height: 40, width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
};

const textVariantStyles: Record<Variant, TextStyle> = {
  default: { color: "#fff" },
  destructive: { color: "#fff" },
  outline: { color: "#007AFF" },
  secondary: { color: "#333" },
  ghost: { color: "#007AFF" },
  link: { color: "#007AFF", textDecorationLine: "underline" },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  style,
  textStyle,
  children,
  disabled,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        sizeStyles[size],
        variantStyles[variant],
        disabled && { opacity: 0.5 },
        style,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[{ fontSize: 16, fontWeight: "500" }, textVariantStyles[variant], textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};
