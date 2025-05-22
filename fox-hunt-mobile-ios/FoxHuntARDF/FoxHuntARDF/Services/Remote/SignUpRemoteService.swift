//
//  SignUpRemoteService.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 06.02.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation

class SignUpRemoteService {

    var remoteService : RemoteService

    @LoggerProperty private var logger: Log?
    private var tokenService = TokenService()

    init(remoteService: RemoteService) {
        self.remoteService = remoteService
    }

    func performSingUp(with userInfo: Remote.UserSetupRequest) async throws -> Bool {
        guard var url = URL(string: ConstantsAPI.signUp) else {
            throw FoxHuntMobileError.internalInconsistency
        }

        let data = try await remoteService.sendRegistrationRequest(to: &url, request: userInfo)

        do {
            guard let resp: Remote.UserSetupResponse = try decodeResponseData(data) else { return false }
            if let id = resp.result?.userId {
                saveUserId(id)
            }
        } catch {
            logger?.error("Error: \(error.localizedDescription)", with: .remote)
            throw FoxHuntMobileError.parsingError
        }
        return true
    }

    func verifyEmailCode(with verificationInfo: Remote.EmailVerificationRequest) async throws -> Bool {
        guard var url = URL(string: ConstantsAPI.emailVerification) else {
            throw FoxHuntMobileError.internalInconsistency
        }

        let data = try await remoteService.sendRegistrationRequest(to: &url, request: verificationInfo)

        do {
            guard let remoteToken = try decodeResponseTokens(data) else { return false }
            return remoteService.saveAuthTokens(remoteToken)
        } catch {
            logger?.error("Error: \(error.localizedDescription)", with: .remote)
            throw FoxHuntMobileError.parsingError
        }
    }

    func resendCode(with email: String) async throws -> Bool {
        guard var url = URL(string: ConstantsAPI.resendCode) else {
            throw FoxHuntMobileError.internalInconsistency
        }

        let data = try await remoteService.sendRegistrationRequest(to: &url, request: email)

        do {
            guard let remoteToken = try decodeResponseTokens(data) else { return false }
            return remoteService.saveAuthTokens(remoteToken)
        } catch {
            logger?.error("Error: \(error.localizedDescription)", with: .remote)
            throw FoxHuntMobileError.parsingError
        }
    }

    private func decodeResponseTokens(_ data: Data) throws -> Remote.Token?{
        logger?.debug("Decoding: \(String(data: data, encoding: String.Encoding.utf8) ?? "<BAD_STRING>")",
                      with: .remote)
        let token = try JSONDecoder().decode(Remote.Token.self, from: data)
        logger?.debug("Got \(String(describing: token))", with: .remote)
        return token
    }

    private func decodeResendCodeRequest(_ data: Data) throws -> Remote.ResendCodeResponse?{
        logger?.debug("Decoding: \(String(data: data, encoding: String.Encoding.utf8) ?? "<BAD_STRING>")",
                      with: .remote)
        let code = try JSONDecoder().decode(Remote.ResendCodeResponse.self, from: data)
        logger?.debug("Got \(String(describing: code))", with: .remote)
        return code
    }

    private func decodeResponseData(_ data: Data) throws -> Remote.UserSetupResponse? {
        logger?.debug("Decoding: \(String(data: data, encoding: String.Encoding.utf8) ?? "<BAD_STRING>")",
                      with: .remote)
        let response = try JSONDecoder().decode(Remote.UserSetupResponse.self, from: data)
        logger?.debug("Got \(String(describing: response))", with: .remote)
        return response
    }

    private func saveUserId(_ id: String) {
        UserDefaults.standard.set(id, forKey: "userId")
        if tokenService.saveTokenToStorage(token: id, tokenName: "userId") {
            logger?.info("Sucessfully saved user id to the storage", with: .remote)
        } else  {
            logger?.info("Failed to save user id to the storage", with: .remote)
        }
    }
}
