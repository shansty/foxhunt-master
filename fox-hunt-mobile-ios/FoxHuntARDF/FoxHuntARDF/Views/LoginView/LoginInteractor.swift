//
//  LoginInteractor.swift
//  FoxHuntARDF
//
//  Created by itechart on 14/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

protocol LoginInteractor: ModuleInteractor {
    func signIn(with email: EmailAddress, password: String, domain: String?) async throws -> LoginLogicResult
}

final class LoginInteractorImpl: LoginInteractor {
    typealias Presenter = LoginPresenterImpl

    @ServicesProperty var services: Services?

    var presenter: LoginPresenterImpl?

    var remote: RemoteService {
        get throws {
            guard let remote = services?.resolve(RemoteService.self) as? RemoteService else {
                throw FoxHuntMobileError.internalInconsistency }
            return remote
        }
    }

    required init() {}
    required init(services: Services?) {
        self.services = services
    }

    func signIn(with email: EmailAddress, password: String, domain: String?) async throws -> LoginLogicResult {
        let loginRemoteService = try LoginRemoteService(remoteService: remote)
        return try await loginRemoteService.performLogIn(with: email.rawValue,
                                                         password: password,
                                                         domain: domain)
    }

    func updateTokens() async throws -> LoginLogicResult {
        let loginRemoteService = try LoginRemoteService(remoteService: remote)
        return try await loginRemoteService.updateAccessToken()
    }

    func logOut() async throws -> Bool {
        let loginRemoteService = try LoginRemoteService(remoteService: remote)
        return try await loginRemoteService.performLogOut()
    }
}
