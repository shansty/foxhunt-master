//
//  TokenService.swift
//  FoxHuntARDF
//
//  Created by Ivy on 29.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

enum TokenType: String {
    case accessToken = "access-token"
    case refreshToken = "refresh-token"
}

class TokenService {

    @LoggerProperty private var logger: Log?
    private let genericPwdQueryable = GenericPasswordQueryable(service: "RemoteService")

    func saveTokenToStorage(token: String, tokenName: String) -> Bool {
        let secureStoreWithGenericPwd = SecureStore(secureStoreQueryable: genericPwdQueryable)
        do {
            try secureStoreWithGenericPwd.setValue(token, for: tokenName)
            guard let _ = getTokenFromStorage(tokenName: tokenName) else {
                logger?.info("Failed to get saved token from the keychain storage", with: .remote)
                return false
            }
            return true
        } catch {
            logger?.info("Failed to save token to the keychain storage", with: .remote)
            return false
        }
    }

    func getTokenFromStorage(tokenName: String) -> String? {
        let secureStoreWithGenericPwd = SecureStore(secureStoreQueryable: genericPwdQueryable)
        do {
            return try secureStoreWithGenericPwd.getValue(for: tokenName)
        } catch {
            logger?.info("Failed to get saved token from the keychain storage", with: .remote)
            return nil
        }
    }

    func removeAuthTokenFromStorage(tokenName: String) -> Bool {
        let secureStoreWithGenericPwd = SecureStore(secureStoreQueryable: genericPwdQueryable)
        do {
            try secureStoreWithGenericPwd.removeValue(for: tokenName)
            logger?.info("Sucessfully removed token '\(tokenName)' from the storage", with: .remote)
            return true
        } catch {
            logger?.info("Failed to remote token '\(tokenName)' from the keychain storage", with: .remote)
            return false
        }
    }

    func isRemoveAllInfoFromStorage() -> Bool {
        let secureStoreWithGenericPwd = SecureStore(secureStoreQueryable: genericPwdQueryable)
        do {
            try secureStoreWithGenericPwd.removeAllValues()
            return true
        } catch {
            logger?.info("Failed to remote data from the keychain storage", with: .remote)
            return false
        }
    }
}

extension TokenService {

    static var authNeeded: Bool {
        get {
            let tokenService = TokenService()
            let accessTokenStartDate = Date(timeIntervalSince1970: UserDefaults.standard.double(forKey: "accessTokenStartDate"))

            if (tokenService.getTokenFromStorage(tokenName: TokenType.accessToken.rawValue) == nil)
                || (tokenService.getTokenFromStorage(tokenName: TokenType.refreshToken.rawValue) == nil)
                || Date().timeIntervalSince(accessTokenStartDate) > .seconds(1800) {
                return true
            }
            return false
        }
    }
}
