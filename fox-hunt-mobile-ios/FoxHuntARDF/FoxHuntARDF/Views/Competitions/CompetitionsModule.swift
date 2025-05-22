//
//  CompetitionsModule.swift
//  FoxHuntARDF
//
//  Created by itechart on 26/09/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import os
import SwiftUI

extension OSLog {
    static var competitionsModule = OSLog(subsystem: Bundle.main.bundleIdentifier ?? "", category: "CompetitionsModule")
}

protocol CompetitionsModuleIn {
    func setNeedsUpdate()
}

final class CompetitionsModule: ModuleInitializer {
    typealias Presenter = CompetitionsPresenterImpl
    typealias Interactor = CompetitionsInteractorImpl
    typealias SomeView = CompetitionsView

    var view: CompetitionsView?

    init() {
    }

    func initialize(_ services: Services) -> CompetitionsView? {
        let presenter = CompetitionsPresenterImpl(services: services)
        self.view = CompetitionsView(presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = CompetitionsInteractorImpl(services: services)
        return self.view
    }
}

extension CompetitionsModule: CompetitionsModuleIn {
    func setNeedsUpdate() {
        self.view?.presenter.setNeedsUpdate()
    }
}
