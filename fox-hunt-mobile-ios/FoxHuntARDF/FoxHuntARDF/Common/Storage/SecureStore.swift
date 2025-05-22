//
//  SecureStore.swift
//  FoxHuntARDF
//
//  Created by Ivy on 24.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

public protocol SecureStoreQueryable {
    var query: [String: Any] { get }
}

public struct SecureStore {
    let secureStoreQueryable: SecureStoreQueryable

    public init(secureStoreQueryable: SecureStoreQueryable) {
        self.secureStoreQueryable = secureStoreQueryable
    }

    func setValue(_ value: String, for token: String) throws {
        guard let encodedPassword = value.data(using: .utf8) else {
            throw SecureStoreError.string2DataConversionError
        }
        var query = secureStoreQueryable.query
        query[String(kSecAttrAccount)] = token // to execute and append the token we’re looking for.

        var status = SecItemCopyMatching(query as CFDictionary, nil) // return the keychain item that matches the query.

        switch status {
        case errSecSuccess:  // The token already exists. So we replace the existing token’s value
            var attributesToUpdate: [String: Any] = [:]
            attributesToUpdate[String(kSecValueData)] = encodedPassword
            status = SecItemUpdate(query as CFDictionary, attributesToUpdate as CFDictionary)

        case errSecItemNotFound: // The token does not exist yet. So we add this token to the storage
            query[String(kSecValueData)] = encodedPassword
            status = SecItemAdd(query as CFDictionary, nil)
        default:
            throw error(from: status)
        }
    }


    public func getValue(for token: String) throws -> String? {

        // To return all the attributes associated with that specific item and to give you back the unencrypted data as a result
        var query = secureStoreQueryable.query
        query[String(kSecMatchLimit)] = kSecMatchLimitOne
        query[String(kSecReturnAttributes)] = kCFBooleanTrue
        query[String(kSecReturnData)] = kCFBooleanTrue
        query[String(kSecAttrAccount)] = token

        var queryResult: AnyObject?
        let status = withUnsafeMutablePointer(to: &queryResult) {
            SecItemCopyMatching(query as CFDictionary, $0)
        }

        switch status {
        case errSecSuccess: // If the query succeeds, it means that it found an item
            guard
                let queriedItem = queryResult as? [String: Any],
                let passwordData = queriedItem[String(kSecValueData)] as? Data,
                let password = String(data: passwordData, encoding: .utf8)
            else {
                throw SecureStoreError.data2StringConversionError
            }
            return password
        case errSecItemNotFound: // If an item is not found, return a nil value
            return nil
        default:
            throw error(from: status)
        }
    }

    public func removeValue(for token: String) throws {
        var query = secureStoreQueryable.query
        query[String(kSecAttrAccount)] = token

        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw error(from: status)
        }
    }

    public func removeAllValues() throws {
        let query = secureStoreQueryable.query

        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw error(from: status)
        }
    }

    private func error(from status: OSStatus) -> SecureStoreError {
        let message = SecCopyErrorMessageString(status, nil) as String? ?? NSLocalizedString("Unhandled Error", comment: "")
        return SecureStoreError.unhandledError(message: message)
    }
}
