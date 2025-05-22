//
//  TryNowView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 07.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

final class TryNowViewState: ObservableObject {
    @Published var showErrorMessageAlert = false
    @Published var errorDescription: String = ""
}

struct TryNowView : View, ModuleView {
    typealias Presenter = TryNowPresenterImpl
    @ObservedObject var presenter: TryNowPresenterImpl
    @ObservedObject var state: TryNowViewState
    @State private var tabSelection = 0
    
    var body: some View {
        VStack {
            TabView(selection: $tabSelection) {
                TryNowDescriptionView()
                    .tag(0)
                TryNowFoxDescriptionView()
                    .tag(1)
                StartTryNowFoxDescriptionView()
                    .tag(2)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .animation(.easeIn, value: tabSelection)
            .background(Color(.black))
            .foregroundColor(.appTextWhiteColor)
            .font(.system(size: 18, weight: .black))

            Spacer()
            Text(L10n.skipIntro)
                .font(.system(size: 19, weight: .heavy))
                .underline()
                .foregroundColor(.appPastelOrangeColor)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding([.top, .horizontal])
                .hidden(tabSelection == 2)
                .onTapGesture {
                    tabSelection = 2
                }

            Button {
                if tabSelection == 2 {
                    presenter.startGameButtonTapped()
                } else {
                    tabSelection += 1
                }
            } label: {
                Text(tabSelection != 2 ? L10n.next : L10n.startGame)
                    .font(.system(size: 24))
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.appPastelOrangeColor)
            .background(Color(.black))
            .cornerRadius(5)
            .frame(height: 60)
            .padding(15)
        }
        .alert("\(state.errorDescription)", isPresented: $state.showErrorMessageAlert){}
    }
}
