//
//  TryNowFoxDescriptionView.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 2.01.23.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct TryNowFoxDescriptionView : View {
    var body: some View {
        VStack(alignment: .leading) {
            Text(L10n.YouMustFindAllTheFoxesOnTheListUntilTheTimeIsUp.EachFoxCanPlayTheSignalUpTo2MinutesConstantlyChangingAmongThemselves.toCatchItYouNeedToFindTheRightSignalWithAFrequencySelector)
        }
        .padding()
    }
}
