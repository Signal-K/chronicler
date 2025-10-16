import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.95,
    maxHeight: SCREEN_HEIGHT * 0.9,
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#8FBC8F",
    borderBottomWidth: 2,
    borderBottomColor: "#6B8E6B",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#8FBC8F",
    backgroundColor: "#FFF",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#8FBC8F",
    fontWeight: "bold",
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: "#FFF",
  },
  itemImageLocked: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  lockedIcon: {
    fontSize: 40,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  itemLabelLocked: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#8FBC8F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeLocked: {
    backgroundColor: "#CCC",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  statusTextLocked: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
});
