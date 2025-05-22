//
//  MainModile.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 31.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import UIKit

protocol MainModuleIn {
}

final class MainModule: ModuleInitializer {
    typealias Presenter = MainPresenter
    typealias Interactor = MainInteractor
    typealias SomeView = MainView

    var view: MainView?

    init() {
    }

    func initialize(_ services: Services) -> MainView? {
        let presenter = MainPresenter(services: services)
        self.view = MainView(presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = MainInteractor(services: services)
        return self.view
    }

    func initialize(_ services: Services) -> MainViewController {
        let presenter = MainPresenter(services: services)
        let viewController = MainViewController(presenter: presenter)
        viewController.presenter.interactor = MainInteractor(services: services)
        return viewController
    }
}

