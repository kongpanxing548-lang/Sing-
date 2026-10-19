// SPDX-License-Identifier: GPL-2.0-or-later
import Foundation

/// Localizes developer-authored strings while preserving the English source text as a fallback.
///
/// Only pass stable UI copy as `key`; user names, filenames, package names, and server text belong
/// in `format` arguments so they are displayed verbatim rather than treated as localization keys.
enum L10n {
    static func text(_ key: String) -> String {
        Bundle.main.localizedString(forKey: key, value: key, table: nil)
    }

    static func format(_ key: String, _ arguments: CVarArg...) -> String {
        String(format: text(key), locale: Locale.current, arguments: arguments)
    }
}
