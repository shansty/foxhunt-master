//
//  Colors+Images.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 10.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

extension Color {
    static let appForegroundColor = Color(Asset.Colors.appForegroundColor.color)
    static let appBackgroundColor = Color(Asset.Colors.appBackgroundColor.color)
    static let appTextBlackColor = Color(Asset.Colors.appTextBlackColor.color)
    static let appTextWhiteColor = Color(Asset.Colors.appTextWhiteColor.color)
    static let appCellBackgroundkColor = Color(Asset.Colors.appCellBackgroundkColor.color)
    static let appCustomBrownColor = Color(Asset.Colors.appCustomBrown.color)
    static let appAccentColor = Color(Asset.Colors.accentColor.color)
    static let appDarkOrangeColor = Color(Asset.Colors.appDarkOrange.color)
    static let appLightOrangeColor = Color(Asset.Colors.appLightOrange.color)
    static let appPastelOrangeColor = Color(Asset.Colors.appPastelOrange.color)
    static let appPastelGrayColor = Color(Asset.Colors.appPastelGray.color)
    static let appPastelRedColor = Color(Asset.Colors.appPastelRedColor.color)
    static let appGreenColor = Color(Asset.Colors.appGreenColor.color)
    static let appPurpleColor = Color(Asset.Colors.appPurpleColor.color)
    static let appRedColor = Color(Asset.Colors.appRedColor.color)
    static let appYellowColor = Color(Asset.Colors.appYellowColor.color)
    static let appPastelLightOrangeColor = Color(Asset.Colors.appPastelLightOrangeColor.color)
}

extension Color {
    enum Gradients {
        static var topCustomBrownColorBottomAccentColor: LinearGradient {
            LinearGradient(colors: [.appCustomBrownColor, .accentColor],
                           startPoint: .topLeading, endPoint: .bottom)
        }
        static var topPastelOrangeColorBottonWhite : LinearGradient {
            LinearGradient(colors: [.appTextWhiteColor, .appPastelOrangeColor],
                           startPoint: .topLeading, endPoint: .bottomTrailing)
        }
        static var topWhiteBottonPastelOrange : LinearGradient {
            LinearGradient(colors: [.white.opacity(0.4), .appPastelOrangeColor.opacity(0.4)],
                           startPoint: .topLeading, endPoint: .bottomTrailing)
        }
        
        static var topPastelOrangeBottonWhite : LinearGradient {
            LinearGradient(colors: [.appPastelOrangeColor.opacity(0.8), .white.opacity(0.4)],
                           startPoint: .topLeading, endPoint: .bottomTrailing)
        }
        
        static var topStartPastelOrangeColorBottonWhite : LinearGradient {
            LinearGradient(colors: [.appTextWhiteColor, .appPastelOrangeColor],
                           startPoint: .bottom, endPoint: .top)
        }
    }
}


extension Image {
    static let appFoxLogo = Image(uiImage: Asset.Images.foxLogo.image)
}

