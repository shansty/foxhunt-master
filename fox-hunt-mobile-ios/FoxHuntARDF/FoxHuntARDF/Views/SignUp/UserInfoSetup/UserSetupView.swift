//
//  UserSetupView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 31.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import SwiftUI
import Foundation

struct UserSetupFields : View {
    @Binding var email: String
    @Binding var firstName: String
    @Binding var lastName: String
    @Binding var password: String

    @ObservedObject var presenter: UserSetupPresenterImpl

    var body: some View {
        FieldView(placeholder: L10n.enterYourFirstName, text: $firstName, fieldType: .plainField, presenter: presenter)
            .padding(.vertical, 2)
        FieldView(placeholder: L10n.enterYourLastName, text: $lastName, fieldType: .plainField, presenter: presenter)
            .padding(.vertical, 2)
        FieldView(placeholder: L10n.enterYourEmail, text: $email, fieldType: .email, presenter: presenter)
            .padding(.vertical, 2)
        FieldView(placeholder: L10n.createYouPassword, text: $password, fieldType: .password, presenter: presenter)
            .padding(.vertical, 2)
    }
}

struct UserSetupView : View {
    @ObservedObject var presenter: UserSetupPresenterImpl
    @ObservedObject var state: AlertViewState

    var body: some View {
        VStack {
            Spacer()
            Text(L10n.signUp)
                .font(.system(size: 27, weight: .black))
                .padding(.bottom, 5)
                .foregroundColor(.appAccentColor)
            Text(L10n.letUsKnowAboutYourself)
                .font(.system(size:18, weight: .medium))
                .padding(.bottom)
            UserSetupFields(email: $presenter.userInfo.email,
                            firstName: $presenter.userInfo.firstName,
                            lastName: $presenter.userInfo.lastName,
                            password: $presenter.userInfo.password,
                            presenter: presenter)
            HStack {
                Text(L10n.enterYouBirthday)
                    .foregroundColor(.gray)
                DatePicker("", selection: $presenter.birthDate, displayedComponents: .date)
                    .pickerStyle(.wheel)
            }
            Divider()
                .frame(height: 1)
                .background(Color.appAccentColor)
            FieldView(placeholder: L10n.specifyYourCountry,
                      text: $presenter.userInfo.country,
                      fieldType: .countryField,
                      presenter: presenter)
            .padding(.vertical, 2)
            FieldView(placeholder: L10n.specifyYourCity,
                      text: $presenter.userInfo.city,
                      fieldType: .cityField,
                      presenter: presenter)
            .padding(.vertical, 2)
            Spacer()
            Button {
                saveClick {
                    presenter.signUp()
                }
            } label: {
                if presenter.isSetUpButtonEnabled {
                    Text(L10n.continue)
                        .font(.system(size: 24, weight: .medium))
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity, maxHeight: 50)
                        .background(presenter.fieldsAreValid
                                    ? Color.appAccentColor
                                    : Color.appAccentColor.opacity(0.5))
                        .cornerRadius(15)
                        .disabled(presenter.fieldsAreValid)
                } else {
                    ActivityIndicatorButtonTitle()
                }
            }
            .disabled(!presenter.isSetUpButtonEnabled)
        }.padding(.horizontal)
         .alert("\(state.errorDescription)", isPresented: $state.showErrorMessageAlert){}
    }
}

struct UserSetupView_Previews: PreviewProvider {
    static var previews: some View {
        UserSetupView(presenter: UserSetupPresenterImpl(), state: .previewValue)
    }
}
