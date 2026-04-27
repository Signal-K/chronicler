import SwiftUI

struct BeeHeader: View {
    @Environment(GameState.self) var game
    var title: String = "BEE FARM"

    var body: some View {
        HStack {
            Button(action: {}) {
                Image(systemName: "line.3.horizontal")
                    .font(.title2)
                    .foregroundStyle(Color(hex: "#F5E6D3"))
            }
            .padding(8)

            Spacer()

            Text(title)
                .font(.spaceGrotesk(20, weight: .bold))
                .foregroundStyle(Color(hex: "#F5E6D3"))
                .textCase(.uppercase)
                .tracking(1.5)
                .shadow(color: .black, radius: 0, x: 2, y: 2)

            Spacer()

            HStack(spacing: 16) {
                Label("\(game.gold)", systemImage: "circle.fill")
                    .foregroundStyle(Color.beeGold)
                Label("\(game.water)", systemImage: "drop.fill")
                    .foregroundStyle(.cyan)
            }
            .font(.spaceGrotesk(13, weight: .bold))
            .textCase(.uppercase)
        }
        .padding(.horizontal, 12)
        .frame(height: 56)
        .background(Color.beeWood)
        .overlay(alignment: .bottom) {
            Rectangle()
                .frame(height: 4)
                .foregroundStyle(Color.beeOnSurface)
        }
        .shadow(color: .black.opacity(0.3), radius: 0, x: 0, y: 4)
    }
}
