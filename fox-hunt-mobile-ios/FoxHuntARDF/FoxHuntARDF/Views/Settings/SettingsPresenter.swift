//
//  HelpPresenter.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 12.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol SettingsPresenterProtocol: ModulePresenter, ObservableObject {
    var settingsViewModel: SettingsViewModel { get set }
}

final class SettingsPresenter: SettingsPresenterProtocol {
    typealias Interactor = SettingsInteractor
    
    var settingsViewModel = SettingsViewModel(helpContent: [])
    var interactor: SettingsInteractor?
    var router: CommonRouter? = MainRouter.shared
    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?
    var loginModule = LoginModule()
    private var tokenService = TokenService()

    func getHelpContent() {
        _ = Task {
            logger?.debug("starting update", with: .competitionsModule)
            var helpContent: [HelpDTO] = []
            
            LightweightCacher.restore(filename: "helpContent",
                                      completion: {(result: [HelpDTO]?) in
                if let result {
                    helpContent = result
                    self.settingsViewModel = SettingsViewModel(helpContent: helpContent)
                }
            })
            if helpContent.isEmpty {
                if let getHelpContent = try await interactor?.getHelpContent() {
                    logger?.debug("Got help content, start mapping", with: .settingsModule)
                    helpContent = getHelpContent as [HelpDTO]? ?? []
                }
            }
            logger?.debug("Mapped end successfully.", with: .settingsModule)
            DispatchQueue.main.async { [weak self, helpContent] in
                self?.settingsViewModel = SettingsViewModel(helpContent: helpContent)
            }
        }
    }
    
    func supportEmail() throws -> String {
        guard let config = services?.resolve(ConfigService.self) as? ConfigService
        else {
            throw FoxHuntMobileError.internalInconsistency
        }
        return config.supportEmail
    }
    
    private func showLogOutErrorAlert() {
        let alert = AlertInfo(message: L10n.somethingWentWrongTryAgain, buttons: [
            AlertInfo.Button(title: L10n.tryAgain, action: {
                self.logger?.debug("LogOut error", with: .settingsModule)
            }),
        ])
        MainAlertPresenter.shared.show(alert: alert)
    }
    
    func logOut() {
        if tokenService.isRemoveAllInfoFromStorage() {
            guard let navController = MainRouter.shared.navigationController as? NavigationController else { return }
            guard let services = services else { return }
            navController.setViewControllers([UIHostingController(rootView: loginModule.initialize(services, navigationController: navController))], animated: false)
        } else {
            self.showLogOutErrorAlert()
        }
    }
}
