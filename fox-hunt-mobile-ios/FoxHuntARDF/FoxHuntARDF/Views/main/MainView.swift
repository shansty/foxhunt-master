//
//  MainView.swift
//  FoxHuntARDF
//
//  Created by itechart on 16/05/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct MainView: View {
    typealias Presenter = MainPresenter
    @ObservedObject var presenter: MainPresenter
    var loginModule = LoginModule()
    var debugType : DebugRoutingType = .all

    @State private var selectedTab = L10n.competitions
    @State var loginViewPresented = false

    var body: some View {
        TabView(selection: $selectedTab) {
            presenter.showTryNowView()
                .tabItem {
                    Label(L10n.tryNow, systemImage: "antenna.radiowaves.left.and.right")
                }.tag(L10n.current)

            if debugType == .localBuild || debugType == .all {
                presenter.showCompetitionView()
                    .tabItem {
                        Label(L10n.competitions, systemImage: "list.dash")
                    }.tag(L10n.competitions)
            }

            if debugType == .remoteBuild || debugType == .all {
                presenter.showSettingsView()
                    .tabItem {
                        Label(L10n.settings, systemImage: "gear")
                    }.tag(L10n.help)
            }
        }.tabViewStyle(
            bgColor: .black,
            itemColor: Color(Color.RGBColorSpace.sRGB, white: 0.839, opacity: 1.0),
            selectedColor: .blue,
            badgeColor: nil,
            font: UIFont.systemFont(ofSize: 15.0, weight: .medium))
        .onAppear {
            presenter.downloadData()
        }
    }
}

struct MainView_Previews: PreviewProvider {
    static var previews: some View {
        MainView(presenter: MainPresenter())
    }
}
