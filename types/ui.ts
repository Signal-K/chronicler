export interface PlanetIconProps {
  size?: number;
  color?: string;
}

export interface ToolbarProps {
  selectedTool: 'grass' | null;
  onSelectTool: (tool: 'grass' | null) => void;
}

export type ThemedViewProps = import('react-native').ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export type ThemedTextProps = import('react-native').TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export type ParallaxProps = {
  headerImage: import('react').ReactElement;
  headerBackgroundColor: { dark: string; light: string };
};

export type IconMapping = Record<string, string>;
export type IconSymbolName = string;

export type ExternalLinkProps = Omit<import('react').ComponentProps<typeof import('expo-router').Link>, 'href'> & { href: import('expo-router').Href & string };

