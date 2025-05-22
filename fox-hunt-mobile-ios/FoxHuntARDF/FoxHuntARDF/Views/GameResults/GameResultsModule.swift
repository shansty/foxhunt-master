//
//  GameResultsModule.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 02.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

final class GameResultsModule: ModuleInitializer {
    typealias Presenter = GameResultsPresenterImpl
    typealias Interactor = GameResultsInteractorImpl
    typealias SomeView = GameResultsView

    var view: GameResultsView?

    init() {} 

    func initialize(_ services: Services) -> GameResultsView? {
        let presenter = GameResultsPresenterImpl(services: services)
        self.view = GameResultsView(presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = GameResultsInteractorImpl(services: services)
        return self.view
    }

    func initialize(_ services: Services, navigationController: UINavigationController, gameResultsModel: GameResultsModel) -> GameResultsView? {
        let presenter = GameResultsPresenterImpl(services: services, navigationController: navigationController)
        self.view = GameResultsView(presenter: presenter, gameResultsModel: gameResultsModel)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = GameResultsInteractorImpl(services: services)
        return self.view
    }
}
