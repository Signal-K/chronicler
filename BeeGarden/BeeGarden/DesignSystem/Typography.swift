import SwiftUI

// Fonts must be added to the Xcode project and Info.plist (UIAppFonts).
// Download: Space Grotesk, Be Vietnam Pro, Lexend from Google Fonts.
extension Font {
    static func spaceGrotesk(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("SpaceGrotesk-\(weight.spaceGroteskName)", size: size)
    }

    static func beVietnamPro(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("BeVietnamPro-\(weight.beVietnamName)", size: size)
    }

    static func lexend(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("Lexend-\(weight.lexendName)", size: size)
    }

    // Design system scale
    static let headlineLg = Font.spaceGrotesk(32, weight: .bold)
    static let headlineMd = Font.spaceGrotesk(24, weight: .bold)
    static let labelSm    = Font.lexend(12, weight: .semibold)
    static let bodyMd     = Font.beVietnamPro(16)
    static let bodyLg     = Font.beVietnamPro(18)
}

private extension Font.Weight {
    var spaceGroteskName: String {
        switch self {
        case .bold, .heavy: return "Bold"
        case .semibold:     return "SemiBold"
        default:            return "Regular"
        }
    }
    var beVietnamName: String {
        switch self {
        case .bold, .heavy: return "Bold"
        case .semibold:     return "SemiBold"
        case .medium:       return "Medium"
        default:            return "Regular"
        }
    }
    var lexendName: String {
        switch self {
        case .bold, .heavy: return "Bold"
        case .semibold:     return "SemiBold"
        default:            return "Regular"
        }
    }
}
