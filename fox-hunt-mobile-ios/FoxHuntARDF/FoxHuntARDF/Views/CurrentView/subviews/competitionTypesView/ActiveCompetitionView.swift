//
//  ActiveCompetitionView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 09.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct ActiveCompetitionView : View {
    @State var model: CurrentViewModel
    @ObservedObject var presenter: CurrentPresenterImpl

    var body: some View {
        VStack {
            VStack(spacing:10) {
                Text(model.competitionName)
                    .font(.system(size: 28)).bold()
                    .foregroundColor(.white)
                    .padding(.top, 24)
                TimerView(presenter: presenter)
                HStack(spacing:16) {
                    Button {
                        presenter.showMapView()
                    } label: {
                        Text(L10n.showMap)
                            .font(.system(size: 18, weight: .black))
                            .frame(maxWidth: .infinity, maxHeight: 60.0)
                            .background(Color.black)
                            .cornerRadius(15)
                    }
                    .padding([.leading, .bottom])
                    Button {
                        presenter.showResults()
                    } label: {
                        Text(L10n.finishGame)
                            .font(.system(size: 18, weight: .black))
                            .frame(maxWidth: .infinity, maxHeight: 60.0)
                            .background(Color.appPastelRedColor)
                            .cornerRadius(15)
                    }
                    .padding([.trailing, .bottom])
                }
            }
            .padding(.horizontal)
            .background(
                Rectangle()
                    .fill(Color.Gradients.topWhiteBottonPastelOrange)
                    .cornerRadius(15)
                    .shadow(color: .gray, radius: 4)
                    .padding(.horizontal, 16)
                    .padding(.top)
            )
            FoxListView(presenter: presenter)
                .padding(.horizontal)
                .background(
                    Rectangle()
                        .fill(Color.Gradients.topWhiteBottonPastelOrange)
                        .cornerRadius(15)
                        .shadow(color: .gray, radius: 4)
                        .padding(.horizontal, 16)
                )
        }.padding(.bottom)
            .onAppear{
                presenter.startGame()
            }
    }
}
