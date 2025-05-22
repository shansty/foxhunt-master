//
//  MainInteractor.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 27.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol MainInteractorProtocol: ModuleInteractor {
    func loadData(competitionsModule: CompetitionsModule, settingsModule: SettingsModule)
}

class MainInteractor: MainInteractorProtocol {
    var presenter: MainPresenter?
    typealias Presenter = MainPresenter

    @ServicesProperty var services: Services?

    required init() {
        // empty
    }

    required init(services: Services?) {
        self.services = services
    }

    func loadData(competitionsModule: CompetitionsModule, settingsModule: SettingsModule) {
        competitionsModule.setNeedsUpdate()
        settingsModule.downloadHelpContent()
    }
}
