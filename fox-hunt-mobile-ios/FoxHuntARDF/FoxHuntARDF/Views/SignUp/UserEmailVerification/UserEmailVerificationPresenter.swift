//
//  UserEmailVerificationPresenter.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 03.02.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI
import Combine

protocol UserEmailVerificationPresenter: ModulePresenter, ObservableObject {
    var viewState: AlertViewState { get set }
}

final class UserEmailVerificationPresenterImpl: UserEmailVerificationPresenter {

    typealias Interactor = UserEmailVerificationInteractorImpl
    var interactor: UserEmailVerificationInteractorImpl?

    var router: CommonRouter? = MainRouter.shared
    weak var navigationController: UINavigationController?
    var email : String?
    private var tokenService = TokenService()
    private var mainModule = MainModule()
    var viewState = AlertViewState()

    private var timer : Cancellable?
    var isActiveTimer = false

    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?

    @Published var code: String = ""
    @Published var isVerificationButtonEnabled = true
    @Published var timeRemaining = 0

    required init() {}

    init(services: Services, navigationController: UINavigationController, email: String){
        self.services = services
        self.navigationController = navigationController
        self.email = email
    }

    func verifyEmailCode() {
        resetErrorAlert()
        Task {
            turnOffVerificationButton()
            logger?.info("verifyEmailCode", with: .loginModule)
            if let interactor = interactor , code.count == 6 {
                do {
                    guard let userId = tokenService.getTokenFromStorage(tokenName: "userId") else { return }
                    let userInfo = Remote.EmailVerificationRequest(id: userId, token: code)
                    let passed = try await interactor.verifyEmailCode(with: userInfo)

                    turnOnVerificationButton()
                    if passed {
                        DispatchQueue.main.async {
                            self.showMainView()
                        }
                    } else {
                        showErrorAlert(FoxHuntMobileError.networkBadRequest)
                    }
                } catch {
                    turnOnVerificationButton()
                    showErrorAlert(error)
                    logger?.error("Error: login failed with \(error.localizedDescription)", with: .loginModule)
                }
            }
        }
    }

    func resendCode() {
        if let email, let interactor = interactor {
            Task {
                do {
                    let passed = try await interactor.resendCode(with: email)
                    if !passed {
                        showErrorAlert(FoxHuntMobileError.networkBadRequest)
                    }
                } catch {
                    showErrorAlert(error)
                    logger?.error("Error: login failed with \(error.localizedDescription)", with: .loginModule)
                }
            }
        }
    }

    @objc func onTimerCounting(_ time: Date) {
        if timeRemaining > 0 {
            timeRemaining -= 1
        } 
    }

    func startTimer() {
        timeRemaining = 60
        timer = Timer
            .publish(every: 1, on: .main, in: .default)
            .autoconnect()
            .receive(on: DispatchQueue.main)
            .sink(receiveValue: { [weak self] newValue in
                self?.onTimerCounting(newValue)
            }) as Cancellable
        isActiveTimer = true
    }

    func cancelTimer() {
        isActiveTimer = false
        timer?.cancel()
    }

    private func showMainView() {
        if let services = self.services {
            self.navigationController?.setViewControllers([self.mainModule.initialize(services)], animated: true)
        } else {
            logger?.error("Error: transition to MainView failed", with: .loginModule)
        }
    }

    private func turnOnVerificationButton() {
        DispatchQueue.main.async {
            self.isVerificationButtonEnabled = true
        }
    }

    private func turnOffVerificationButton() {
        DispatchQueue.main.async {
            self.isVerificationButtonEnabled = false
        }
    }

    private func resetErrorAlert() {
        DispatchQueue.main.async { [weak self] in
            self?.viewState.errorDescription = ""
            self?.viewState.showErrorMessageAlert = false
        }
    }

    private func showErrorAlert(_ error: Error) {
        showAlert(with: error.localizedDescription)
    }

    private func showAlert(with message: String) {
        DispatchQueue.main.async { [weak self] in
            self?.viewState.errorDescription = message
            self?.viewState.showErrorMessageAlert = true
        }
    }
}
