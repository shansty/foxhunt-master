//
//  GameDifficultyView.swift
//  FoxHuntARDF
//
//  Created by Sergey Verlygo on 20/05/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct GameDifficultyView: View {
    typealias Presenter = GameDifficultyPresenterImpl
    @ObservedObject var presenter: GameDifficultyPresenterImpl

    var body: some View {
        VStack {
            Text(L10n.chooseYourGameLevel)
                .font(.system(size: 26, weight: .black))
            ForEach(GameDifficulty.allCases, id: \.self) { mode in
                Button {
                    if let level = mode.gameDifficultyLevel {
                        presenter.goTryNowGame(with: level)
                    } else {
                        presenter.goToCustomGameSettings()
                    }
                } label: {
                    Text(mode.rawValue)
                        .font(.system(size: 20, weight: .black))
                        .frame(maxWidth: .infinity, maxHeight: 80.0)
                        .background(mode.gameDifficultyColor)
                        .cornerRadius(15)
                        .padding(.horizontal)
                        .shadow(radius: 15)
                }
            }
        }
        .padding(.horizontal)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black)
        .foregroundColor(.appForegroundColor)
    }
}

struct MoreView_Previews: PreviewProvider {
    static var previews: some View {
        GameDifficultyView(presenter: GameDifficultyPresenterImpl())
    }
}
