import { StyleSheet } from 'react-native';

export const plantingToolbarStyles = StyleSheet.create({
  toolbar: {
    position: "absolute",
    left: 10,
    top: "10%",
    bottom: "25%",
    width: 80,
    justifyContent: "center",
    zIndex: 100,
  },
  toolContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});