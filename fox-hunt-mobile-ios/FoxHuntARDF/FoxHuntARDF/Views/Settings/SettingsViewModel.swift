//
//  SettingsViewModel.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 12.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

class SettingsViewModel: ObservableObject {
    @Published var helpContent: [HelpDTO]

    init(helpContent: [HelpDTO]) {
        self.helpContent = helpContent
    }
}
