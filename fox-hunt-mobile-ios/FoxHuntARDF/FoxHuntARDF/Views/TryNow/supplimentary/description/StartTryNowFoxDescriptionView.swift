//
//  StartTryNowFoxDescriptionView.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 2.01.23.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct StartTryNowFoxDescriptionView : View {
    var body: some View {
        VStack {
            Spacer()
            Text(L10n.readyToTry)
                .font(.system(size: 27, weight: .black))
                .padding(.bottom)
            Spacer()
                .frame(maxHeight: 200)
            coloredText(str: L10n.NoteVolumeIsVeryImportantPartOfTheGame.weReRecommendSetTheVolumeTo50,
                        searched: L10n.note,
                        seachedTextColor: .appPastelOrangeColor,
                        baseTextColor: .white)
            .padding(.bottom, 40)
        }
        .padding()
    }
}
