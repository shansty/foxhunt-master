//
//  Double.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 21.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

extension Double {
    /// Rounds the double to decimal places value
    func rounded(toPlaces places:Int) -> Double {
        let divisor = pow(10.0, Double(places))
        return (self * divisor).rounded() / divisor
    }
}
