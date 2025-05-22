//
//  LoginRemoteService.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 21.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

class LoginRemoteService {

    var remoteService : RemoteService

    private let useHashing = false

    private var tokenService = TokenService()

    @LoggerProperty private var logger: Log?

    init(remoteService: RemoteService) {
        self.remoteService = remoteService
    }

    func performLogIn(with email: String, password: String, domain: String?) async throws -> LoginLogicResult {
        guard var url = URL(string: ConstantsAPI.authentication) else {
            throw FoxHuntMobileError.internalInconsistency
        }

        // FIXME: you must use hash of password
        let request = Remote.AuthRequest(email: email, password: try preparePassword(password), domain: domain)
        let data = try await remoteService.sendRequest(url: &url, request: request)

        let result: Remote.LoginResponse?

        do {
            guard let remote = try decodeResponseData(data) else { return .decodingFailed }
            result = remote
        } catch {
            logger?.error("Error: \(error.localizedDescription)", with: .remote)
            logger?.debug("Error: \(String(describing: error))", with: .remote)
            throw FoxHuntMobileError.parsingError
        }

        if let tokens = result?.token {
            if remoteService.saveAuthTokens(tokens) {
                return .tokenRecieved
            } else {
                return .savingTokensFailed
            }
        }

        if let _ = result?.email {
            return .emailVerificationRequired
        }

        throw FoxHuntMobileError.internalInconsistency

    }

    func performLogOut() async throws -> Bool {
        if tokenService.removeAuthTokenFromStorage(tokenName: TokenType.accessToken.rawValue) && tokenService.removeAuthTokenFromStorage(tokenName: TokenType.refreshToken.rawValue) {
            logger?.info("Sucessfully removed access and refresh tokens from the storage.", with: .loginModule)
            return true
        } else {
            logger?.info("Failed to perform log out", with: .loginModule)
            throw FoxHuntMobileError.internalInconsistency
        }

    }

    func updateAccessToken() async throws -> LoginLogicResult {
        guard var url = try remoteService.authUrl(endPoint: ConstantsAPI.refresh, apiGroup: .login) else {
            throw FoxHuntMobileError.internalInconsistency
        }
        guard let refreshToken = tokenService.getTokenFromStorage(tokenName: TokenType.refreshToken.rawValue) else {
            throw FoxHuntMobileError.internalInconsistency
        }
        let request = Remote.AuthRefreshToken(refreshToken: refreshToken)
        let data = try await remoteService.sendRequest(url: &url, request: request)

        let result: Remote.LoginResponse?

        do {
            guard let remote = try decodeResponseData(data) else { return .decodingFailed }
            result = remote
        } catch {
            logger?.error("Error: \(error.localizedDescription)", with: .remote)
            logger?.debug("Error: \(String(describing: error))", with: .remote)
            throw FoxHuntMobileError.parsingError
        }

        if let tokens = result?.token {
            if remoteService.saveAuthTokens(tokens) {
                return .tokenRecieved
            } else {
                return .savingTokensFailed
            }
        }

        if let _ = result?.email {
            return .emailVerificationRequired
        }

        throw FoxHuntMobileError.internalInconsistency
    }

    //MARK: - Private functions

    private func decodeResponseData(_ data: Data) throws -> Remote.LoginResponse? {
        logger?.debug("Decoding: \(String(data: data, encoding: String.Encoding.utf8) ?? "<BAD_STRING>")",
                      with: .remote)
        let result = try JSONDecoder().decode(Remote.LoginResponse.self, from: data)
        logger?.debug("Got \(String(describing: result))", with: .remote)
        return result
    }

    private func saveUserData(with response: RemoteBasicAuthResponse) throws {
        guard let usr = remoteService.services.resolve(UserService.self) as? UserService else {
            throw FoxHuntMobileError.internalInconsistency
        }
        usr.userRole = response.roles
        usr.email = EmailAddress(rawValue: response.email)
    }

    private func preparePassword(_ password: String) throws -> String {
        guard useHashing else { return password }
        guard let service = remoteService.services.resolve(ConfigService.self) as? ConfigService else {
            throw FoxHuntMobileError.internalInconsistency
        }
        return password.salted(with: service.hostname).SHA3shed()
    }
}

