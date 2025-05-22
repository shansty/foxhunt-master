//
//  HelpView.swift
//  FoxHuntARDF
//
//  Created by Sergey Verlygo on 20/05/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct HelpView: View {
    @ObservedObject var presenter: SettingsPresenter
    @State private var selection: String?

    init(presenter: SettingsPresenter) {
        self.presenter = presenter
        UITableView.appearance().backgroundColor = .clear
    }

    var body: some View {
        VStack(spacing: 0) {
            NavigationHeaderView(action: presenter.goBack, text: L10n.help)
            if #available(iOS 16.0, *) {
                formView
                    .scrollContentBackground(.hidden)
            } else {
                formView
            }

            Spacer()
        }
    }

    private var formView: some View {
        Form {
            Section {
                ForEach(presenter.settingsViewModel.helpContent, id: \.id) { element in
                    Button {
                        presenter.goToNextScreen(view: AnyView(HelpTextView(helpElement: element, presenter: presenter)))
                    } label: {
                        Text(element.title)
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color.appTextBlackColor)
                    }
                }
            }
            .listRowBackground(Color.white)
        }
        .foregroundColor(.appCustomBrownColor)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black)
    }
}

struct HelpView_Previews: PreviewProvider {
    static var previews: some View {
        HelpView(presenter: SettingsPresenter())
    }
}

final class HelpViewState: ObservableObject {
    @Published var showErrorMessageAlert = false
    @Published var errorDescription: String = ""
}
