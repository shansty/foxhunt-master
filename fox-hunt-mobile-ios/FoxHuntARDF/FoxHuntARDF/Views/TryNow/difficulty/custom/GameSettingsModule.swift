//
//  GameSettingsModule.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 12.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import UIKit

final class GameSettingsModule: ModuleInitializer {
    typealias Presenter = GameSettingsPresenterImpl
    typealias Interactor = GameSettingsInteractorImpl
    typealias SomeView = GameSettingsView

    var view: GameSettingsView?

    init() {}

    func initialize(_ services: Services) -> GameSettingsView? {
        let presenter = GameSettingsPresenterImpl(services: services)
        self.view = GameSettingsView(presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = GameSettingsInteractorImpl(services: services)
        return self.view
    }

    func initialize(_ services: Services, navigationController: UINavigationController) -> GameSettingsView? {
        let presenter = GameSettingsPresenterImpl(services: services, navigationController: navigationController)
        self.view = GameSettingsView(presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = GameSettingsInteractorImpl(services: services)
        return self.view
    }
}
