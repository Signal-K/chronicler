import SwiftUI

enum Tab {
    case field, hives, tools, seeds, shop
}

struct ContentView: View {
    @State private var selectedTab: Tab = .field
    @Environment(GameState.self) var game

    var body: some View {
        VStack(spacing: 0) {
            tabContent
            BeeTabBar(selected: $selectedTab)
        }
        .ignoresSafeArea(edges: .bottom)
        .onAppear { startPlotTimer() }
    }

    @ViewBuilder
    private var tabContent: some View {
        switch selectedTab {
        case .field:  FarmView()
        case .hives:  HivesView()
        case .seeds:  SeedPouchView()
        case .shop:   MarketView()
        case .tools:  PlaceholderView(title: "TOOLS")
        }
    }

    private func startPlotTimer() {
        Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { _ in
            game.tickPlots()
        }
    }
}

struct BeeTabBar: View {
    @Binding var selected: Tab

    struct TabItem {
        let tab: Tab
        let icon: String
        let label: String
    }

    let items: [TabItem] = [
        .init(tab: .field,  icon: "map.fill",          label: "Field"),
        .init(tab: .hives,  icon: "hexagon.fill",       label: "Hives"),
        .init(tab: .tools,  icon: "wrench.and.screwdriver.fill", label: "Tools"),
        .init(tab: .seeds,  icon: "leaf.fill",          label: "Seeds"),
        .init(tab: .shop,   icon: "cart.fill",          label: "Shop"),
    ]

    var body: some View {
        HStack(spacing: 0) {
            ForEach(items, id: \.label) { item in
                TabBarItem(item: item, isSelected: selected == item.tab)
                    .onTapGesture { selected = item.tab }
            }
        }
        .frame(height: 72)
        .background(Color.beeSurfaceVariant)
        .overlay(alignment: .top) {
            Rectangle()
                .frame(height: 3)
                .foregroundStyle(Color.beeOnSurface)
        }
        .padding(.bottom, 16) // safe area padding
    }
}

struct TabBarItem: View {
    let item: BeeTabBar.TabItem
    let isSelected: Bool

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: item.icon)
                .font(.system(size: 20))
            Text(item.label.uppercased())
                .font(.labelSm)
                .tracking(0.5)
        }
        .foregroundStyle(isSelected ? Color.beeOnSurface : Color.beeOnSurfaceVariant)
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(
            isSelected
                ? Color.beeGold.opacity(0.2)
                    .overlay(alignment: .top) {
                        Rectangle().frame(height: 3).foregroundStyle(Color.beeGold)
                    }
                : Color.clear
        )
    }
}

struct PlaceholderView: View {
    let title: String
    var body: some View {
        VStack(spacing: 0) {
            BeeHeader(title: title)
            Spacer()
            Text("Coming soon")
                .foregroundStyle(Color.beeOnSurfaceVariant)
            Spacer()
        }
        .background(Color.beeBackground)
    }
}
