//
//  HelpModule.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 12.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import os
import SwiftUI

final class SettingsModule: ModuleInitializer {
    typealias Presenter = SettingsPresenter
    typealias Interactor = SettingsInteractor
    typealias SomeView = SettingsView
    
    var view: SettingsView?
    
    init() { }
    
    func initialize(_ services: Services) -> SettingsView? {
        let presenter = SettingsPresenter(services: services)
        self.view = SettingsView(presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = SettingsInteractor(services: services)
        return self.view
    }
    
    func downloadHelpContent() {
        self.view?.presenter.getHelpContent()
    }
}

extension OSLog {
    static var settingsModule = OSLog(subsystem: Bundle.main.bundleIdentifier ?? "", category: "HelpContent")
}
