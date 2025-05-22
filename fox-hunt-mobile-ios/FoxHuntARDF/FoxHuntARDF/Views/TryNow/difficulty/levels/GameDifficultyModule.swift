//
//  GameDifficultyModule.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 11.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import UIKit

final class GameDifficultyModule: ModuleInitializer {
    typealias Presenter = GameDifficultyPresenterImpl
    typealias Interactor = GameDifficultyInteractorImpl
    typealias SomeView = GameDifficultyView

    var view: GameDifficultyView?

    init() {}

    func initialize(_ services: Services) -> GameDifficultyView? {
        let presenter = GameDifficultyPresenterImpl(services: services)
        self.view = GameDifficultyView(presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = GameDifficultyInteractorImpl(services: services)
        return self.view
    }

    func initialize(_ services: Services, navigationController: UINavigationController) -> GameDifficultyView? {
        let presenter = GameDifficultyPresenterImpl(services: services, navigationController: navigationController)
        self.view = GameDifficultyView(presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = GameDifficultyInteractorImpl(services: services)
        return self.view
    }
}
