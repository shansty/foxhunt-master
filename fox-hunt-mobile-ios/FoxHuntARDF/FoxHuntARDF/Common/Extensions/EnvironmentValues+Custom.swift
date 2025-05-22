//
//  EnvironmentValues+Custom.swift
//  FoxHuntARDF
//
//  Created by itechart on 08/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

private struct ServicesEnvironmentKey: EnvironmentKey {
    static var defaultValue: Services = ServicesImpl()
}

extension EnvironmentValues {
	var	services: Services {
		get { self[ServicesEnvironmentKey.self] }
		set { self[ServicesEnvironmentKey.self] = newValue }
	}
}

extension View {
	func services(_ services: Services) -> some View {
		environment(\.services, services)
	}
}
