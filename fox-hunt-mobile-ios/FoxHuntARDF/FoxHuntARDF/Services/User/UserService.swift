//
//  UserService.swift
//  FoxHuntARDF
//
//  Created by itechart on 29/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol UserService: Service {
    var isLoggedIn: Bool { get set }
    var userRole: UserRole { get set }
    var email: EmailAddress? { get set }
}

private struct UserKeys: RawRepresentable {
    typealias RawValue = String
    var rawValue: String

    static var loggedInKey = UserKeys(rawValue: "L00531N")
}

final class UserServiceImpl: UserService {
    // FIXME: put it to Keychain Store
    @AppStorage(UserKeys.loggedInKey.rawValue) var isLoggedIn = false

    var services: Services

    var started = false

    var userRole: UserRole = .unregistered
    var email: EmailAddress?

    init(_ services: Services) {
        self.services = services
    }

    func start() throws {
        started = true
    }

    func stop() -> Error? {
        started = false
        return nil
    }
}
