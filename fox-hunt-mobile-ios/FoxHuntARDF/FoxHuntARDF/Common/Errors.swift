//
//  Errors.swift
//  FoxHuntARDF
//
//  Created by itechart on 12/05/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

enum FoxHuntMobileError: Error {
    case internalInconsistency
    case startingServiceError
    case serviceNotStarted
    case restrictedFunctionality
    case networkError
    case networkBadRequest
    case networkForbidden
    case networkUnauthorized
    case networkNotFound
    case parsingError
    case userAlreadyExistsConflict
    case internalServerError
}

extension FoxHuntMobileError: LocalizedError {
    var errorDescription: String? {
        get {
            switch self {
            case .internalInconsistency:
                return NSLocalizedString("Internal inconsistency found.", comment: "Internal logic error")
            case .startingServiceError:
                return NSLocalizedString("Couldn't start service.", comment: "Internal functionality")
            case .serviceNotStarted:
                return NSLocalizedString("Service isn't started.", comment: "")
            case .restrictedFunctionality:
                return NSLocalizedString("Restricted functionality - you shouldn't have access to it.", comment: "")
            case .networkError:
                return NSLocalizedString("Network error occurred.", comment: "")
            case .networkBadRequest:
                return NSLocalizedString("Bad network request.", comment: "")
            case .networkForbidden:
                return NSLocalizedString("Forbidden access. Check your permissions.", comment: "")
            case .networkUnauthorized:
                return NSLocalizedString("Unauthorized request.\nThe provided credentials may be incorrect.", comment: "")
            case .networkNotFound:
                return NSLocalizedString("Network resource is not found.", comment: "")
            case .parsingError:
                return NSLocalizedString("Couldn't parse answer from server.", comment: "")
            case .userAlreadyExistsConflict:
                return NSLocalizedString("The provided user already exists.", comment: "")
            case .internalServerError:
                return NSLocalizedString("Internal Server Error. Please, try again.", comment: "")
            }

        }
    }
}

extension HTTPStatusCode {
    var foxHuntError: FoxHuntMobileError? {
        switch self {
        case .badRequest:
            return .networkBadRequest
        case .unauthorized:
            return .networkUnauthorized
        case .forbidden:
            return .networkForbidden
        case .notFound:
            return .networkNotFound
        case .internalServerError:
            fallthrough
        case .conflict:
            return .userAlreadyExistsConflict
        case .OK, .created:
            return nil
        }
    }
}

enum ValidationError: String, RawRepresentable {
    case lackOfSymbols = "Ooops.. This field must contain more than 5 symbols. Please try again."
    case invalidSymbols = "We need a real email here :)"
    case longString = "Ooops.. This field is too long. Please, try again."
}
