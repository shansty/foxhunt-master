//
//  GameSettingsPresenter.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 12.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol GameSettingsPresenter : ModulePresenter {
    var services: Services? { set get }
}

class GameSettingsPresenterImpl: GameSettingsPresenter , ObservableObject{

    typealias Interactor = GameSettingsInteractorImpl
    var interactor: GameSettingsInteractorImpl?

    weak var navigationController: UINavigationController?
    private var currentModule = CurrentModule()

    @LoggerProperty var logger: Log?

    var services: Services?
    var router: CommonRouter? = MainRouter.shared
    private var gameLevel: GameLevel?

    required init() {}

    init(services: Services, navigationController: UINavigationController){
        self.services = services
        self.navigationController = navigationController
    }

    func goToTryGameView(with gameLevel: GameLevel) {
        self.gameLevel = gameLevel
        DispatchQueue.main.async { [weak self] in
            let currentVC = UIHostingController(rootView: self?.showCurrentView())
            self?.navigationController?.setViewControllers([currentVC], animated: true)
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
