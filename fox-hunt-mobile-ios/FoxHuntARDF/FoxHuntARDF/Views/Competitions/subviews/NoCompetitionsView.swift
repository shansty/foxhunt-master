//
//  NoCompetitionsView.swift
//  FoxHuntARDF
//
//  Created by Ivy on 05.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct NoCompetitionsView : View {
    var body: some View {
        VStack {
            Text(L10n.noCompetionsFound)
                .fontWeight(.semibold)
                .font(.system(size: 22.0))
                .multilineTextAlignment(.leading)
            Divider()
                .frame(maxWidth: .infinity, maxHeight: 5)
                .background(Color.accentColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.appBackgroundColor.ignoresSafeArea())
        .foregroundColor(Color.appForegroundColor)
    }
}
