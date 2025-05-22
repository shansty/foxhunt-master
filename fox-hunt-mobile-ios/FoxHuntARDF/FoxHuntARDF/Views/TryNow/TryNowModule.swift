//
//  TryNowModule.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 08.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import UIKit

final class TryNowModule: ModuleInitializer {
    typealias Presenter = TryNowPresenterImpl
    typealias Interactor = TryNowInteractorImpl
    typealias SomeView = TryNowView

    var view: TryNowView?

    init() {}

    func initialize(_ services: Services) -> TryNowView? {
        let presenter = TryNowPresenterImpl(services: services)
        self.view = TryNowView(presenter: presenter, state: presenter.viewState)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = TryNowInteractorImpl(services: services)
        return self.view
    }

    func initialize(_ services: Services, navigationController: UINavigationController) -> TryNowView? {
        let presenter = TryNowPresenterImpl(services: services, navigationController: navigationController)
        self.view = TryNowView(presenter: presenter, state: presenter.viewState)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = TryNowInteractorImpl(services: services)
        return self.view
    }
}
