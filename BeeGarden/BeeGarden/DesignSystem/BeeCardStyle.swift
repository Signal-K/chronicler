import SwiftUI

// The chunky bordered card style used throughout the Stitch designs.
struct BeeCard: ViewModifier {
    var background: Color = .beeSurfaceContainer
    var borderColor: Color = .beeOnSurface
    var borderWidth: CGFloat = 3
    var cornerRadius: CGFloat = 8

    func body(content: Content) -> some View {
        content
            .background(background)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
            .shadow(color: .black.opacity(0.35), radius: 0, x: 3, y: 3)
    }
}

// Woodgrain panel — the dark brown inset used on the farm grid and cards
struct WoodPanel: ViewModifier {
    func body(content: Content) -> some View {
        content
            .background(Color(hex: "#3B2214"))
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.beeOnSurface, lineWidth: 4)
            )
            .shadow(color: .black.opacity(0.4), radius: 0, x: 4, y: 4)
    }
}

extension View {
    func beeCard(background: Color = .beeSurfaceContainer, borderColor: Color = .beeOnSurface) -> some View {
        modifier(BeeCard(background: background, borderColor: borderColor))
    }

    func woodPanel() -> some View {
        modifier(WoodPanel())
    }
}
