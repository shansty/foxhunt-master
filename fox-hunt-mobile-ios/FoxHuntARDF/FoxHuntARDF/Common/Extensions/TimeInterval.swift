//
//  TimeInterval.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 28.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

extension TimeInterval {
    static func minutes(_ n: Int) -> TimeInterval { return Double(n)*60; }
    static func hours(_ n: Int) -> TimeInterval { return Double(n)*60*60; }
    static func seconds(_ n: Int) -> TimeInterval { return Double(n) }
    static let oneHour: TimeInterval = 3600
}
