//
//  ActivityMapModel.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 29.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import MapKit

class ActivityMapModel: ObservableObject {
    @Published var currentPosition: CLLocationCoordinate2D
    @Published var activeFox: CLLocationCoordinate2D

    init(currentPosition: CLLocationCoordinate2D, activeFox: CLLocationCoordinate2D) {
        self.currentPosition = currentPosition
        self.activeFox = activeFox
    }

    func updateLocation(currentPosition: CLLocationCoordinate2D) {
        self.currentPosition =  currentPosition
    }

    func updateActiveFox(activeFox: CLLocationCoordinate2D) {
        self.activeFox = activeFox
    }
}
