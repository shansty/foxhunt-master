//
//  FoxElementListView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 09.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct FoxElementListView : View {
    @State var fox: FoxGameEntity
    @ObservedObject var presenter: CurrentPresenterImpl
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 10) {
                Text("\(L10n.fox) \(fox.id.rawValue)")
                    .font(.headline)
                    .textCase(.uppercase)
                    .foregroundColor(.appPastelOrangeColor)
                Text("\(L10n.currentFrequency): \(fox.frequency , specifier: "%.2f")")
                    .foregroundColor(.black)
                if fox.isActive, let distance = presenter.distanseBetweenUserAndFox {
                    Text("\(L10n.locatedIn) \(distance, specifier: "%.2f") \(L10n.meters) ")
                        .foregroundColor(.black)
                }
            }
            Spacer()
            Text(fox.isFound ? L10n.found : L10n.toFind)
                .foregroundColor(fox.isFound ? .green : .appPastelRedColor)
                .textCase(.uppercase)
            Rectangle()
                .fill(fox.isFound ? .green : .appPastelRedColor)
                .frame(width: 40, height: 40)
                .cornerRadius(15)
        }
        .padding()
        .background(Color.white)
        .cornerRadius(15)
        .shadow(color: .appAccentColor.opacity(0.15), radius: 8, x: 0, y: 5)
    }
}
