//
//  TryNowDescriptionView.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 2.01.23.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import SwiftUI

struct TryNowDescriptionView : View {
    var body: some View {
        VStack(alignment: .leading) {
            Text(L10n.tryNow)
                .padding(.bottom)
                .font(.system(size: 27, weight: .black))
            Text(L10n.welcomeToGameImmitationHereYouCanDiveIntoTheGameProcessToBeReadyForTheRealCompetition)
        }
        .padding()
    }
}

struct TryNowDescriptionView_Previews: PreviewProvider {
    static var previews: some View {
        TryNowView(presenter: TryNowPresenterImpl(), state: TryNowViewState())
    }
}
