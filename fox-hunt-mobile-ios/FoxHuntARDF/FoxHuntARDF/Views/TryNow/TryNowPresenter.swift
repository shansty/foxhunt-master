//
//  TryNowPresenter.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 08.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved. 
//

import Foundation
import SwiftUI
import Combine
import CoreLocation

protocol TryNowPresenter : ModulePresenter {
    var services: Services? { set get }
    var viewState: TryNowViewState { get set }
}

class TryNowPresenterImpl: TryNowPresenter , ObservableObject{
    typealias Interactor = TryNowInteractorImpl
    var interactor: TryNowInteractorImpl?
    var router: CommonRouter? =  MainRouter.shared
    var viewState = TryNowViewState()

    weak var navigationController: UINavigationController?
    private var gameDifficultyModule = GameDifficultyModule()

    @LoggerProperty var logger: Log?

    var services: Services?

    required init() {}

    init(services: Services, navigationController: UINavigationController){
        self.services = services
        self.navigationController = navigationController
    }

    var currentLocation : CLLocation?
    var currentLocationSubscriber : AnyCancellable?

    var locationStatus : LocationStatus?
    var locationStatusSubscriber : AnyCancellable?

    func startGameButtonTapped() {
        closeAlert()
        locationStatusSubscriber = interactor?.locationStatusPublisher.sink { [weak self] newStatus in
            switch newStatus {
            case .isGrantedPrecise:
                self?.currentLocationSubscriber = self?.interactor?.currentLocationPublisher.sink { [weak self] newLocation in
                    self?.currentLocation = newLocation
                    if (newLocation != nil) {
                        self?.goToGameDifficultyView()
                        self?.currentLocationSubscriber?.cancel()
                    }
                }
            case .isGrantedApproximate, .isDenied, .isDisabled:
                self?.showAlert(with: L10n.FoxHuntRequiresThePreciseLocationForProperPlaying.pleaseEnableThePresiceLocationInTheSettings)
            case .isNotDetermined, .none:
                break
            }
        }
        try? interactor?.locationService.requestWhenInUseAuthorization()
    }

    private func goToGameDifficultyView() {
        DispatchQueue.main.async { [weak self] in
            let currentVC = UIHostingController(rootView: self?.showGameDifficultyView())
            self?.navigationController?.setViewControllers([currentVC], animated: true)
        }
    }

    private func showGameDifficultyView() -> AnyView {
        if let services = services, let navigationController {
            return AnyView(gameDifficultyModule.initialize(services, navigationController: navigationController))
        } else {
            showAlert(with: FoxHuntMobileError.internalInconsistency.localizedDescription)
            return AnyView(EmptyView())
        }
    }

    private func showAlert(with message: String) {
        DispatchQueue.main.async { [weak self] in
            self?.viewState.errorDescription = message
            self?.viewState.showErrorMessageAlert = true
        }
    }

    private func closeAlert() {
        DispatchQueue.main.async { [weak self] in
            self?.viewState.errorDescription = ""
            self?.viewState.showErrorMessageAlert = false
        }
    }
}
