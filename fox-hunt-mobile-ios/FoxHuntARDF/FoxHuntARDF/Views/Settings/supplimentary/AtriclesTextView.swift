//
//  AtriclesTextView.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 17.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct AtriclesTextView: View {
    let article: Article
    let presenter: SettingsPresenter

    var body: some View {
        VStack(alignment: .leading) {
            NavigationHeaderView(action: presenter.goBack, text: article.title)
            ForEach(article.contents.editorText, id: \.self) { editor in
                ForEach(editor.children, id: \.self) { child in
                    Text(child.text)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(Color.appTextWhiteColor)
                        .padding()
                }
            }
            Spacer()
        }
        .background(Color.appBackgroundColor.ignoresSafeArea())
    }
}

struct AtriclesTextView_Previews: PreviewProvider {
    static var previews: some View {
        AtriclesTextView(article: Article(id: 0, title: "", notes: "", contents: Contents(editorText: []), index: 0), presenter: SettingsPresenter())
    }
}
