//
//  FieldType.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 01.02.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation

enum FieldType {
    case email
    case password
    case plainField
    case countryField
    case cityField
}

extension FieldType {
    func validation(text: String, presenter: UserSetupPresenterImpl) -> ValidationError? {
        switch self {
        case .email:
            return presenter.isInvalidEmail(with: text)
        case .password:
            return presenter.isInvalidPassword(with: text)
        case .plainField, .countryField, .cityField:
            return presenter.isInvalidField(with: text)
        }
    }
}
