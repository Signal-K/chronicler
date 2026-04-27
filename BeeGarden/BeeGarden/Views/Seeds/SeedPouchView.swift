import SwiftUI

struct SeedPouchView: View {
    var onSelect: ((Seed) -> Void)? = nil

    let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 2)

    var body: some View {
        VStack(spacing: 0) {
            BeeHeader(title: "SEED POUCH")

            ScrollView {
                LazyVGrid(columns: columns, spacing: 12) {
                    ForEach(Seed.all) { seed in
                        SeedCard(seed: seed)
                            .onTapGesture { onSelect?(seed) }
                    }
                }
                .padding(16)
            }
            .background(Color.beeSurfaceVariant)

            if onSelect != nil {
                Text("Tap a seed to plant in selected field slot")
                    .font(.labelSm)
                    .foregroundStyle(Color.beeOnSurfaceVariant)
                    .padding(12)
            }
        }
        .background(Color.beeBackground)
    }
}

struct SeedCard: View {
    let seed: Seed

    var body: some View {
        VStack(spacing: 8) {
            Text(seed.icon)
                .font(.system(size: 48))

            Text(seed.name.uppercased())
                .font(.labelSm)
                .foregroundStyle(Color.beeOnSurface)
                .tracking(0.5)

            Text(seed.pollenType.rawValue.uppercased())
                .font(.labelSm)
                .foregroundStyle(.white)
                .padding(.horizontal, 8)
                .padding(.vertical, 2)
                .background(seed.pollenType == .sweet ? Color.beeSecondary : Color.beePrimary)
                .clipShape(RoundedRectangle(cornerRadius: 4))

            Label(formatDuration(seed.growDuration), systemImage: "clock")
                .font(.labelSm)
                .foregroundStyle(Color.beeOnSurfaceVariant)
        }
        .padding(12)
        .frame(maxWidth: .infinity)
        .beeCard(background: Color.beeSurfaceContainer)
    }

    private func formatDuration(_ seconds: TimeInterval) -> String {
        let h = Int(seconds) / 3600
        let m = Int(seconds) % 3600 / 60
        if h > 0 { return "\(h)h" }
        return "\(m)m"
    }
}
