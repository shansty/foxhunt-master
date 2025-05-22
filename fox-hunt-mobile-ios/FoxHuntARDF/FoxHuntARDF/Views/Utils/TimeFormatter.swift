//
//  TimeFormatter.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 15.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

func timeFormatter(timeInterval: TimeInterval?) -> String {
    if let time = timeInterval {
        let formatter = DateComponentsFormatter().string(from: time) ?? "00:00"
        if time < 60 && time > 9 {
            return "00:\(formatter)"
        } else if (0...9).contains(time){
            return "00:0\(formatter)"
        } else {
            return formatter
        }
    }
    return "00:00"
}
