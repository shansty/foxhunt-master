//
//  MapLocationModel.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 29.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import MapKit

enum LocationPointName : String {
    case ActiveFox
    case Player
}

struct MapLocationModel: Identifiable {
    let id = UUID()
    let name: LocationPointName
    let latitude: Double
    let longitude: Double
    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}
