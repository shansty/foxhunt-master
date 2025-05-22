//
//  UserSetupPresenter.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 31.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol UserSetupPresenter: ModulePresenter, ObservableObject {
    var viewState: AlertViewState { get set }
    var countyCityParser : CountyCityParser {set get}

    func isInvalidEmail(with email: String) -> ValidationError?
    func isInvalidField(with field: String) -> ValidationError?
    func isInvalidPassword(with password: String) -> ValidationError?
}

final class UserSetupPresenterImpl: UserSetupPresenter {
    var router: CommonRouter? = RegistationRouter.shared

    typealias Interactor = UserSetupInteractorImpl
    var interactor: UserSetupInteractorImpl?

    var viewState = AlertViewState()
    var userEmailVerificationModule = UserEmailVerificationModule()
    weak var navigationController: UINavigationController?

    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?

    var countyCityParser: CountyCityParser = CountyCityParser()

    @Published var userInfo: Remote.UserSetupRequest = Remote.UserSetupRequest(email: "", password: "",
                                                                               firstName: "", lastName: "",
                                                                               birthDate: Date().debugDescription,
                                                                               country: "", city: "")

    @Published var birthDate = Date()
    @Published var isSetUpButtonEnabled = true

    required init() {}

    init(services: Services, navigationController: UINavigationController){
        self.services = services
        self.navigationController = navigationController
        countyCityParser.сountryCityParser()

#if DEBUG
        userInfo = .testValue
#endif
    }

    func isInvalidEmail(with email: String) -> ValidationError? {
        let rawEmail = email.trimmingCharacters(in: .whitespaces)

        if rawEmail.isEmpty || rawEmail == "" {
            return ValidationError.lackOfSymbols
        }
        if rawEmail.count > 100 {
            return ValidationError.longString
        }

        guard let _ = EmailAddress(rawValue: rawEmail) else {
            return ValidationError.invalidSymbols
        }
        return nil
    }

    func isInvalidField(with field: String) -> ValidationError? {
        if field == "" || field.isEmpty {
            return ValidationError.lackOfSymbols
        }
        if field.count > 15 {
            return ValidationError.longString
        }
        return nil
    }

    func isInvalidPassword(with password: String) -> ValidationError? {
        if password == "" || password.isEmpty || password.count < 6 {
            return ValidationError.lackOfSymbols
        }
        if password.count > 15 {
            return ValidationError.longString
        }
        return nil
    }

    var fieldsAreValid: Bool {
        return (isInvalidEmail(with: userInfo.email) == nil)
        && (isInvalidPassword(with: userInfo.password) == nil)
        && (isInvalidField(with: userInfo.firstName) == nil)
        && (isInvalidField(with: userInfo.lastName) == nil)
        && (isInvalidField(with: userInfo.country) == nil)
        && (isInvalidField(with: userInfo.city) == nil)
    }

    func signUp() {
        resetErrorAlert()
        if fieldsAreValid {
            userInfo.birthDate = birthDate.debugDescription
            turnOffSetUpButton()
            Task {
                logger?.info("didTapSignUp", with: .loginModule)
                if let interactor = interactor, let navigationController, let services {
                    do {
                        let passed = try await interactor.signUp(with: userInfo)
                        logger?.info("User setup passed: \(passed ? "YES" : "NO")", with: .loginModule)
                        turnOnSetUpButton()
                        if passed {
                            DispatchQueue.main.async {
                                self.goToNextScreen(view: AnyView(self.userEmailVerificationModule
                                    .initialize(services,
                                                navigationController: navigationController,
                                                email: self.userInfo.email)))
                            }
                        }
                    } catch {
                        turnOnSetUpButton()
                        logger?.error("Error: User setup failed with \(error.localizedDescription)", with: .loginModule)
                        showErrorAlert(error)
                    }
                }
            }
        }
    }

    private func turnOnSetUpButton() {
        DispatchQueue.main.async {
            self.isSetUpButtonEnabled = true
        }
    }
    private func turnOffSetUpButton() {
        DispatchQueue.main.async {
            self.isSetUpButtonEnabled = false
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

extension Remote.UserSetupRequest {
    static var testValue = Remote.UserSetupRequest(
        email: "ivyshkapoland@gmail.com", password: "Qwerty123",
        firstName: "Ivanna", lastName: "Vasilkova",
        birthDate: Date().debugDescription,
        country: "Poland", city: "Warsaw")
}

