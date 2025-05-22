//
//  NoActiveCompetitionView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 10.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct NoActiveCompetitionView: View {
    var body: some View {
        Text(L10n.noActiveCompetion)
            .font(.headline)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

