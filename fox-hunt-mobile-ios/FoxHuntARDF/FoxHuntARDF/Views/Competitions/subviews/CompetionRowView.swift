//
//  CompetionRowView.swift
//  FoxHuntARDF
//
//  Created by itechart on 18/05/2022.
//  Edited by IvannaVasilkova on 19/01/2023
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI
import MapKit

struct CompetionRowView: View {
    @State var model: CompetitionsDetailViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("\(model.name)")
                    .font(.system(.headline))
                Spacer()
                Text("\(model.settings.participants)")
                    .font(.system(.headline))
                Image(systemName: "person.fill")
                    .padding(.trailing, 8)
            }
            HStack{
                Image(systemName: "location.fill")
                Text("\(model.location)")
                    .font(.system(.headline))
            }
            HStack {
                Text(" \(model.settings.status.rawValue) ")
                    .font(Font.system(size: 15, weight: .semibold, design: .default))
                    .padding(5)
                    .foregroundColor(Color.white)
                    .background(colorFromStatus(model.settings.status))
                    .cornerRadius(15)
                Text("\(model.settings.date) by \(model.coach)")
                    .font(Font.system(size: 14, weight: .light, design: .default))
                    .italic()
            }
            .padding(.bottom)
        }
        .padding(8)
        .background(Color.white)
        .foregroundColor(Color.black)
        .cornerRadius(15)
        .padding(.horizontal)
    }

    private func colorFromStatus(_ status: CompetitionState) -> Color {
        switch status {
        case .canceled: return ThemeUI.Competition.canceledClr
        case .finished: return ThemeUI.Competition.finishedClr
        case .scheduled: return ThemeUI.Competition.scheduledClr
        case .running: return ThemeUI.Competition.runningClr
        }
    }
}

struct CompetionRowView_Previews: PreviewProvider {
    static let mockModel = CompetitionsDetailViewModel(name: "Krzyżówka",
                                                       location: "Rondo ONZ",
                                                       coach: "Alex Belyaev",
                                                       comment: "Any details",
                                                       settings: CompetionsDetailSettings(id: 1,
                                                                                          status: .running,
                                                                                          foxesCount: 3,
                                                                                          duration: "00:00",
                                                                                          distance: "30m",
                                                                                          participants: 5,
                                                                                          date: "19.01.2023",
                                                                                          approximateTime: "30min",
                                                                                          hasSilence: true,
                                                                                          coordinates: MKCoordinateRegion(
                                                                                            center: CLLocationCoordinate2D(latitude: 53.893009, longitude: 27.567444), // Minsk
                                                                                            span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2))))
    static var previews: some View {
        CompetionRowView(model: Self.mockModel)
    }
}
