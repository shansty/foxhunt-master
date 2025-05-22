//
//  HelpRemoteService.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 22.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

class HelpRemoteService {
    var remoteService : RemoteService

    @LoggerProperty private var logger: Log?

    init(remoteService: RemoteService) {
        self.remoteService = remoteService
    }

    func getHelpContent() async throws -> [HelpDTO]? {

        var helpContent: [HelpDTO] = []

        if helpContent.isEmpty {
            do {
                guard let url = try remoteService.authUrl(endPoint: ApiGroup.helpContent.rawValue, apiGroup: nil) else { throw FoxHuntMobileError.internalInconsistency
                }
                guard let helpContentData = try await remoteService.sendGetRequest(to: url) else {
                    throw FoxHuntMobileError.networkError
                }
                logger?.debug("Got response: \n\(String(data: helpContentData, encoding: .utf8) ?? "<Unknown>")",
                              with: .remote)

                do {
                    helpContent = try remoteService.jsonDecoderWithDates.decode([HelpDTO].self, from: helpContentData)
                    LightweightCacher.save(helpContent, filename: "helpContent")
                    return helpContent
                } catch {
                    logger?.error("Error: \(error.localizedDescription)", with: .remote)
                    throw FoxHuntMobileError.parsingError
                }
            } catch {
                logger?.error("Error: \(error.localizedDescription)", with: .remote)
                throw error
            }
        } else {
            return helpContent
        }
    }
}
