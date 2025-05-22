//
//  FoxListView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 08.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI
import MediaPlayer

struct FoxListView : View {
    @State var volumeValue: CGFloat = 0.3
    @State var frequencyValue: CGFloat = 3.40
    @State var upperBoundFoxesBecomeFound: CGFloat = 20.0
    @ObservedObject var presenter: CurrentPresenterImpl

    var body: some View {
        VStack {
            HStack(spacing: 20) {
                VStack {
                    ControlCircleView(convertedControlValue: $frequencyValue,
                                      range: Constants.Frequency.range_3_5)
                    .onChange(of: frequencyValue) { newValue in
                        presenter.updateFrequency(suggestedActiveFoxFrequency: Double(newValue).rounded(toPlaces: 2))
                    }
                    Text(L10n.frequency)
                        .font(.system(size: 18, weight: .heavy))
                        .foregroundColor(.white)
                        .padding(.top, 16)
                }
                VStack {
                    ControlCircleView(convertedControlValue: $volumeValue,
                                      range: Constants.Volume.range_0_1,
                                      toShowRounded: true)
                    .onChange(of: volumeValue) { newValue in
                        presenter.updateVolume(newVolume: Float(newValue))
                    }
                    Text(L10n.volume)
                        .font(.system(size: 18, weight: .heavy))
                        .foregroundColor(.white)
                        .padding(.top, 16)
                }
            }.padding(.top, 16)
            HStack {
                UISliderView(value: $upperBoundFoxesBecomeFound,
                             minValue: 0,
                             maxValue: 100,
                             thumbColor: .white,
                             minTrackColor: UIColor(Color.appPastelOrangeColor),
                             maxTrackColor: .black)
                Text("\(upperBoundFoxesBecomeFound, specifier: "%.2f")")
                    .font(.system(size: 18, weight: .heavy))
            }
            .onChange(of: upperBoundFoxesBecomeFound, perform: { newValue in
                    presenter.updateRangeFoxFound(range: newValue)
            })
            .padding()

            ScrollView(showsIndicators: false) {
                VStack {
                    ForEach(presenter.foxes, id: \.self) { fox in
                        FoxElementListView(fox: fox, presenter: presenter)
                    }
                }
            }
            .clipped()
            .cornerRadius(15)
            .padding()
        }
    }
}
