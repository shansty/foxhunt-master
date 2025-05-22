//
//  UserEmailVerificationView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 03.02.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct UserEmailVerificationView : View {
    @ObservedObject var state: AlertViewState
    @FocusState private var isKeyboardShowing: Bool
    @ObservedObject var presenter: UserEmailVerificationPresenterImpl

    var body: some View {
        VStack {
            Spacer()
            Text(L10n.verifyYourEmail)
                .font(.system(size: 27, weight: .black))
                .padding(.bottom, 5)
                .foregroundColor(.appAccentColor)
            Text(L10n.an6DigitCodeHasBeenSentTo)
                .font(.system(size: 18, weight: .medium))
            Text(presenter.email ?? "blabla@gmail.com")
                .underline()
                .foregroundColor(.appAccentColor)
                .font(.system(size: 18, weight: .medium))
                .padding(.bottom)

            HStack(spacing: 15) {
                ForEach(0..<6, id: \.self) { index in
                    CodeTextBox(index)
                }
            }
            .background(content: {
                TextField("", text: $presenter.code.limit(6))
                    .textContentType(.oneTimeCode)
                    .opacity(0)
                    .autocapitalization(.none)
                    .blendMode(.screen)
                    .focused($isKeyboardShowing)

            })
            .contentShape(Rectangle())
            .onTapGesture {
                isKeyboardShowing.toggle()
            }
            .padding(.bottom)
            Button {
                presenter.resendCode()
                presenter.startTimer()
            } label: {
                Text("Resend code in \(presenter.timeRemaining)")
                    .underline()
                    .foregroundColor(.white)
            }
            .disabled(presenter.timeRemaining == 0 ? false : true)
            .onAppear {
                presenter.startTimer()
            }
            Spacer()

            Button {
                saveClick {
                    presenter.verifyEmailCode()
                }
            } label: {
                if presenter.isVerificationButtonEnabled {
                    Text(L10n.continue)
                        .font(.system(size: 24, weight: .medium))
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity, maxHeight: 50)
                        .background(Color.appAccentColor)
                    .cornerRadius(15)
                } else {
                    ActivityIndicatorButtonTitle()
                }
            }
            .disabled(!presenter.isVerificationButtonEnabled)
        }.alert("\(state.errorDescription)", isPresented: $state.showErrorMessageAlert){}
    }

    @ViewBuilder
    func CodeTextBox(_ index: Int) -> some View {
        ZStack {
            if presenter.code.count > index  {
                let startIndex = presenter.code.startIndex
                let charIndex = presenter.code.index(startIndex, offsetBy: index)
                let charToString = String(presenter.code[charIndex])
                Text(charToString)
            } else {
                Text(" ")
            }
        }
        .frame(width: 45, height: 45)
        .background {
            let status = (isKeyboardShowing && presenter.code.count == index)
            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .stroke(status ? Color.appAccentColor : .gray, lineWidth: 0.5)
        }
    }
}

extension Binding where Value == String {
    func limit(_ length: Int) -> Self {
        if self.wrappedValue.count > length {
            DispatchQueue.main.async {
                self.wrappedValue = String(self.wrappedValue.prefix(length))
            }
        }
        return self
    }
}

struct UserEmailVerificationView_Previews: PreviewProvider {
    static var previews: some View {
        UserEmailVerificationView(state: AlertViewState(), presenter: UserEmailVerificationPresenterImpl())
    }
}
