//
//  OptionSet+DecodeFromStrings.swift
//  FoxHuntARDF
//
//  Created by itechart on 30/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

protocol OptionSetStringInitializable {
    init?(stringValue: String)
}

extension OptionSet {
    static func decode<T>(from strings: [String]) -> T where T: OptionSet, T: OptionSetStringInitializable {
        var options: T = []
        strings.forEach { str in
            if let option = T(stringValue: str) {
                options.formUnion(option)
            }
        }

        return options
    }
}
