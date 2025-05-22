//
//  HelpInteractor.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 12.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

protocol SettingsInteractorProtocol: ModuleInteractor {
    func getHelpContent() async throws -> [HelpDTO]?
}

final class SettingsInteractor: SettingsInteractorProtocol {
    typealias Presenter = SettingsPresenter

    var presenter: SettingsPresenter?
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

    func getHelpContent() async throws -> [HelpDTO]? {
        logger?.debug("loading Help content from server", with: .settingsModule)
        let remoteService = try HelpRemoteService(remoteService: remote)
        return try await remoteService.getHelpContent()
    }
}
