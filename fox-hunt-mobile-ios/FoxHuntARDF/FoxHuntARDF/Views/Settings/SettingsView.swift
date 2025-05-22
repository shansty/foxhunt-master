//
//  SettingsView.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 16.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI
import MessageUI

struct SettingsView: View {
    @ObservedObject var presenter: SettingsPresenter
    @State var isShowingMailView = false
    @State var result: Result<MFMailComposeResult, Error>?
    
    init(presenter: SettingsPresenter) {
        self.presenter = presenter
        UITableView.appearance().backgroundColor = .clear
    }
    
    var body: some View {
        VStack(spacing: 0) {
            NavigationHeaderView(action: {}, text: L10n.settings, showBackButton: false)
            if #available(iOS 16.0, *) {
                formView
                    .scrollContentBackground(.hidden)
            } else {
                formView
            }
        }
        .foregroundColor(.white)
    }
    
    private var formView: some View {
        Form {
            Section(header: Text(L10n.help)) {
                Button {
                    presenter.goToNextScreen(view: AnyView(HelpView(presenter: presenter)))
                } label: {
                    Text(L10n.help)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(Color.appTextBlackColor)
                }
            }
            .listRowBackground(Color.white)
            
            Section(header: Text(L10n.actions)) {
                Button {
#if DEBUG
                    print("open mailSender")
#else
                    self.isShowingMailView.toggle()
#endif
                } label: {
                    Text(L10n.addFeedback)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(Color.appTextBlackColor)
                }
                Button {
                    presenter.logOut()
                } label: {
                    Text(L10n.signOut)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(Color.appTextBlackColor)
                }
            }
            .listRowBackground(Color.white)
            .sheet(isPresented: $isShowingMailView) {
                MailView(isShowing: self.$isShowingMailView,
                         result: self.$result,
                         supportEmail: (try? presenter.supportEmail()) ?? "")
            }
        }
        .background(Color.black.ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView(presenter: SettingsPresenter())
    }
}
