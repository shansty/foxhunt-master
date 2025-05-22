//
//  UserRole.swift
//  FoxHuntARDF
//
//  Created by itechart on 30/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

struct UserRole: OptionSet {
    typealias RawValue = UInt16
    var rawValue: UInt16

    init() {
        rawValue = Self.unregistered.rawValue
    }

    init(rawValue: UInt16) {
        self.rawValue = rawValue
    }

    static let unregistered = UserRole(rawValue: 0)
    static let  participant = UserRole(rawValue: 1)
    static let      trainer = UserRole(rawValue: 1 << 1)
    static let     orgAdmin = UserRole(rawValue: 1 << 2)
    static let     sysAdmin = UserRole(rawValue: 1 << 3)
}

extension UserRole: OptionSetStringInitializable {
    init?(stringValue: String) {
        guard let role = Self.mapRoleFrom[stringValue] else { return nil }
        self.rawValue = role.rawValue
    }

    private static let mapRoleFrom: [String: UserRole] = [
        "SYSTEM_ADMIN": .sysAdmin,
        "ORGANIZATION_ADMIN": .orgAdmin,
        "TRAINER": .trainer,
        "PARTICIPANT": .participant
    ]
}

extension UserRole: Codable {
    // conditional decoding allowing single or array for initialization
    init(from decoder: Decoder) throws {
        self.rawValue = Self.unregistered.rawValue

        do {
            let singleValueContainer = try decoder.singleValueContainer()
            let stringValue = try singleValueContainer.decode(String.self)
            if let role = UserRole(stringValue: stringValue) { rawValue = role.rawValue }
        } catch DecodingError.typeMismatch {
            var unkeyedContainer = try decoder.unkeyedContainer()
            var role = UserRole.unregistered
            while unkeyedContainer.isAtEnd == false {
                let stringRole = try unkeyedContainer.decode(String.self)
                guard let newRole = UserRole(stringValue: stringRole) else { return }
                role.update(with: newRole)
            }
            self.rawValue = role.rawValue
        }
    }
}
