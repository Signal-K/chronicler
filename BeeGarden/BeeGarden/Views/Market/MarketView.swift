import SwiftUI

struct MarketView: View {
    @Environment(GameState.self) var game

    let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 2)

    var sellableItems: [ItemStack] {
        game.inventory.filter { $0.quantity > 0 }
    }

    var body: some View {
        VStack(spacing: 0) {
            BeeHeader(title: "MIGROS MARKET")

            ScrollView {
                VStack(spacing: 16) {
                    // Market M badge
                    HStack {
                        Text("M")
                            .font(.spaceGrotesk(24, weight: .bold))
                            .foregroundStyle(.white)
                            .frame(width: 44, height: 44)
                            .background(Color.beeSecondary)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.beeOnSurface, lineWidth: 2))

                        Text("MIGROS MARKET")
                            .font(.headlineMd)
                            .foregroundStyle(Color.beeOnSurface)

                        Spacer()
                    }
                    .padding(.horizontal, 4)

                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(sellableItems) { item in
                            MarketItemCard(item: item) {
                                game.sell(itemId: item.id)
                            }
                        }
                    }

                    Button(action: { game.sellAll() }) {
                        Label("SELL ALL", systemImage: "cart.fill")
                            .font(.spaceGrotesk(16, weight: .bold))
                            .foregroundStyle(Color.beeOnSurface)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.beeGold)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.beeOnSurface, lineWidth: 3))
                            .shadow(color: .black.opacity(0.35), radius: 0, x: 3, y: 3)
                    }
                }
                .padding(16)
            }
            .background(Color.beeBackground)
        }
    }
}

struct MarketItemCard: View {
    let item: ItemStack
    let onSell: () -> Void

    var body: some View {
        VStack(spacing: 10) {
            ZStack(alignment: .topTrailing) {
                Text(item.icon)
                    .font(.system(size: 52))
                    .frame(maxWidth: .infinity)
                    .padding(.top, 8)

                Text("x\(item.quantity)")
                    .font(.labelSm)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color.beeOnSurface)
                    .clipShape(RoundedRectangle(cornerRadius: 4))
                    .padding(6)
            }

            Text(item.name)
                .font(.labelSm)
                .foregroundStyle(Color.beeOnSurface)

            Text("\(item.sellValue) Gold / ea")
                .font(.labelSm)
                .foregroundStyle(Color.beeOnSurfaceVariant)

            Button(action: onSell) {
                Text("SELL")
                    .font(.labelSm)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(Color.beeSecondary)
                    .clipShape(RoundedRectangle(cornerRadius: 6))
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color.beeOnSurface, lineWidth: 2))
            }
        }
        .padding(10)
        .beeCard(background: Color.beeSurfaceContainer)
    }
}
