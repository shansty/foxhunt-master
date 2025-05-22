//
//  HelpTextView.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 14.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct HelpTextView: View {
    let helpElement: HelpDTO
    let presenter: SettingsPresenter

    init(helpElement: HelpDTO, presenter: SettingsPresenter) {
        self.helpElement = helpElement
        self.presenter = presenter
        UITableView.appearance().backgroundColor = .clear
    }

    var body: some View {
            VStack(spacing: 0) {
                NavigationHeaderView(action: presenter.goBack, text: helpElement.title)
                if noContentAvailable(for: helpElement) {
                    Text(L10n.thereIsNoContentYet)
                        .frame(maxWidth: .infinity)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(Color.appTextWhiteColor)
                }
                
                editorTextView
                
                if !helpElement.articles.isEmpty {
                    if #available(iOS 16.0, *) {
                        formView
                            .scrollContentBackground(.hidden)
                    } else {
                        formView
                    }
                }
                Spacer()
            }
            .background(Color.appBackgroundColor.ignoresSafeArea())
    }

    private var editorTextView: some View {
        ForEach(helpElement.contents?.editorText ?? [], id: \.self) { editorText in
            ForEach(editorText.children, id: \.self) { child in
                Text(child.text)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(Color.appTextWhiteColor)
                    .lineLimit(nil)
            }
        }
    }

    private var formView: some View {
        Form {
            ForEach(helpElement.articles, id: \.self) { article in
                Button {
                    presenter.goToNextScreen(view: AnyView(AtriclesTextView(article: article, presenter: presenter)))
                } label: {
                    Text(article.title)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(Color.appTextBlackColor)
                }
            }
            .listRowBackground(Color.white)
        }
        .background(Color.appBackgroundColor.ignoresSafeArea())
    }

    private func noContentAvailable(for helpElement: HelpDTO) -> Bool {
        return helpElement.contents?.editorText.isEmpty ?? true && helpElement.articles.isEmpty
    }
}

struct HelpTextView_Previews: PreviewProvider {
    static var previews: some View {
        HelpTextView(helpElement: HelpDTO(id: 1,
                                          title: "",
                                          notes: "",
                                          contents: Contents(editorText: []),
                                          index: 0,
                                          articles: [],
                                          system: false),
                     presenter: SettingsPresenter())
    }
}
