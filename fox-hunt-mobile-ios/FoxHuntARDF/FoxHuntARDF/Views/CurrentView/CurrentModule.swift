//
//  CurrentModule.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 13.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

final class CurrentModule: ModuleInitializer {
    typealias Presenter = CurrentPresenterImpl
    typealias Interactor = CurrentInteractorImpl
    typealias SomeView = CurrentView

    var view: CurrentView?

    init() {}

    func initialize(_ services: Services) -> CurrentView? {
        let presenter = CurrentPresenterImpl(services: services)
        self.view = CurrentView(presenter: presenter, model: CurrentViewModel(isActive: false, competitionName: ""))
        self.view?.presenter.interactor = CurrentInteractorImpl(services: services)
        return view
    }

    func initialize(_ services: Services, navigationController: UINavigationController, model: CurrentViewModel, gameLevel: GameLevel) -> CurrentView? {
        let presenter = CurrentPresenterImpl(services: services, navigationController: navigationController, gameLevel: gameLevel)
        self.view = CurrentView(presenter: presenter, model: model)
        self.view?.presenter.interactor = CurrentInteractorImpl(services: services)
        return view
    }
}
