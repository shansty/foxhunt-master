//
//  CompetitionsView.swift
//  FoxHuntARDF
//
//  Created by itechart on 18/05/2022.
//  Edited by IvannaVasilkova on 19/01/2023
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct CompetitionsView: View, ModuleView {
    typealias Presenter = CompetitionsPresenterImpl
    @ObservedObject var presenter: CompetitionsPresenterImpl

    var body: some View {
        NavigationView {
            VStack {
                if presenter.competitions.isEmpty {
                    NoCompetitionsView()
                } else {
                    CompetitionListView(presenter: presenter)
                }
            }
        }
    }
}

struct CompetitionsView_Previews: PreviewProvider {
    static var previews: some View {
        CompetitionsView(presenter: CompetitionsPresenterImpl.preview)
    }
}
