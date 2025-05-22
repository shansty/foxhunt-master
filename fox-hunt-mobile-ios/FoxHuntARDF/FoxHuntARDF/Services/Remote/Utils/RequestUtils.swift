import Foundation
import os

enum Remote { }

extension OSLog {
    static var remote = OSLog(subsystem: Bundle.main.bundleIdentifier ?? "",
                              category: "Remote")
}

typealias IDType = UInt

enum ApiGroup: String {
    case login = "login"
    case org = "org"
    case admin = "admin"
    case competitions = "competitions"
    case helpContent = "help-content"
}

enum HTTPStatusCode: Int {
    case OK = 200
    case created = 201
    case badRequest = 400
    case unauthorized = 401
    case forbidden = 403
    case notFound = 404
    case conflict = 409
    case internalServerError = 500
}

extension URL {
    func version(_ version: String) -> URL {
        return self.appendingPathComponent("v\(version)")
    }

    func apiPrefix() -> URL {
        return self.appendingPathComponent("api")
    }

    func apiGroup(_ group: ApiGroup) -> URL {
        return self.appendingPathComponent(group.rawValue)
    }

    func endPoint(_ point: String) -> URL {
        return self.appendingPathComponent(point)
    }
}
