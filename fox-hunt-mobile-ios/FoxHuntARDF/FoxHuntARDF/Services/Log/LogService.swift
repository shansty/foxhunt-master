//
//  LogService.swift
//  FoxHuntARDF
//
//  Created by Sergey Verlygo on 16/05/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import os

enum LogType: Int {
    case trace
    case debug
    case info
    case notice
    case warn
    case error
    case fatal

    func toOSLogType() -> OSLogType {
        switch self {
        case .trace:
            return .debug
        case .debug:
            return .debug
        case .info:
            return .info
        case .notice:
            return .info
        case .warn:
            return .`default`
        case .error:
            return .error
        case .fatal:
            return .fault
        }
    }
}

protocol Log {
    func log(_   message: String, for logger: OSLog, with level: OSLogType)
    func debug(_ message: String, with logger: OSLog)
    func info(_  message: String, with logger: OSLog)
    func warn(_  message: String, with logger: OSLog)
    func error(_ message: String, with logger: OSLog)
    func fatal(_ message: String, with logger: OSLog)
}

extension OSLog {
    static var common = OSLog(subsystem: Bundle.main.bundleIdentifier ?? "", category: "common")
}

final class LogImpl: Log {
    static let shared = LogImpl(level: .default)

    var level: OSLogType
    var started = false

    init(level: OSLogType) {
        self.level = level
    }

    func start() throws {
        guard !started else { return }
        started = true
    }

    func stop() -> Error? {
        started = false
        return nil
    }

    func log(_ message: String, for logger: OSLog, with level: OSLogType) {
        os_log("%@", log: logger, type: level, message)
    }

    func debug(_ message: String, with logger: OSLog) {
        log(message, for: logger, with: .debug)
    }

    func info(_ message: String, with logger: OSLog) {
        log(message, for: logger, with: .info)
    }

    func warn(_ message: String, with logger: OSLog) {
        log(message, for: logger, with: .default)
    }

    func error(_ message: String, with logger: OSLog) {
        log(message, for: logger, with: .error)
    }

    func fatal(_ message: String, with logger: OSLog) {
        log(message, for: logger, with: .fault)
    }
}
