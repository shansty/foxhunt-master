//
//  CustomGameSettingsView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 16.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

enum Frequency: String, CaseIterable, Identifiable {
    var id: String { return self.rawValue } // for ForEach to work
    case MHz3dot5 = "3.5 MHz"
    case MHz144dot0 = "144.0 MHz"
}

struct CustomSlider: View {
    @State var text: String
    @Binding var value: CGFloat
    @State var maxValue: CGFloat
    @State var step: CGFloat = 1
    @State var withFloatSpecifier: Bool = true
    @State private var isEditing = false
    
    var body: some View {
        Text(text)
        HStack {
            Slider(
                value: $value,
                in: 0...maxValue,
                step: step,
                onEditingChanged: { editing in
                    isEditing = editing
                }
            )
            Text(withFloatSpecifier ? "\(value, specifier: "%.2f")" : "\(Int(value))")
                .foregroundColor(isEditing ? .gray : .accentColor)
        }
    }
}

struct GameSettingsView: View {
    typealias Presenter = GameSettingsPresenterImpl
    @ObservedObject var presenter: GameSettingsPresenterImpl

    @State var durationOfTheCompetition: CGFloat = 1800
    @State var amountOfFoxes: CGFloat = 3
    @State var searchAreaDistance: CGFloat = 300
    @State var foxSoundDuration: CGFloat = 30

    @State private var checked = true

    let frequencies = Frequency.allCases
    @State private var selectedFrequency = Frequency.MHz3dot5.rawValue
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(L10n.customizeGameSettings)
                .frame(maxWidth: .infinity, alignment: .center)
                .font(.system(size: 24, weight: .heavy))
                .padding(.vertical)
            CustomSlider(text: L10n.durationOfTheCompetition, value: $durationOfTheCompetition, maxValue: 3600, step: 60)
            CustomSlider(text: L10n.amountOfFoxes, value: $amountOfFoxes, maxValue: 5, withFloatSpecifier: false)
            CustomSlider(text: L10n.searchAreaDistance, value: $searchAreaDistance, maxValue: 1000, step: 50)
            
            Text(L10n.frequencyOfTheTransmitter)
            Picker(L10n.pleaseChooseAColor, selection: $selectedFrequency) {
                ForEach(frequencies) { item in
                    Text(item.rawValue)
                }
            }.pickerStyle(SegmentedPickerStyle())
            
            CustomSlider(text: L10n.foxSoundDuration, value: $foxSoundDuration, maxValue: 120, step: 10)
            Toggle(L10n.periodOfSilence, isOn: $checked)
                .padding(.bottom, 40)
            
            Button {
                presenter.goToTryGameView(with: GameLevel(label: .Custom,
                                                          area: searchAreaDistance,
                                                          duration: durationOfTheCompetition,
                                                          foxAmount: Int(amountOfFoxes),
                                                          foxDuration: Int(foxSoundDuration),
                                                          frequency: selectedFrequency == Frequency.MHz3dot5.rawValue ? Constants.Frequency.range_3_5 : Constants.Frequency.range_144_0,
                                                          hasSilenceInterval: checked))
            } label: {
                Text(L10n.start)
                    .font(.system(size: 24))
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity, maxHeight: 50)
                    .background(Color.appGreenColor)
                    .cornerRadius(15)
            }.shadow(color: .appGreenColor, radius: 2, x: 0, y: 5)
            
        }
        .padding(32)
        .background(
            Rectangle()
                .fill(Color.white)
                .cornerRadius(15)
                .padding(16)
        )
        .foregroundColor(.appCustomBrownColor)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black)
    }
}

