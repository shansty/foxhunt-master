//
//  FoxGameEntity.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 15.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import CoreLocation

enum FoxId : Int {
    case First = 1
    case Second = 2
    case Third = 3
    case Fouth = 4
    case Fifth = 5
}

struct FoxGameEntity : Hashable {
    let id: FoxId
    var location: CLLocation
    var isFound: Bool
    var isActive: Bool
    var frequency: Double
    let soundCorrespondence: String
}
