//
//  LoginEntities.swift
//  FoxHuntARDF
//
//  Created by itechart on 15/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

protocol RemoteBasicAuthResponse {
    var email: String { get }
    var roles: UserRole { get }
}

extension Remote {
    struct AuthRequest: Codable {
        let email, password: String
        let domain: String?
    }

    struct AuthRefreshToken : Codable {
        let refreshToken: String
    }

    struct ResendCodeResponse : Codable {
        let code: Int
    }

    struct UserSetupRequest : Codable {
        var email: String
        var password: String
        var firstName: String
        var lastName: String
        var birthDate: String
        var country: String
        var city: String
    }

    struct EmailVerificationRequest : Codable {
        var id: String
        var token: String
    }

    struct UserSetupResponseResult : Codable {
        let userId: String
    }

    struct UserSetupResponseError : Codable {
        var status: Int
        var message: String
        var timestamp: String
    }

    struct UserSetupResponse : Codable {
        var result: UserSetupResponseResult? = nil
        var error: UserSetupResponseError? = nil
    }

    enum Org {
        struct AuthResponse: RemoteBasicAuthResponse, Codable {
            let email: String
            let roles: UserRole
        }
    }

    enum Admin {
        struct AuthResponse: RemoteBasicAuthResponse, Codable {
            let email: String
            let organizationId: UInt
            let roles: UserRole
        }
    }

    struct Token: Codable {
        let token, refreshToken: String
        let expiresInSeconds: String
        let tokenType: String
    }

    struct LoginResponse : Codable {
        var token: Token?
        var email: String? // resend code logic
    }

    struct RoleEntity: Codable {
        let id: Int64?
        let role: UserRole
    }

    struct User: Codable {
        let id: Int64
        let activated: Bool
        let activatedSince: DateFormatted<StdDate>
        let avatar: String?
        let city: String
        let country: String
        let dateOfBirth: DateFormatted<StdDate>
        let email: String
        let firstName: String
        let lastName: String
        let roles: [RoleEntity]
    }
}

extension Remote.Token {
    var willExpireTime: TimeInterval? {
        get { TimeInterval(expiresInSeconds) }
    }
}

enum LoginLogicResult {
    case emailVerificationRequired
    case tokenRecieved
    case emailVerificationFailed
    case decodingFailed
    case savingTokensFailed
}
