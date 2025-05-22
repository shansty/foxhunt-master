//
//  OrganizationEntity.swift
//  FoxHuntARDF
//
//  Created by itechart on 06/09/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

extension Remote {
    struct Organization: Codable, Identifiable {
        enum AccountType: String, Codable {
            case free = "FREE"
            case paid = "PAID"
        }

        enum Status: String, Codable {
            case new = "NEW"
            case declined = "DECLINED"
            case onboarding = "ONBOARDING"
            case active = "ACTIVE"
            case deactivated = "DEACTIVATED"
        }

        let id: IDType
        let name: String
        let legalAddress: String
        let actualAddress: String
        let organizationDomain: String
        let type: AccountType
        let approximateEmployeesAmount: UInt
        let status: Status
        let created: Date
        let lastStatusChange: Date
        let system: Bool
    }
}
