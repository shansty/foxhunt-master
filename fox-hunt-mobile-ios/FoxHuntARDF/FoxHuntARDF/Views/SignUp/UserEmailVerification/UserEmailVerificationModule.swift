//
//  UserEmailVerificationModule.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 03.02.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import os
import SwiftUI

final class UserEmailVerificationModule: ModuleInitializer {
    typealias Presenter = UserEmailVerificationPresenterImpl
    typealias Interactor = UserEmailVerificationInteractorImpl
    typealias SomeView = UserEmailVerificationView

    var view: UserEmailVerificationView?

    init() { }

    func initialize(_ services: Services) -> UserEmailVerificationView? {
        let presenter = UserEmailVerificationPresenterImpl(services: services)
        self.view = UserEmailVerificationView(state: presenter.viewState, presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = UserEmailVerificationInteractorImpl(services: services)
        return self.view
    }

    func initialize(_ services: Services, navigationController: UINavigationController, email: String) -> UserEmailVerificationView? {
        let presenter = UserEmailVerificationPresenterImpl(services: services, navigationController: navigationController, email: email)
        self.view = UserEmailVerificationView(state: presenter.viewState, presenter: presenter)
        self.view?.presenter = presenter
        self.view?.presenter.interactor = UserEmailVerificationInteractorImpl(services: services)
        return self.view
    }
}
