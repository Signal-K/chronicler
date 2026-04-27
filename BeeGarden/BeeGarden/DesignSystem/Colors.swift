import SwiftUI

extension Color {
    // Primary palette — from Stitch design system
    static let beePrimary         = Color(hex: "#43271A")
    static let beePrimaryContainer = Color(hex: "#5C3D2E")
    static let beeOnPrimary       = Color.white

    static let beeSecondary       = Color(hex: "#436910")
    static let beeSecondaryContainer = Color(hex: "#C0EE87")

    static let beeTertiary        = Color(hex: "#402A00")
    static let beeTertiaryContainer = Color(hex: "#5C3F00")
    static let beeTertiaryFixedDim  = Color(hex: "#FFBA35")  // gold accent

    static let beeSurface         = Color(hex: "#FFF9ED")
    static let beeSurfaceContainer = Color(hex: "#F7EED2")
    static let beeSurfaceContainerHigh = Color(hex: "#F1E8CD")
    static let beeSurfaceVariant  = Color(hex: "#EBE2C8")
    static let beeBackground      = Color(hex: "#FFF9ED")

    static let beeOnSurface       = Color(hex: "#1F1C0B")
    static let beeOnSurfaceVariant = Color(hex: "#50443F")
    static let beeOutline         = Color(hex: "#82746E")
    static let beeOutlineVariant  = Color(hex: "#D4C3BC")

    static let beeError           = Color(hex: "#BA1A1A")
    static let beeErrorContainer  = Color(hex: "#FFDAD6")

    // Semantic shortcuts
    static let beeGold = beeTertiaryFixedDim
    static let beeWood = beePrimaryContainer  // #5C3D2E — header/card border colour
    static let beePaper = beeSurface
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r = Double((int >> 16) & 0xFF) / 255
        let g = Double((int >> 8)  & 0xFF) / 255
        let b = Double(int         & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
