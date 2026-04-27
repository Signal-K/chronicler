import SwiftUI

@main
struct BeeGardenApp: App {
    @State private var gameState = GameState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(gameState)
        }
    }
}
