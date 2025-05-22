//
//  UserEmailVerificationInteractor.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 03.02.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation

protocol UserEmailVerificationInteractor: ModuleInteractor {
}

final class UserEmailVerificationInteractorImpl: UserEmailVerificationInteractor{
    typealias Presenter = UserEmailVerificationPresenterImpl
    var presenter:UserEmailVerificationPresenterImpl?

    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?

    var remote: RemoteService {
        get throws {
            guard let remote = services?.resolve(RemoteService.self) as? RemoteService else {
                throw FoxHuntMobileError.internalInconsistency
            }
            return remote
        }
    }

    init() {}

    init(services: Services?) {
        self.services = services
    }

    func resendCode(with email: String) async throws -> Bool {
        let signUpRemoteService = try SignUpRemoteService(remoteService: remote)
        return try await signUpRemoteService.resendCode(with: email)
    }

    func verifyEmailCode(with verificationInfo: Remote.EmailVerificationRequest) async throws -> Bool {
        let signUpRemoteService = try SignUpRemoteService(remoteService: remote)
        return try await signUpRemoteService.verifyEmailCode(with: verificationInfo)
    }
}

