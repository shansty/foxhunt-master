//
//  UserSetupInteractor.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 31.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation

protocol UserSetupInteractor: ModuleInteractor {
}

final class UserSetupInteractorImpl: UserSetupInteractor{
    typealias Presenter = UserSetupPresenterImpl
    var presenter: UserSetupPresenterImpl?

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

    func signUp(with userInfo: Remote.UserSetupRequest) async throws -> Bool {
        let signUpRemoteService = try SignUpRemoteService(remoteService: remote)
        return try await signUpRemoteService.performSingUp(with: userInfo)
    }
}

