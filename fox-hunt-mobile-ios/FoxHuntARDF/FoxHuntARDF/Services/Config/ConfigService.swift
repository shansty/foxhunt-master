//
//  ConfigService.swift
//  FoxHuntARDF
//
//  Created by itechart on 15/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

enum RemoteTarget {
    case org
    case admin
    case api
}

protocol ConfigService: Service {
    var remoteAPIVersion: String { get }
    var hostname: String { get }
    var remoteBaseURL: URL? { get }
    var syncInterval: TimeInterval { get }
    var supportEmail: String { get }
}

final class ConfigImpl: ConfigService {
    var services: Services
    var started: Bool

    let remoteAPIVersion: String = "1"
    let hostname: String = "foxhunt.com"

#if targetEnvironment(simulator)
    let host = "127.0.0.1"
#else
    let host = "192.168.96.51"
#endif

    let apiPort = 8083

#if DEBUG
    let syncInterval: TimeInterval = 60
#else
    let syncInterval: TimeInterval = 300
#endif

    let supportEmail = "test.test@test.com"

    init(_ services: Services) {
        self.services = services
        started = false
    }

    func start() throws {
        started = true
    }

    func stop() -> Error? {
        started = false
        return nil
    }

    var remoteBaseURL: URL? {
        get {
            let base = "\(accessScheme())://\(host):\(apiPort)/"
            return URL(string: base)
        }
    }

    private func accessScheme() -> String { return "http" }
}
