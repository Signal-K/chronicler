import Foundation
import Observation

@Observable
final class GameState {
    var gold: Int = 500
    var water: Int = 10
    var plots: [Plot] = (0..<12).map { Plot(id: $0) }
    var hives: [Hive] = [
        Hive(id: 1, name: "Hive #1", population: 98, rainwater: 100, production: 0.8, isActive: true)
    ]
    var inventory: [ItemStack] = [
        ItemStack(id: "honey",    name: "Honey",    icon: "🍯", quantity: 0,  sellValue: 45),
        ItemStack(id: "wheat",    name: "Wheat",    icon: "🌾", quantity: 24, sellValue: 5),
        ItemStack(id: "carrots",  name: "Carrots",  icon: "🥕", quantity: 15, sellValue: 8),
        ItemStack(id: "berries",  name: "Berries",  icon: "🍓", quantity: 42, sellValue: 2),
    ]
    var activeRequests: [NPCRequest] = NPCRequest.farmerSamRequests

    private let saveKey = "bee_garden_state_v1"

    init() {
        load()
        applyOfflineTick()
    }

    // MARK: - Plot actions

    func plant(seedId: String, in plotId: Int) {
        guard let i = plots.firstIndex(where: { $0.id == plotId }),
              case .empty = plots[i].state else { return }
        plots[i].state = .planted(seedId: seedId, plantedAt: Date())
        save()
    }

    func harvest(plotId: Int) {
        guard let i = plots.firstIndex(where: { $0.id == plotId }),
              case .ready(let seedId) = plots[i].state,
              let seed = Seed.all.first(where: { $0.id == seedId }) else { return }
        plots[i].state = .empty
        addToInventory(itemId: seedId, name: seed.name, icon: seed.icon, qty: 1, sellValue: seed.sellValue)
        save()
    }

    // MARK: - Hive actions

    func harvestHoney(hiveId: Int) {
        guard let i = hives.firstIndex(where: { $0.id == hiveId }) else { return }
        let amount = hives[i].harvest()
        addToInventory(itemId: "honey", name: "Honey", icon: "🍯", qty: amount, sellValue: 45)
        save()
    }

    // MARK: - Market actions

    func sell(itemId: String, qty: Int = 1) {
        guard let i = inventory.firstIndex(where: { $0.id == itemId }),
              inventory[i].quantity >= qty else { return }
        let earned = inventory[i].sellValue * qty
        inventory[i].quantity -= qty
        gold += earned
        save()
    }

    func sellAll() {
        for i in inventory.indices {
            gold += inventory[i].sellValue * inventory[i].quantity
            inventory[i].quantity = 0
        }
        save()
    }

    // MARK: - NPC actions

    func acceptRequest(_ request: NPCRequest) -> Bool {
        guard let invIdx = inventory.firstIndex(where: { $0.id == request.requiresItemId }),
              inventory[invIdx].quantity >= request.requiresQty else { return false }
        inventory[invIdx].quantity -= request.requiresQty
        gold += request.rewardGold
        activeRequests.removeAll { $0.id == request.id }
        save()
        return true
    }

    func declineRequest(_ request: NPCRequest) {
        activeRequests.removeAll { $0.id == request.id }
        save()
    }

    // MARK: - Tick

    func tickPlots() {
        for i in plots.indices { plots[i].tick() }
    }

    // MARK: - Persistence

    private func addToInventory(itemId: String, name: String, icon: String, qty: Int, sellValue: Int) {
        if let i = inventory.firstIndex(where: { $0.id == itemId }) {
            inventory[i].quantity += qty
        } else {
            inventory.append(ItemStack(id: itemId, name: name, icon: icon, quantity: qty, sellValue: sellValue))
        }
    }

    private func applyOfflineTick() {
        guard let lastSave = UserDefaults.standard.object(forKey: "bee_last_save") as? Date else { return }
        let elapsed = Date().timeIntervalSince(lastSave)
        for i in hives.indices { hives[i].tick(elapsed: elapsed) }
        tickPlots()
    }

    func save() {
        UserDefaults.standard.set(Date(), forKey: "bee_last_save")
        // Simple codable save — extend with full Codable conformance as needed
    }

    func load() {
        // Load from UserDefaults JSON — stub for now, wired up in swf007
    }
}
