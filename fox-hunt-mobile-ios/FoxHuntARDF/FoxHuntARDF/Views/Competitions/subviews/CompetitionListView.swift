//
//  CompetitionListView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 05.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct CompetitionListView : View {
    @ObservedObject var presenter: CompetitionsPresenterImpl
    @State var selectedCompetitionStatusUI = CompetitionStatusUI.Active.rawValue

    var isSuitableCompetitionToShow : [CompetitionsDetailViewModel] {
        selectedCompetitionStatusUI == CompetitionStatusUI.All.rawValue
        ? presenter.competitions
        : presenter.competitions.filter{ $0.settings.status == CompetitionState.running }
    }

    var body: some View {
        VStack {
            Text(L10n.competitionList)
                .font(.system(size: 26, weight: .black))
                .foregroundColor(Color.appTextWhiteColor)
                .padding([.horizontal, .top])
            VStack {
                CustomPickerView(selectedCompetitionStatusUI: $selectedCompetitionStatusUI)
                    .padding(.bottom)
                ScrollView(showsIndicators: false) {
                    VStack {
                        ForEach(isSuitableCompetitionToShow, id: \.settings.id) { competition in
                            Button {
                                presenter.goToNextScreen(view: AnyView(CompetitionsDetailView(model: competition, presenter: presenter)))
                            } label: {
                                CompetionRowView(model: competition)
                            }
                        }
                    }
                    .padding([.horizontal, .top])
                }
                .refreshable {
                    presenter.setNeedsUpdate()
                }
                .background(
                    Rectangle()
                        .fill(Color.Gradients.topWhiteBottonPastelOrange)
                        .cornerRadius(15)
                        .shadow(color: .gray, radius: 4)
                        .padding(.horizontal, 16)
                )
                .clipped()
            }.padding(.bottom)
        }
        .background(Color.black.ignoresSafeArea())
        .modifier(ListBackgroundModifier())
    }
}
