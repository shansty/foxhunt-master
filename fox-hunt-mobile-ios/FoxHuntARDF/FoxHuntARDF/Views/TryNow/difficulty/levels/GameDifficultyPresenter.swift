//
//  GameDifficultyPresenter.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 11.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol GameDifficultyPresenter : ModulePresenter {
    var services: Services? { set get }
}

class GameDifficultyPresenterImpl: GameDifficultyPresenter , ObservableObject{

    typealias Interactor = GameDifficultyInteractorImpl
    var interactor: GameDifficultyInteractorImpl?
    var router: CommonRouter? = MainRouter.shared

    weak var navigationController: UINavigationController?
    private var gameLevel: GameLevel?
    private var currentModule = CurrentModule()
    private var gameSettingsModule = GameSettingsModule()

    @LoggerProperty var logger: Log?

    var services: Services?

    required init() {}

    init(services: Services, navigationController: UINavigationController){
        self.services = services
        self.navigationController = navigationController
    }

    func goTryNowGame(with gameLevel: GameLevel) {
        self.gameLevel = gameLevel
        DispatchQueue.main.async { [weak self] in
            let currentVC = UIHostingController(rootView: self?.showCurrentView())
            self?.navigationController?.setViewControllers([currentVC], animated: true)
        }
    }

    func goToCustomGameSettings() {
        DispatchQueue.main.async { [weak self] in
            let currentVC = UIHostingController(rootView: self?.showCustomGameSettingsiew())
            self?.navigationController?.setViewControllers([currentVC], animated: true)
        }
    }

    private func showCustomGameSettingsiew() -> AnyView {
        if let services = services, let navigationController {
            return AnyView(gameSettingsModule.initialize(services, navigationController: navigationController))
        } else {
            return AnyView(EmptyView())
        }
    }
    
    private func showCurrentView() -> AnyView {
        if let services = services, let navigationController, let gameLevel {
            let model = CurrentViewModel(isActive: true, competitionName: self.getTestCompetitionRandomName())
            return AnyView(currentModule.initialize(services,
                                                    navigationController: navigationController,
                                                    model: model,
                                                    gameLevel: gameLevel))
        } else {
            return AnyView(EmptyView())
        }
    }

    private func getTestCompetitionRandomName() -> String {
        let randomInt = Int.random(in: 0..<1000)
        return "\(L10n.competition) \(randomInt)"
    }
}
