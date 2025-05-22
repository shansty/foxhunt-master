//
//  CustomPickerView.swift
//  FoxHuntARDF
//
//  Created by Ivy on 05.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

enum CompetitionStatusUI : String, CaseIterable, Identifiable {
    var id: String { return self.rawValue } // for ForEach to work
    case Active
    case All
}

struct CustomPickerView : View {
    @Binding var selectedCompetitionStatusUI: String
    let competitionStatusesUI = CompetitionStatusUI.allCases

    init(selectedCompetitionStatusUI:  Binding<String>) {
        self._selectedCompetitionStatusUI = selectedCompetitionStatusUI
        UISegmentedControl.appearance().selectedSegmentTintColor = UIColor.orange
        UISegmentedControl.appearance().setTitleTextAttributes([.foregroundColor: UIColor.orange, .font : UIFont.systemFont(ofSize: 18)], for: .normal)
        UISegmentedControl.appearance().setTitleTextAttributes([.foregroundColor: UIColor.white], for: .selected)
    }

    var body: some View {
        Picker("", selection: $selectedCompetitionStatusUI) {
            ForEach(competitionStatusesUI) { item in
                Text(item.rawValue)
            }
        }.pickerStyle(SegmentedPickerStyle())
         .padding(.horizontal)
    }
}
