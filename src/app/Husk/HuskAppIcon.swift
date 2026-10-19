// SPDX-License-Identifier: GPL-2.0-or-later
import UIKit

/// The app icon, as something a person can choose.
///
/// DroidDeck ships one original icon so the derivative cannot be confused with
/// upstream Husk. The enum remains in place because the settings UI and mark
/// renderer share this small abstraction.
enum HuskAppIcon: String, CaseIterable, Identifiable {
    /// The only shipped icon is the primary icon.
    ///
    /// nil name = primary. UIKit uses nil rather than a name for it, and passing
    /// the primary's own name is an error.
    case automatic = "DroidDeckIcon"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .automatic: return "DroidDeck"
        }
    }

    var detail: String {
        "Original DroidDeck artwork."
    }

    /// What UIKit wants: nil for the primary, the asset name otherwise.
    var alternateName: String? { self == .automatic ? nil : rawValue }

    /// The artwork, for drawing this icon inside the app.
    ///
    /// From a plain bundled PNG, not the asset catalog. Appicon assets are not
    /// addressable through UIImage(named:) even with INCLUDE_ALL_APPICON_ASSETS
    /// — the previews in Settings came out blank, and the start screen showed a
    /// stale copy of the default artwork whichever icon was actually in use.
    /// Shipping the images as ordinary resources is what makes them loadable.
    ///
    /// `dark` remains in the small shared API even though 0.1.0 uses the same
    /// preview in every appearance.
    func preview(dark: Bool = false) -> UIImage? {
        switch self {
        case .automatic: return UIImage(named: "droiddeck-icon")
        }
    }

    static var current: HuskAppIcon {
        guard let name = UIApplication.shared.alternateIconName else { return .automatic }
        return HuskAppIcon(rawValue: name) ?? .automatic
    }

    /// Apply this icon.
    ///
    /// iOS shows its own "You have changed the icon" alert afterwards and there
    /// is no way to suppress it, so this deliberately does not add one of its
    /// own — two dialogs for one tap would be worse than the system's.
    static func apply(_ icon: HuskAppIcon) {
        guard UIApplication.shared.supportsAlternateIcons else {
            HuskLog.log("ui", "this device does not support alternate app icons")
            return
        }
        guard icon.alternateName != UIApplication.shared.alternateIconName else { return }
        UIApplication.shared.setAlternateIconName(icon.alternateName) { error in
            if let error {
                HuskLog.log("ui", "could not set the \(icon.title) icon: "
                                + error.localizedDescription)
            } else {
                HuskLog.log("ui", "app icon set to \(icon.title)")
            }
        }
    }
}


/// The three tabs: Home (what you used last), the Library (everything) and Settings.
enum HuskTab: String, CaseIterable, Identifiable {
    case home
    case library
    case store
    case settings

    var id: String { rawValue }
}
