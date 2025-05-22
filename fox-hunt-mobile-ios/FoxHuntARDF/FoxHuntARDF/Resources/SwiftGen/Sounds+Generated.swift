// swiftlint:disable all
// Generated using SwiftGen — https://github.com/SwiftGen/SwiftGen

import Foundation

// swiftlint:disable superfluous_disable_command file_length line_length implicit_return

// MARK: - Files

// swiftlint:disable explicit_type_interface identifier_name
// swiftlint:disable nesting type_body_length type_name vertical_whitespace_opening_braces
public enum Files {
  /// warning.mp3
  public static let warningMp3 = File(name: "warning", ext: "mp3", relativePath: "", mimeType: "audio/mpeg")
  /// white_noise.mp3
  public static let whiteNoiseMp3 = File(name: "white_noise", ext: "mp3", relativePath: "", mimeType: "audio/mpeg")
  /// FoxSounds/
  public enum FoxSounds {
    /// sound_of_fox_1.mp3
    public static let soundOfFox1Mp3 = File(name: "sound_of_fox_1", ext: "mp3", relativePath: "", mimeType: "audio/mpeg")
    /// sound_of_fox_2.mp3
    public static let soundOfFox2Mp3 = File(name: "sound_of_fox_2", ext: "mp3", relativePath: "", mimeType: "audio/mpeg")
    /// sound_of_fox_3.mp3
    public static let soundOfFox3Mp3 = File(name: "sound_of_fox_3", ext: "mp3", relativePath: "", mimeType: "audio/mpeg")
    /// sound_of_fox_4.mp3
    public static let soundOfFox4Mp3 = File(name: "sound_of_fox_4", ext: "mp3", relativePath: "", mimeType: "audio/mpeg")
    /// sound_of_fox_5.mp3
    public static let soundOfFox5Mp3 = File(name: "sound_of_fox_5", ext: "mp3", relativePath: "", mimeType: "audio/mpeg")
  }
}
// swiftlint:enable explicit_type_interface identifier_name
// swiftlint:enable nesting type_body_length type_name vertical_whitespace_opening_braces

// MARK: - Implementation Details

public struct File {
  public let name: String
  public let ext: String?
  public let relativePath: String
  public let mimeType: String

  public var url: URL {
    return url(locale: nil)
  }

  public func url(locale: Locale?) -> URL {
    let bundle = BundleToken.bundle
    let url = bundle.url(
      forResource: name,
      withExtension: ext,
      subdirectory: relativePath,
      localization: locale?.identifier
    )
    guard let result = url else {
      let file = name + (ext.flatMap { ".\($0)" } ?? "")
      fatalError("Could not locate file named \(file)")
    }
    return result
  }

  public var path: String {
    return path(locale: nil)
  }

  public func path(locale: Locale?) -> String {
    return url(locale: locale).path
  }
}

// swiftlint:disable convenience_type explicit_type_interface
private final class BundleToken {
  static let bundle: Bundle = {
    #if SWIFT_PACKAGE
    return Bundle.module
    #else
    return Bundle(for: BundleToken.self)
    #endif
  }()
}
// swiftlint:enable convenience_type explicit_type_interface
