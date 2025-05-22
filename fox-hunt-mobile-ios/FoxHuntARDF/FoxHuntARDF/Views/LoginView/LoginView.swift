//
//  LoginView.swift
//  FoxHuntARDF
//
//  Created by itechart on 09/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct LoginView: View, ModuleView {
    typealias Presenter = LoginPresenterImpl
    var presenter: LoginPresenterImpl { didSet {} }

#if DEBUG
    @ObservedObject var model: LoginViewModel = .testValue
#else
    @ObservedObject var model: LoginViewModel
#endif

    @ObservedObject var state: AlertViewState

    var body: some View {
        VStack(spacing: 24) {
            Image.appFoxLogo
                .resizable()
                .frame(width: 200, height: 200)

            LoginField(text: L10n.email,
                       placeholder: L10n.enterYourEmail,
                       fieldValue: $model.email)

            LoginField(text: L10n.password,
                       placeholder: L10n.enterYourPassword,
                       fieldValue: $model.pass,
                       isSecureField: true)

            LoginField(text: L10n.domain,
                       placeholder: L10n.enterYourDomain,
                       fieldValue: $model.domain)

            Button {
                saveClick {
                    presenter.didTapSignIn(with: model) // with: model.email, pass: model.pass)
                }
            } label: {
                if presenter.isLoginButtonEnabled {
                    Text(L10n.signIn)
                        .font(.system(size: 24))
                        .fontWeight(.semibold)
                        .foregroundColor(.appCustomBrownColor)
                        .frame(maxWidth: .infinity, maxHeight: 50)
                        .background(Color.white)
                        .cornerRadius(15)

                } else {
                    ZStack {
                        RoundedRectangle(cornerRadius: 15)
                            .fill(Color.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                        ProgressView()
                            .tint(.appCustomBrownColor)
                    }
                }
            }
            .disabled(!presenter.isLoginButtonEnabled)
            .padding(.vertical, 30)
            .padding(.horizontal)

            Button {
                saveClick {
                    presenter.didTapSignUp()
                }
            } label: {
                Text(L10n.signUp)
                    .font(.system(size: 18))
                    .underline()
                    .foregroundColor(.appCustomBrownColor)
            }
            .padding(.vertical)

            Spacer()
        }
        .padding(.horizontal)
        .alert("\(state.errorDescription)", isPresented: $state.showErrorMessageAlert){}
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            Color.Gradients.topCustomBrownColorBottomAccentColor
        )
    }
}

#if DEBUG

extension LoginViewModel {
    static var previewValue = LoginViewModel(email: "123", pass: "123456", domain: "")

    static var testValue = LoginViewModel(email: "ivyshkapoland@gmail.com", pass: "Qwerty123", domain: "public")
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView(presenter: LoginPresenterImpl(),
                  model: LoginViewModel.previewValue,
                  state: AlertViewState.previewValue)
    }
}

#endif

