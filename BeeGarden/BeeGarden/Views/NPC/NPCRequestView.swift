import SwiftUI

struct NPCRequestSheet: View {
    @Environment(GameState.self) var game
    let request: NPCRequest
    @Binding var isPresented: Bool
    @State private var showingError = false

    var canFulfill: Bool {
        guard let item = game.inventory.first(where: { $0.id == request.requiresItemId }) else { return false }
        return item.quantity >= request.requiresQty
    }

    var body: some View {
        VStack(spacing: 0) {
            // Diamond accent
            Image(systemName: "diamond.fill")
                .foregroundStyle(Color.beeOnSurface)
                .padding(.top, 12)

            Text("New Request")
                .font(.labelSm)
                .foregroundStyle(Color.beeOnSurfaceVariant)
                .padding(.top, 4)

            // NPC portrait + dialogue
            VStack(spacing: 12) {
                HStack(alignment: .top, spacing: 12) {
                    VStack {
                        Text(request.npcEmoji)
                            .font(.system(size: 48))
                        Text(request.npcName)
                            .font(.labelSm)
                            .foregroundStyle(Color.beeOnSurface)
                    }
                    .padding(8)
                    .beeCard(background: Color.beeSurfaceContainer)

                    Text(""\(request.dialogue)"")
                        .font(.bodyMd)
                        .foregroundStyle(Color.beeOnSurface)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                // Requires / Reward
                HStack {
                    Label("Requires: \(request.requiresQty) \(request.requiresItemId.capitalized)",
                          systemImage: "hexagon.fill")
                        .font(.labelSm)
                        .foregroundStyle(Color.beeOnSurface)

                    Spacer()

                    Label("Reward: \(request.rewardGold) 🪙", systemImage: "")
                        .font(.labelSm)
                        .foregroundStyle(Color.beeGold)
                }
                .padding(12)
                .beeCard(background: Color.beeSurfaceContainerHigh)
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.beeOnSurface.opacity(0.4), style: StrokeStyle(lineWidth: 1, dash: [6]))
            )
            .padding(16)

            if showingError {
                Text("You don't have enough \(request.requiresItemId).")
                    .font(.labelSm)
                    .foregroundStyle(Color.beeError)
                    .padding(.bottom, 8)
            }

            // Actions
            HStack(spacing: 12) {
                Button(action: {
                    game.declineRequest(request)
                    isPresented = false
                }) {
                    Text("DECLINE")
                        .font(.spaceGrotesk(14, weight: .bold))
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.beeError)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.beeOnSurface, lineWidth: 3))
                }

                Button(action: {
                    if game.acceptRequest(request) {
                        isPresented = false
                    } else {
                        showingError = true
                    }
                }) {
                    Label("ACCEPT", systemImage: "checkmark")
                        .font(.spaceGrotesk(14, weight: .bold))
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.beeSecondary)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.beeOnSurface, lineWidth: 3))
                }
            }
            .shadow(color: .black.opacity(0.3), radius: 0, x: 3, y: 3)
            .padding(16)
        }
        .background(Color.beeBackground)
        .presentationDetents([.medium])
    }
}
