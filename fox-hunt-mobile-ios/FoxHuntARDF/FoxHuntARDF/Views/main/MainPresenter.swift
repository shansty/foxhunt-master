//
//  MainPresenter.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 27.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol MainPresenterProtocol: ModulePresenter {
    func downloadData()
}

class MainPresenter: MainPresenterProtocol, ObservableObject {
    var interactor: MainInteractor?
    var router: CommonRouter? = MainRouter.shared
    let alertPresenter = MainAlertPresenter.shared

    private var competitionsModule = CompetitionsModule()
    private var settingsModule = SettingsModule()
    private var tryNowModule = TryNowModule()
    private var navigationController = NavigationController()

    typealias Interactor = MainInteractor

    @ServicesProperty var services: Services?
    @Published var loginViewPresented = false

    @LoggerProperty var logger: Log?

    required init() {}

    required init(services: Services?) {
        self.services = services
    }

    func downloadData() {
        interactor?.loadData(competitionsModule: competitionsModule, settingsModule: settingsModule)
    }

    func routerReset() {
        router?.reset()
    }

    func showCompetitionView() -> AnyView {
        if let services = services {
            return AnyView(competitionsModule.initialize(services))
        } else {
            return AnyView(EmptyView())
        }
    }

    func showSettingsView() -> AnyView {
        if let services = services {
            return AnyView(settingsModule.initialize(services))
        } else {
            return AnyView(EmptyView())
        }
    }

    func showTryNowView() -> AnyView {
        if let services = services {
            var embeding = Embedding()
            embeding = embeding.withSubviews(subviews: [
                tryNowModule.initialize(services,
                                        navigationController: embeding.navigationController)
            ])
            return AnyView(embeding)
        } else {
            return AnyView(EmptyView())
        }
    }

    func showNotReadyAlert() {
        let alertMessage = "This feature is not ready yet."
        let actionButtons: [AlertInfo.Button] = [.init(
            title: "OK",
            style: .default
        ) {}]
        let alertInfo = AlertInfo(message: alertMessage, buttons: actionButtons)
        alertPresenter.show(alert: alertInfo)
    }
}
