//
//  CompetitionsInteractor.swift
//  FoxHuntARDF
//
//  Created by itechart on 26/09/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

protocol CompetitionsInteractor: ModuleInteractor {
    func getCompetition(withId id: IDType, _ orgId: IDType?) async throws -> Remote.Competition?
    func getCompetitions(_ params: Remote.CompetitionsRequestParams? ) async throws -> Remote.CompetitionsContent?
}

final class CompetitionsInteractorImpl: CompetitionsInteractor {
    typealias Presenter = CompetitionsPresenterImpl

    var presenter: CompetitionsPresenterImpl?

    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?

    var remote: RemoteService {
        get throws {
            guard let remote = services?.resolve(RemoteService.self) as? RemoteService else {
                throw FoxHuntMobileError.internalInconsistency }
            return remote
        }
    }

    init() { }

    init(services: Services?) {
        self.services = services
    }

    // MARK: CompetitionsInteractor methods

    func getCompetition(withId id: IDType, _ orgId: IDType?) async throws -> Remote.Competition? {
        logger?.debug("loading competition[id=\(id)] from server", with: .competitionsModule)
        let remoteService = try CompetitionsRemoteService(remoteService: remote)
        return try await remoteService.getCompetition(withId: id, orgId)
    }

    func getCompetitions(_ params: Remote.CompetitionsRequestParams?) async throws -> Remote.CompetitionsContent? {
        logger?.debug("loading competitions from server", with: .competitionsModule)
        let remoteService = try CompetitionsRemoteService(remoteService: remote)
        return try await remoteService.getCompetitions(params)
    }
}
