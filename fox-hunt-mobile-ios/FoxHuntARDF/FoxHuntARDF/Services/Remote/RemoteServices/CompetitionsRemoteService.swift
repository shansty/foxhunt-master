//
//  CompetitionsRemoteService.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 22.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

class CompetitionsRemoteService {
    var remoteService : RemoteService

    @LoggerProperty private var logger: Log?

    init(remoteService: RemoteService) {
        self.remoteService = remoteService
        self.logger = logger
    }

    func getCompetition(withId id: IDType, _ orgId: IDType?) async throws -> Remote.Competition? {

        func addQueryParams(to baseUrl: inout URL, id cid: IDType, _ orgId: IDType?) throws {
            guard var queryParams = URLComponents(url: baseUrl.appendingPathComponent("\(cid)"),
                                                  resolvingAgainstBaseURL: false)
            else { throw FoxHuntMobileError.internalInconsistency }

            if let orgId {
                queryParams.queryItems = [ URLQueryItem(name: "id", value: "\(orgId)")]
            }

            if let queryParamUrl = queryParams.url {
                baseUrl = queryParamUrl
            }
            return
        }

        guard var url = try remoteService.authUrl(endPoint: "competitions", apiGroup: nil)
        else { throw FoxHuntMobileError.internalInconsistency }

        try addQueryParams(to: &url, id: id, orgId)

        guard let compData = try await remoteService.sendGetRequest(to: url) else {
            throw FoxHuntMobileError.networkError
        }

        logger?.debug("Got response: \n\(String(data: compData, encoding: .utf8) ?? "<Unknown>")", with: .remote)

        var res: Remote.Competition?

        do {
            guard let compet = try remoteService.jsonDecoderWithDates.decode(Remote.Competition?.self, from: compData) else {
                throw FoxHuntMobileError.parsingError }
            res = compet
        } catch let DecodingError.dataCorrupted(context) {
            logger?.error("Error: \(context)", with: .remote)
        } catch let DecodingError.keyNotFound(key, context) {
            logger?.error("Error: '\(key)' not found: \(context.debugDescription)", with: .remote)
            logger?.error("       codingPath: '\(context.codingPath)'", with: .remote)
        } catch let DecodingError.valueNotFound(value, context) {
            logger?.error("Error: '\(value)' not found: \(context.debugDescription)", with: .remote)
            logger?.error("       codingPath: '\(context.codingPath)'", with: .remote)
        } catch let DecodingError.typeMismatch(type, context) {
            logger?.error("Type '\(type)' mismatch: \(context.debugDescription)", with: .remote)
            logger?.error("     codingPath: '\(context.codingPath)'", with: .remote)
        } catch {
            logger?.error("Error: \(error.localizedDescription)", with: .remote)
            throw error
        }

        return res
    }

    func getCompetitions(_ params: Remote.CompetitionsRequestParams? ) async throws -> Remote.CompetitionsContent? {
        func addCompetitionsParams(_ params: Remote.CompetitionsRequestParams?, to baseURL: inout URL) {
            typealias CompReqPars = Remote.CompetitionsRequestParams

            func setQueryParam<T>( _ param: KeyPath<Remote.CompetitionsRequestParams, T?>,
                                   with name: String,
                                   from req: Remote.CompetitionsRequestParams,
                                   to comps: inout URLComponents) {
                guard let item = req[keyPath: param] else { return }
                let qItem = URLQueryItem(name: name, value: "\(item)")
                comps.queryItems?.append(qItem)
            }

            func setQueryParam<T: Sequence>( _ param: KeyPath<Remote.CompetitionsRequestParams, T?>,
                                             with name: String,
                                             from req: Remote.CompetitionsRequestParams,
                                             to comps: inout URLComponents) {
                guard let seqItems = req[keyPath: param] else { return }
                seqItems.forEach { item in
                    let qItem = URLQueryItem(name: name, value: "\(item)")
                    comps.queryItems?.append(qItem)
                }
            }

            guard let pars = params else { return }
            guard var queryParams = URLComponents(url: baseURL, resolvingAgainstBaseURL: false) else { return }
            queryParams.queryItems = []

            setQueryParam(\CompReqPars.id, with: "id", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.name, with: "name", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.offset, with: "offset", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.pageNumber, with: "pageNumber", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.pageSize, with: "pageSize", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.paged, with: "paged", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.projection, with: "projection", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.sortSorted, with: "sort.sorted", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.sortUnsorted, with: "sort.unsorted", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.startDate?.day, with: "startDate.day", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.startDate?.month, with: "startDate.month", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.startDate?.year, with: "startDate.year", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.statuses, with: "statuses", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.unpaged, with: "unpaged", from: pars, to: &queryParams)
            setQueryParam(\CompReqPars.upcoming, with: "upcoming", from: pars, to: &queryParams)

            if let queryParamsUrl = queryParams.url {
                baseURL = queryParamsUrl
            }
        }

        var result: Remote.CompetitionsContent?

        do {
            guard var url = try remoteService.authUrl(endPoint: "competitions", apiGroup: nil) else {
                throw FoxHuntMobileError.internalInconsistency
            }
            addCompetitionsParams(params, to: &url)

            guard let compData = try await remoteService.sendGetRequest(to: url) else { throw FoxHuntMobileError.networkError }

            logger?.debug("Got response: \n\(String(data: compData, encoding: .utf8) ?? "<Unknown>")", with: .remote)

            guard let competitions = try remoteService.jsonDecoderWithDates.decode(Remote.CompetitionsContent?.self,
                                                                                   from: compData) else {
                throw FoxHuntMobileError.parsingError }

            result = competitions
        } catch {
            logger?.error("Error: \(error)", with: .remote)
            throw error
        }

        return result
    }
}
