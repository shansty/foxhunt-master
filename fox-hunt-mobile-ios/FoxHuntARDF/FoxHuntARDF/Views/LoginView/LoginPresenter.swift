//
//  LoginPresenter.swift
//  FoxHuntARDF
//
//  Created by itechart on 14/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol LoginPresenter: ModulePresenter, ObservableObject {
    var viewState: AlertViewState { get set }
    func didTapSignIn(with model: LoginViewModel)
    func didTapSignUp()
}

final class LoginPresenterImpl: LoginPresenter {
    typealias Interactor = LoginInteractorImpl
    
    @ServicesProperty var services: Services?
    
    var viewState = AlertViewState()
    
    var interactor: Interactor?
    var router: CommonRouter? = MainRouter.shared
    
    weak var navigationController: UINavigationController?
    
    private var mainModule = MainModule()
    private var userSetupModule = UserSetupModule()
    private var emailVerificationModule = UserEmailVerificationModule()
    
    @LoggerProperty var logger: Log?
    @Published var isLoginButtonEnabled = true
    
    required init() {}
    
    init(services: Services, navigationController: UINavigationController){
        self.services = services
        self.navigationController = navigationController
    }
    
    func didTapSignIn(with model: LoginViewModel) {
        resetErrorAlert()
        turnOffLoginButton()
        
        Task {
            logger?.info("didTapSignIn", with: .loginModule)
            if let interactor = interactor {
                do {
                    guard let credentials = fieldsValidation(with: model) else {
                        turnOnLoginButton()
                        return
                    }
                    let result = try await interactor.signIn(with: credentials.email,
                                                             password: credentials.password,
                                                             domain: credentials.domain)
                    turnOnLoginButton()
                    matchResponseResultToViews(with: result, email: credentials.email.rawValue)

                } catch {
                    turnOnLoginButton()
                    logger?.error("Error: login failed with \(error.localizedDescription)", with: .loginModule)
                    showErrorAlert(error)
                }
            }
        }
    }

    private func matchResponseResultToViews(with result: LoginLogicResult, email: String) {
        switch result {
        case .emailVerificationRequired:
            logger?.info("User is not active. Email verification required", with: .loginModule)
            DispatchQueue.main.async {
                self.showEmailVerificationView(email: email)
            }
        case .tokenRecieved:
            logger?.info("Login passed: YES", with: .loginModule)
            DispatchQueue.main.async {
                self.showMainView()
            }
        case .emailVerificationFailed, .decodingFailed, .savingTokensFailed:
            showAlert(with: L10n.somethingWentWrongTryAgain)
        }
    }
    
    func didTapSignUp() {
        DispatchQueue.main.async {
            self.showRegistrationView()
        }
    }
    
    private func showMainView() {
        if let services = self.services {
            self.navigationController?.setViewControllers([self.mainModule.initialize(services)], animated: true)
        } else {
            showErrorAlert(FoxHuntMobileError.internalInconsistency)
        }
    }

    private func showEmailVerificationView(email: String) {
        if let services = self.services, let navigationController {
            DispatchQueue.main.async { [weak self] in
                let currentVC = UIHostingController(rootView: AnyView(self?.emailVerificationModule.initialize(services, navigationController: navigationController, email: email)))
                self?.navigationController?.setViewControllers([currentVC], animated: true)
            }
        } else {
            return showErrorAlert(FoxHuntMobileError.internalInconsistency)
        }
    }
    
    private func showRegistrationView() {
        if let services = self.services, let navigationController {
            DispatchQueue.main.async { [weak self] in
                let currentVC = UIHostingController(rootView: AnyView(self?.userSetupModule.initialize(services, navigationController: navigationController)))
                self?.navigationController?.setViewControllers([currentVC], animated: true)
            }
        } else {
            return showErrorAlert(FoxHuntMobileError.internalInconsistency)
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
    
    private func fieldsValidation(with model: LoginViewModel) -> (email: EmailAddress, password: String, domain: String?)? {
        let rawEmail = model.email.trimmingCharacters(in: .whitespaces)
        let rawDomain = model.domain.trimmingCharacters(in: .whitespaces)
        
        if rawEmail.isEmpty || model.pass.isEmpty {
            showAlert(with: L10n.pleaseFillAllFields)
            return nil
        }
        
        guard let email = EmailAddress(rawValue: rawEmail) else {
            showAlert(with: L10n.YourEmailIsInvalid.pleaseTryAgain)
            return nil
        }
        return (email, model.pass, rawDomain.isEmpty ? nil : rawDomain)
    }
    
    private func turnOnLoginButton() {
        DispatchQueue.main.async {
            self.isLoginButtonEnabled = true
        }
    }
    
    private func turnOffLoginButton() {
        DispatchQueue.main.async {
            self.isLoginButtonEnabled = false
        }
    }
}
