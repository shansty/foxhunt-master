//
//  LoginModule.swift
//  FoxHuntARDF
//
//  Created by itechart on 14/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import os
import SwiftUI

extension OSLog {
    static var loginModule = OSLog(subsystem: Bundle.main.bundleIdentifier ?? "", category: "LoginModule")
}

final class LoginModule: ModuleInitializer {
    typealias Presenter = LoginPresenterImpl
    typealias Interactor = LoginInteractorImpl
    typealias SomeView = LoginView

    var view: LoginView?

    init() {}

    func initialize(_ services: Services) -> LoginView? {
        let presenter = LoginPresenterImpl(services: services)
        self.view = LoginView(presenter: presenter,
                              model: LoginViewModel(email: "", pass: "", domain: ""),
                              state: presenter.viewState)
        self.view?.presenter.interactor = LoginInteractorImpl(services: services)
        return view
    }

    func initialize(_ services: Services, navigationController: UINavigationController) -> LoginView? {
        let presenter = LoginPresenterImpl(services: services, navigationController: navigationController)
        #if DEBUG
        self.view = LoginView(presenter: presenter, model: .testValue, state: presenter.viewState)
        #else
        self.view = LoginView(presenter: presenter,
                              model: LoginViewModel(email: "", pass: "", domain: ""),
                              state: presenter.viewState)
        #endif
        self.view?.presenter.interactor = LoginInteractorImpl(services: services)
        return view
    }
}
