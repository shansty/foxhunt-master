//
//  LoggerProperty.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 19.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

@propertyWrapper
struct LoggerProperty {
    private(set) var logger: Log?

    var wrappedValue: Log? {
        get { return logger }
        set { logger = LogImpl.shared }
    }

    init(wrappedValue: Log?) {
        self.wrappedValue = wrappedValue
    }
}
