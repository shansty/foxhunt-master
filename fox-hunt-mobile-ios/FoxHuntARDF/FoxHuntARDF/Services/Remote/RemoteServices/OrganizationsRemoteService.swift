//
//  OrganizationsRemoteService.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 22.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

class OrganizationsRemoteService {
    var remoteService : RemoteService

    @LoggerProperty private var logger: Log?

    init(remoteService: RemoteService) {
        self.remoteService = remoteService
    }

    func getOrganization(byId id: IDType) async throws -> Remote.Organization? {
        var  organization: Remote.Organization?
        do {
            guard var url = try remoteService.authUrl(endPoint: "organizations", apiGroup: nil) else { throw FoxHuntMobileError.internalInconsistency
            }

            url = url.appendingPathExtension("\(id)") // set Organisation ID

            guard let orgData = try await remoteService.sendGetRequest(to: url) else { throw FoxHuntMobileError.networkError }
            logger?.debug("Got response: \n\(String(data: orgData, encoding: .utf8) ?? "<Unknown>")", with: .remote)

            do {
                organization = try remoteService.jsonDecoderWithDates.decode(Remote.Organization.self, from: orgData)
                return organization
            } catch {
                logger?.error("Error: \(error.localizedDescription)", with: .remote)
                throw FoxHuntMobileError.parsingError
            }
        } catch {
            logger?.error("Error: \(error.localizedDescription)", with: .remote)
            throw error
        }
    }
}
