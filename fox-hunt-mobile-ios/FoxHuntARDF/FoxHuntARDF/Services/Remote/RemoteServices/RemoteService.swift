//
//  Remote.swift
//  FoxHuntARDF
//
//  Created by itechart on 15/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

protocol RemoteService : Service {

    var jsonDecoderWithDates : JSONDecoder { get }

    func authUrl(endPoint: String, apiGroup: ApiGroup?) throws -> URL?

    func saveAuthTokens(_ remoteToken: Remote.Token?) -> Bool

    func sendPostRequest(to url: inout URL, body: Data) async throws -> Data?

    func sendGetRequest(to url: URL) async throws -> Data?

    func sendRequest<T>(url: inout URL, request: T?) async throws -> Data where T : Encodable

    func sendRegistrationRequest<T>(to url: inout URL, request: T?) async throws -> Data where T : Encodable
}

extension RemoteService {

    var jsonDecoderWithDates: JSONDecoder {
        get {
            let fmt = DateFormatter()
            fmt.timeZone = TimeZone.current // <- You may need to change this
            fmt.locale = Locale(identifier: "en_US_POSIX")
            fmt.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
            let dec = JSONDecoder()
            dec.dateDecodingStrategy = .formatted(fmt)
            return dec
        }
    }
}

final class RemoteServiceImpl: RemoteService {

    var services: Services

    func start() throws {}

    func stop() -> Error? { nil }

    var started: Bool = false

    private var tokenService = TokenService()

    @LoggerProperty private var logger: Log?

    init(_ services: Services) {
        self.services = services
    }

    func authUrl(endPoint: String, apiGroup: ApiGroup?) throws -> URL? {
        guard let config = services.resolve(ConfigService.self) as? ConfigService,
              let base = config.remoteBaseURL
        else {
            throw FoxHuntMobileError.internalInconsistency
        }
        var url =  base.apiPrefix().version(config.remoteAPIVersion)
        if let apiGroup { url = url.apiGroup(apiGroup) }

        return url.endPoint(endPoint)
    }

    func sendRequest<T>(url: inout URL, request: T?) async throws -> Data where T : Encodable  {
        let data = try JSONEncoder().encode(request)
        logger?.debug("Encoded to: \(String(data: data, encoding: String.Encoding.utf8) ?? "<BAD_STRING>")",
                      with: .remote)
        guard let authData = try await sendPostRequest(to: &url, body: data) else {
            throw FoxHuntMobileError.networkError
        }
        return authData
    }

    func saveAuthTokens(_ remoteToken: Remote.Token?) -> Bool {
        guard let token = remoteToken else { return false }

        UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "accessTokenStartDate")

        if tokenService.saveTokenToStorage(token: token.token, tokenName: TokenType.accessToken.rawValue)
            && tokenService.saveTokenToStorage(token: token.refreshToken, tokenName: TokenType.refreshToken.rawValue) {
            logger?.info("Sucessfully saved access and refresh tokens to the storage", with: .remote)
            return true
        }
        return false
    }

    func sendPostRequest(to url: inout URL, body: Data) async throws -> Data? {
        func isLoginAuthRequest(_ url: URL) -> Bool {
            [ConstantsAPI.authenticate, ConstantsAPI.authentication, ConstantsAPI.refresh, ConstantsAPI.authenticationLocal].map{$0.replacingOccurrences(of: "/", with: "")} .contains(url.lastPathComponent) }

        func isRefreshingAuthRequest(_ url: URL) -> Bool {
            ConstantsAPI.refresh.replacingOccurrences(of: "/", with: "").contains(url.lastPathComponent)
        }

        if isRefreshingAuthRequest(url) {
            try setRefreshToken(to: &url)
        } // add refresh-token to url

        logger?.info("Sending POST to \(url.absoluteString)", with: .remote)

        var request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)

        request.httpMethod = "POST"
        request.httpBody = body
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        if !isLoginAuthRequest(url) {
            setBearerAuth(tokenService.getTokenFromStorage(tokenName: TokenType.accessToken.rawValue), for: &request) // add access-token to the header
        }

        let (data, resp) = try await URLSession.shared.data(for: request)

        guard try checkupResponse(resp) else { return nil }
        return data
    }

    func sendGetRequest(to url: URL) async throws -> Data? {
        logger?.info("Sending GET to \(url.absoluteString)", with: .remote)
        var request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)

        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        setBearerAuth(tokenService.getTokenFromStorage(tokenName: TokenType.accessToken.rawValue), for: &request) // add access-token to the header

        let (data, resp) = try await URLSession.shared.data(for: request)

        guard try checkupResponse(resp) else { return nil }
        return data
    }

    func sendRegistrationRequest<T>(to url: inout URL, request: T?) async throws -> Data where T : Encodable {
        let body = try JSONEncoder().encode(request)

        logger?.debug("Encoded to: \(String(data: body, encoding: String.Encoding.utf8) ?? "<BAD_STRING>")",
                      with: .remote)
        logger?.info("Sending POST to \(url.absoluteString)", with: .remote)

        var request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)

        request.httpMethod = "POST"
        request.httpBody = body
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        let (data, resp) = try await URLSession.shared.data(for: request)

        guard try checkupResponse(resp) else { throw FoxHuntMobileError.networkError }
        return data
    }

    // MARK: - Private methods

    private func setBearerAuth(_ token: String?, for request: inout URLRequest) {
        guard let token else { return }
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }

    private func setRefreshToken(to url: inout URL) throws {
        guard var comps = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            throw FoxHuntMobileError.internalInconsistency }
        let refreshItem = URLQueryItem(name: "refreshToken", value: tokenService.getTokenFromStorage(tokenName: TokenType.refreshToken.rawValue))

        if comps.queryItems == nil { comps.queryItems = [] }

        comps.queryItems?.append(refreshItem)
        if let compsUrl = comps.url {
            url = compsUrl
        }
    }

    private func checkupResponse(_ response: URLResponse?) throws -> Bool {
        if let httpResponse = response as? HTTPURLResponse {
            guard let status = HTTPStatusCode(rawValue: httpResponse.statusCode) else {
                throw FoxHuntMobileError.networkError
            }
            logger?.info("Response status: \(status) for \(httpResponse.url?.absoluteString ?? "<Unknown>")", with: .remote)
            switch status {
            case .OK, .created:
                return true
            case .badRequest:
                throw FoxHuntMobileError.networkBadRequest
            case .unauthorized:
                throw FoxHuntMobileError.networkUnauthorized
            case .forbidden:
                throw FoxHuntMobileError.networkForbidden
            case .notFound:
                throw FoxHuntMobileError.networkNotFound
            case .conflict:
                throw FoxHuntMobileError.userAlreadyExistsConflict
            case .internalServerError:
                throw FoxHuntMobileError.internalInconsistency
            }
        }
        return false
    }
}
