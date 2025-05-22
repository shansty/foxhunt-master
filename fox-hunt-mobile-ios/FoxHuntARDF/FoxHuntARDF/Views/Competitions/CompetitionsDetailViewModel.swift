//
//  CompetitionsDetailViewModel.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 19.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import MapKit

struct CompetionsDetailSettings {
    var id: IDType
    var status: CompetitionState
    var foxesCount: UInt
    var duration: String
    var distance: String
    var participants: UInt
    var date: String
    var approximateTime: String 
    var hasSilence: Bool
    var coordinates: MKCoordinateRegion
}

struct CompetitionsDetailViewModel {
    var name: String
    var location: String
    var coach: String
    var comment: String
    var settings: CompetionsDetailSettings
}
