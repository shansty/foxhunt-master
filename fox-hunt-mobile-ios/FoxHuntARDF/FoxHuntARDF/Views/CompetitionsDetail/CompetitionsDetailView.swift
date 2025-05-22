//
//  CompetitionsDetailView.swift
//  FoxHuntARDF
//
//  Created by itechart on 19/05/2022.
//  Edited by IvannaVasilkova on 19/01/2023
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI
import MapKit

struct CompetitionsDetailView: View {
    @State var model: CompetitionsDetailViewModel
    let presenter: CompetitionsPresenterImpl
    
    var body: some View {
        VStack {
            NavigationHeaderView(action: {
                presenter.goBack()
            }, text: L10n.competition)
            descriptionHeader()
            ScrollView(showsIndicators: false) {
                VStack {
                    settingsInfo()
                        .padding()
                    Map(coordinateRegion: $model.settings.coordinates)
                        .cornerRadius(15)
                        .frame(height: 250)
                        .padding(.horizontal)
                }
            }
            buttonsRow()
        }
        .background(.black)
        .foregroundColor(.white)
    }
    
    private func row(withTitle title: String, andValue value: String) -> some View {
        HStack {
            Text(title)
            Spacer()
            Text(value)
                .italic()
        }
        .font(.system(size: 18, weight: .medium))
    }
    
    private func descriptionHeader() -> some View {
        VStack {
            Text(model.name)
                .font(.system(size: 24, weight: .black))
                .padding([.horizontal, .bottom])
            row(withTitle: L10n.coach, andValue: model.coach)
            row(withTitle: L10n.date, andValue: model.settings.date)
            row(withTitle: L10n.location, andValue: model.location)
        }
        .padding()
        .background(
            Rectangle()
                .fill(Color.Gradients.topWhiteBottonPastelOrange)
                .cornerRadius(15)
        )
    }
    
    private func settingsInfo() -> some View {
        VStack {
            row(withTitle: L10n.numberOfFoxes, andValue: "\(model.settings.foxesCount)")
            Divider()
                .background(Color.white)
            row(withTitle: L10n.duration, andValue: model.settings.duration)
            Divider()
                .background(Color.white)
            row(withTitle: L10n.participants, andValue: "\(model.settings.participants)")
            Divider()
                .background(Color.white)
            row(withTitle: L10n.approximateTime, andValue: model.settings.approximateTime)
            Divider()
                .background(Color.white)
            row(withTitle: L10n.periodOfSilence,
                andValue: "\(model.settings.hasSilence ? L10n.yes : L10n.no)")
        }
    }
    
    private func buttonsRow() -> some View {
        HStack {
            Button {
            } label: {
                Text(L10n.decline)
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity, minHeight: 15.0, maxHeight: 40.0)
                    .background(Color.red)
                    .cornerRadius(15)
            }
            Button {
            } label: {
                Text(L10n.join)
                    .fontWeight(.black)
                    .frame(maxWidth: .infinity, minHeight: 15.0, maxHeight: 40.0)
                    .background(Color.appPastelOrangeColor)
                    .cornerRadius(15)
            }
        }.frame(minWidth: 0, maxWidth: .infinity)
    }
}

// FOR THE PREVIEW
extension CompetionsDetailSettings {
    static let testSettings = CompetionsDetailSettings(
        id: 1,
        status: .running,
        foxesCount: 1,
        duration: "20min",
        distance: "700m",
        participants: 0,
        date: "Monday, March 22, 2021",
        approximateTime: "1:07 PM",
        hasSilence: false,
        coordinates: MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: 53.893009, longitude: 27.567444), // Minsk
            span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2))
    )
}

extension CompetitionsDetailViewModel {
    static let testValue = CompetitionsDetailViewModel(
        name: "Birthday competition",
        location: "Red carpets",
        coach: "Petya Utochkin",
        comment: "No",
        settings: CompetionsDetailSettings.testSettings)
}

struct CompetitionsDetailView_Previews: PreviewProvider {
    static var previews: some View {
        CompetitionsDetailView(model: .testValue, presenter: CompetitionsPresenterImpl())
    }
}
