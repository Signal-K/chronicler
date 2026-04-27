import SwiftUI

struct HivesView: View {
    @Environment(GameState.self) var game

    var body: some View {
        VStack(spacing: 0) {
            BeeHeader(title: "BEEHIVE HUB")

            ScrollView {
                VStack(spacing: 16) {
                    ForEach(game.hives) { hive in
                        HiveCard(hive: hive) {
                            game.harvestHoney(hiveId: hive.id)
                        }
                    }
                }
                .padding(16)
            }
            .background(Color.beeBackground)
        }
    }
}

struct HiveCard: View {
    let hive: Hive
    let onHarvest: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("STATUS")
                        .font(.labelSm)
                        .foregroundStyle(Color.beeOnSurfaceVariant)
                    Text(hive.name)
                        .font(.headlineMd)
                        .foregroundStyle(Color.beeOnSurface)
                }
                Spacer()
                Label(hive.isActive ? "ACTIVE" : "INACTIVE", systemImage: "circle.fill")
                    .font(.labelSm)
                    .foregroundStyle(hive.isActive ? Color.beeSecondary : Color.beeError)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(hive.isActive ? Color.beeSecondaryContainer : Color.beeErrorContainer)
                    .clipShape(RoundedRectangle(cornerRadius: 4))
                    .overlay(RoundedRectangle(cornerRadius: 4).stroke(Color.beeOnSurface, lineWidth: 1.5))
            }

            HStack(spacing: 12) {
                StatBox(icon: "person.2.fill", label: "POPULATION", value: "\(hive.population)%")
                StatBox(icon: "drop.fill", label: "RAINWATER", value: "\(hive.rainwater) units")
            }

            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Label("PRODUCTION", systemImage: "hexagon.fill")
                        .font(.labelSm)
                        .foregroundStyle(Color.beeOnSurfaceVariant)
                    Spacer()
                    Text("\(hive.productionPercent)%")
                        .font(.labelSm)
                        .foregroundStyle(Color.beeOnSurface)
                }
                ProgressView(value: hive.production)
                    .tint(Color.beeGold)
                    .scaleEffect(x: 1, y: 2)
            }
            .padding(12)
            .beeCard(background: Color.beeSurfaceContainerHigh)

            Button(action: onHarvest) {
                Label("HARVEST HONEY", systemImage: "cube.box.fill")
                    .font(.spaceGrotesk(16, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.beePrimaryContainer)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.beeOnSurface, lineWidth: 3))
                    .shadow(color: .black.opacity(0.35), radius: 0, x: 3, y: 3)
            }
        }
        .padding(16)
        .beeCard(background: Color.beeSurface)
    }
}

struct StatBox: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Label(label, systemImage: icon)
                .font(.labelSm)
                .foregroundStyle(Color.beeOnSurfaceVariant)
            Text(value)
                .font(.headlineMd)
                .foregroundStyle(Color.beeOnSurface)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .beeCard(background: Color.beeSurfaceContainer)
    }
}
