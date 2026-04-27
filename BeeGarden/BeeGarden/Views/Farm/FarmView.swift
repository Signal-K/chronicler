import SwiftUI

struct FarmView: View {
    @Environment(GameState.self) var game
    @State private var selectedPlotId: Int? = nil
    @State private var showingSeedPicker = false

    let columns = Array(repeating: GridItem(.flexible(), spacing: 6), count: 3)

    var body: some View {
        VStack(spacing: 0) {
            BeeHeader()

            ScrollView {
                LazyVGrid(columns: columns, spacing: 6) {
                    ForEach(game.plots) { plot in
                        PlotTileView(plot: plot)
                            .onTapGesture { handlePlotTap(plot) }
                    }
                }
                .padding(8)
                .woodPanel()
                .padding(16)
            }
            .background(Color.beeBackground)
        }
        .sheet(isPresented: $showingSeedPicker) {
            SeedPouchView(onSelect: { seed in
                if let plotId = selectedPlotId {
                    game.plant(seedId: seed.id, in: plotId)
                }
                showingSeedPicker = false
                selectedPlotId = nil
            })
        }
    }

    private func handlePlotTap(_ plot: Plot) {
        switch plot.state {
        case .empty:
            selectedPlotId = plot.id
            showingSeedPicker = true
        case .ready:
            game.harvest(plotId: plot.id)
        case .planted:
            break
        }
    }
}

struct PlotTileView: View {
    let plot: Plot

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 6)
                .fill(tileBackground)
                .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color.beeOnSurface, lineWidth: 2))

            content
        }
        .aspectRatio(1, contentMode: .fit)
    }

    @ViewBuilder
    private var content: some View {
        switch plot.state {
        case .empty:
            EmptyView()
        case .planted(let seedId, _):
            Text(Seed.all.first(where: { $0.id == seedId })?.icon ?? "🌱")
                .font(.title2)
                .opacity(0.6)
        case .ready(let seedId):
            VStack(spacing: 2) {
                Text(Seed.all.first(where: { $0.id == seedId })?.icon ?? "🌱")
                    .font(.title2)
                Image(systemName: "checkmark.circle.fill")
                    .foregroundStyle(.green)
                    .font(.caption)
            }
        }
    }

    private var tileBackground: Color {
        switch plot.state {
        case .empty:   return Color(hex: "#4A3020")
        case .planted: return Color(hex: "#3B2214")
        case .ready:   return Color(hex: "#2D4A1E")
        }
    }
}
