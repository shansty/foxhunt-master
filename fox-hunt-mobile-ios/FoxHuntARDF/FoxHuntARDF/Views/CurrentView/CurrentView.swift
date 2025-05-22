//
//  CurrentView.swift
//  FoxHuntARDF
//
//  Created by itechart on 17/05/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct CurrentViewModel {
    var isActive: Bool
    var competitionName: String
}

struct TimerView : View {
    @ObservedObject var presenter: CurrentPresenterImpl
    var body: some View {
        Text(timeFormatter(timeInterval: presenter.timeRemaining))
            .font(.system(size: 45))
            .foregroundColor(.white)
    }
}

struct CurrentView: View {

    typealias Presenter = CurrentPresenterImpl
    @ObservedObject var presenter: CurrentPresenterImpl

    @State var sheetIsPresented = true
    @State public var model: CurrentViewModel

    var body: some View {
            (model.isActive
             ? AnyView(ActiveCompetitionView(model: model, presenter: presenter))
             : AnyView(NoActiveCompetitionView()))
        .background(Color.black)
        .foregroundColor(.appForegroundColor)
    }
}
