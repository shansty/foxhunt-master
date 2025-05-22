//
//  UserSetupModule.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 31.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import os
import SwiftUI

final class UserSetupModule: ModuleInitializer {
    typealias Presenter = UserSetupPresenterImpl
    typealias Interactor = UserSetupInteractorImpl
    typealias SomeView = UserSetupView

    var view: UserSetupView?

    init() { }

    func initialize(_ services: Services) -> UserSetupView? {
        let presenter = UserSetupPresenterImpl(services: services)
        self.view = UserSetupView(presenter: presenter, state: presenter.viewState)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = UserSetupInteractorImpl(services: services)
        return self.view
    }

    func initialize(_ services: Services, navigationController: UINavigationController) -> UserSetupView? {
        let presenter = UserSetupPresenterImpl(services: services, navigationController: navigationController)
        self.view = UserSetupView(presenter: presenter, state: presenter.viewState)
        self.view?.presenter = presenter
        self.view?.presenter.router?.navigationController = navigationController
        self.view?.presenter.interactor = UserSetupInteractorImpl(services: services)
        return self.view
    }
}
