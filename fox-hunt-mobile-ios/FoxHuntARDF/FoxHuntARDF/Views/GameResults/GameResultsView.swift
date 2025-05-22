//
//  GameResultsView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 28.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct GameResultsModel {
    var foundFoxCount : Int
    var allFoxCount : Int
    var timeSpent : TimeInterval
}

struct GameResultsView : View, ModuleView {
    @ObservedObject var presenter: GameResultsPresenterImpl
    var gameResultsModel = GameResultsModel(foundFoxCount: 0, allFoxCount: 0, timeSpent: 0)

    var body: some View {
        VStack {
            Image.appFoxLogo
                .resizable()
                .frame(width: 150, height: 150)
            Text(L10n.gameIsOver)
                .font(.system(size: 27, weight: .black))
                .padding(.bottom)
            Divider()
                .background(Color.white)
                .padding(.horizontal)
            VStack(alignment: .leading) {
                coloredText(str: "\(L10n.foxesFound) \(gameResultsModel.foundFoxCount)/\(gameResultsModel.allFoxCount)",
                            searched: "\(L10n.foxesFound)",
                            seachedTextColor: .appTextWhiteColor,
                            baseTextColor: .appAccentColor)
                    .font(.system(size: 18, weight: .medium))
                    .padding()
                coloredText(
                    str: "\(L10n.timeInTheGame) \(timeFormatter(timeInterval: gameResultsModel.timeSpent))",
                    searched: "\(L10n.timeInTheGame)",
                    seachedTextColor: .appTextWhiteColor,
                    baseTextColor: .appAccentColor)
                    .font(.system(size: 18, weight: .medium))
                    .padding()
                Divider()
                    .background(Color.white)
                    .padding(.horizontal)
                Text(L10n.thanksForTheParticipation)
                    .font(.system(size: 24, weight: .black))
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding([.top, .horizontal])
                Text(L10n.tryAgain)
                    .font(.system(size: 19, weight: .black))
                    .underline()
                    .foregroundColor(.appPastelOrangeColor)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding([.top, .horizontal])
                    .onTapGesture {
                        presenter.showTryNowView()
                    }
            }
        }
        .foregroundColor(Color.appTextWhiteColor)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black)
    }
}
