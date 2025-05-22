//
//  GameLevels.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 09.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation

import SwiftUI

enum GameDifficulty: String, CaseIterable {
    case Easy
    case Normal
    case Hard
    case Advanced
    case Custom

    var gameDifficultyColor: Color {
        switch self {
        case .Easy:
            return Color.appGreenColor
        case .Normal:
            return Color.appYellowColor
        case .Hard:
            return Color.appRedColor
        case .Advanced:
            return Color.appPurpleColor
        case .Custom:
            return Color.appPastelOrangeColor
        }
    }

    var gameDifficultyLevel: GameLevel? {
        switch self {
        case .Easy:
            return GameLevel.Easy
        case .Normal:
            return GameLevel.Normal
        case .Hard:
            return GameLevel.Hard
        case .Advanced:
            return GameLevel.Advanced
        case .Custom:
            return nil
        }
    }
}

struct GameLevel {
    let label: GameDifficulty
    let area: Double
    let duration: TimeInterval
    let foxAmount: Int
    let foxDuration: Int
    let frequency: ClosedRange<Double>
    let hasSilenceInterval: Bool
}

extension GameLevel {
    static let Easy: GameLevel = GameLevel(label: .Easy,
                                                area: 100,
                                                duration: 1800,
                                                foxAmount: 1,
                                                foxDuration: 60,
                                                frequency: Constants.Frequency.range_3_5,
                                                hasSilenceInterval: false)
    static let Normal: GameLevel = GameLevel(label: .Normal,
                                                area: 300,
                                                duration: 1800,
                                                foxAmount: 3,
                                                foxDuration: 60,
                                                frequency: Constants.Frequency.range_3_5,
                                                hasSilenceInterval: false)

    static let Hard: GameLevel = GameLevel(label: .Hard,
                                                area: 500,
                                                duration: 1800,
                                                foxAmount: 3,
                                                foxDuration: 30,
                                                frequency: Constants.Frequency.range_3_5,
                                                hasSilenceInterval: true)

    static let Advanced: GameLevel = GameLevel(label: .Advanced,
                                                area: 1000,
                                                duration: 3600,
                                                foxAmount: 5,
                                                foxDuration: 60,
                                                frequency: Constants.Frequency.range_3_5,
                                                hasSilenceInterval: true)
}
