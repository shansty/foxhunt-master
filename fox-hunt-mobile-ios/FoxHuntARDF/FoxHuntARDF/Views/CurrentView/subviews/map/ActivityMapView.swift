//
//  ActivityMapView.swift
//  FoxHuntARDF
//
//  Created by itechart on 19/05/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI
import MapKit

struct ActivityMapView: View {
    @ObservedObject var model: ActivityMapModel
    @State var gameZone: MKCoordinateRegion

    var body: some View {
        Map(coordinateRegion: $gameZone,
            interactionModes: .all,
            annotationItems: mapLocations()) { loc in
            return MapPin(coordinate: loc.coordinate, tint: loc.name.colorForLabel)
        }
    }

    func  mapLocations() -> [MapLocationModel] {
        return  [
            MapLocationModel(name: .ActiveFox,
                             latitude: model.activeFox.latitude,
                             longitude: model.activeFox.longitude),
            MapLocationModel(name: .Player,
                             latitude: model.currentPosition.latitude,
                             longitude: model.currentPosition.longitude)
        ]
    }
}

extension LocationPointName {
    var colorForLabel : Color {
        switch self {
        case .ActiveFox: return Color.appAccentColor
        case .Player: return Color.green
        }
    }
}

/// For test execution

extension ActivityMapModel {
    static var testValues = ActivityMapModel(
        currentPosition: CLLocationCoordinate2D(latitude: 53.894509, longitude: 27.569444), activeFox: CLLocationCoordinate2D(latitude: 53.894009, longitude: 27.577444)
    )
    static var gameZone = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 53.893009, longitude: 27.567444), // Minsk
        span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02))
}

struct ActivityMapView_Previews: PreviewProvider {
    static var previews: some View {
        ActivityMapView(model: .testValues, gameZone: ActivityMapModel.gameZone)
    }
}
