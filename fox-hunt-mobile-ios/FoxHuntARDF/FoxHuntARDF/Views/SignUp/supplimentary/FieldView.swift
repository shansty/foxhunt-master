//
//  FieldView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 02.02.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import SwiftUI
import Foundation

struct FieldPickerView : View {
    var fieldType: FieldType
    @Binding var text: String
    @State var isShownPassword: Bool = false
    @ObservedObject var presenter: UserSetupPresenterImpl

    var body: some View {
        if fieldType == .password {
            HStack {
                isShownPassword
                ? AnyView(TextField("", text: $text))
                : AnyView(SecureField("", text: $text))
                Image(systemName: isShownPassword ? "lock.open": "lock")
                    .onTapGesture {
                        isShownPassword = !isShownPassword
                    }
            }
        } else if fieldType == .countryField {
            SearchPickerView(fieldType: .countryField, text: $text, presenter: presenter)
        } else if fieldType == .cityField {
            SearchPickerView(fieldType: .cityField, text: $text, presenter: presenter)
        } else {
            TextField("", text: $text)
        }
    }
}

struct SearchPickerView : View {
    var fieldType: FieldType
    @Binding var text: String
    @State var suggestions : [String] = []
    @State var showSuggestions : Bool = false
    @ObservedObject var presenter: UserSetupPresenterImpl

    var body: some View {
        VStack(alignment: .leading) {
            TextField("", text: $text)
                .onChange(of: text, perform: showSuggestions)
            if suggestions.count > 1  {
                ScrollView(showsIndicators: false) {
                    ForEach(suggestions, id: \.self) { item in
                        if suggestions.count > 1 {
                            Divider().background(Color.white)
                        }
                        Button {
                            text = item
                            suggestions.removeAll()
                            fieldType == .countryField
                            ? (presenter.userInfo.country = item)
                            : (presenter.userInfo.city = item)
                        } label: {
                            Text(item)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
                .frame(height: (suggestions.count > 1) ? 100 : 20)
            }
        }
    }

    private func showSuggestions(newValue: String) {
        if !newValue.isEmpty {
            showSuggestions = true
            if fieldType == .countryField {
                suggestions = presenter.countyCityParser.countries.filter{ $0.starts(with: newValue) }
            } else if fieldType == .cityField {
                suggestions = presenter.countyCityParser.getNeededCities(for: presenter.userInfo.country).filter{ $0.starts(with: newValue) }
            }
        } else {
            showSuggestions = false
            suggestions = []
        }
    }
}

struct FieldView : View {
    @State var placeholder: String
    @Binding var text: String
    var fieldType: FieldType

    @ObservedObject var presenter: UserSetupPresenterImpl
    var viewState = AlertViewState()

    var body: some View {
        VStack {
            ZStack(alignment: .leading) {
                if text.isEmpty {
                    Text(placeholder)
                        .foregroundColor(.gray)
                }
                FieldPickerView(fieldType: fieldType, text: $text, presenter: presenter)
                    .onChange(of: text, perform: inputValidationCheck)
            }
            Divider()
                .frame(height: 1)
                .background(viewState.showErrorMessageAlert ? Color.red : Color.appAccentColor)
            if viewState.showErrorMessageAlert {
                Text(viewState.errorDescription)
                    .font(.system(size: 13, weight: .light))
            }
        }
    }

    private func inputValidationCheck(newValue: String) {
        viewState.clean()
        if let validationError = fieldType.validation(text: newValue, presenter: presenter) {
            viewState.errorDescription = validationError.rawValue
            viewState.showErrorMessageAlert = true
        }
    }
}
