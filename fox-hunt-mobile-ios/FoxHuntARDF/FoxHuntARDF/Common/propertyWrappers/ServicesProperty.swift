//
//  ServicesProperty.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 19.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

@propertyWrapper
struct ServicesProperty {
    private(set) var services: Services?

    var wrappedValue: Services? {
        get { return services }
        set { services = newValue }
    }

    init(wrappedValue: Services?) {
        self.wrappedValue = wrappedValue
    }
}
