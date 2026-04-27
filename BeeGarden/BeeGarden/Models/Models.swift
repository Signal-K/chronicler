import Foundation

// MARK: - Seed / Crop

enum PollenType: String, Codable {
    case sweet = "Sweet"
    case hard  = "Hard"
}

struct Seed: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let icon: String          // SF Symbol or asset name
    let pollenType: PollenType
    let growDuration: TimeInterval  // seconds
    let sellValue: Int        // gold per unit when harvested

    static let all: [Seed] = [
        Seed(id: "lavender",   name: "Lavender",   icon: "🌿", pollenType: .sweet, growDuration: 3*3600,  sellValue: 4),
        Seed(id: "sunflower",  name: "Sunflower",  icon: "🌻", pollenType: .hard,  growDuration: 4*3600,  sellValue: 6),
        Seed(id: "poppy",      name: "Poppy",      icon: "🌸", pollenType: .sweet, growDuration: 2*3600,  sellValue: 3),
        Seed(id: "clover",     name: "Clover",     icon: "🍀", pollenType: .hard,  growDuration: 30*60,   sellValue: 2),
    ]
}

// MARK: - Plot

enum PlotState: Codable {
    case empty
    case planted(seedId: String, plantedAt: Date)
    case ready(seedId: String)
}

struct Plot: Identifiable, Codable {
    let id: Int
    var state: PlotState = .empty

    var isReady: Bool {
        if case .ready = state { return true }
        return false
    }

    mutating func tick() {
        guard case .planted(let seedId, let plantedAt) = state,
              let seed = Seed.all.first(where: { $0.id == seedId }) else { return }
        if Date().timeIntervalSince(plantedAt) >= seed.growDuration {
            state = .ready(seedId: seedId)
        }
    }
}

// MARK: - Inventory

struct ItemStack: Identifiable, Codable {
    let id: String      // matches Seed.id or "honey"
    let name: String
    let icon: String
    var quantity: Int
    let sellValue: Int
}

// MARK: - Hive

struct Hive: Identifiable, Codable {
    let id: Int
    var name: String
    var population: Int       // 0–100 %
    var rainwater: Int        // units
    var production: Double    // 0.0–1.0
    var isActive: Bool

    var productionPercent: Int { Int(production * 100) }

    mutating func tick(elapsed: TimeInterval) {
        guard isActive else { return }
        let rate = Double(population) / 100.0 * 0.001  // per second
        production = min(1.0, production + rate * elapsed)
    }

    mutating func harvest() -> Int {
        let honey = Int(production * 10)
        production = 0
        return honey
    }
}

// MARK: - NPC Request

struct NPCRequest: Identifiable, Codable {
    let id: String
    let npcName: String
    let npcEmoji: String
    let dialogue: String
    let requiresItemId: String
    let requiresQty: Int
    let rewardGold: Int

    static let farmerSamRequests: [NPCRequest] = [
        NPCRequest(
            id: "sam-001",
            npcName: "Farmer Sam",
            npcEmoji: "👨‍🌾",
            dialogue: "Mornin' to ya! I've been tryin' to craft some sturdy wax for a new project, but regular honey just ain't cuttin' it. Could you harvest me a batch of Hard Honey? I'll make it worth your while with some extra coin.",
            requiresItemId: "honey",
            requiresQty: 10,
            rewardGold: 150
        ),
        NPCRequest(
            id: "sam-002",
            npcName: "Farmer Sam",
            npcEmoji: "👨‍🌾",
            dialogue: "Those lavender fields are looking sparse lately. Mind sparing some clover? My bees have been mighty restless.",
            requiresItemId: "clover",
            requiresQty: 5,
            rewardGold: 60
        ),
    ]
}
