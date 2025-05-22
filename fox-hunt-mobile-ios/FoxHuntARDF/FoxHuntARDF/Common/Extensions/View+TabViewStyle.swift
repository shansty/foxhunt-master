//
//  View+TabViewStyle.swift
//  FoxHuntARDF
//
//  Created by itechart on 17/05/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

extension View {
    func tabViewStyle(bgColor: Color?,
                      itemColor: Color?,
                      selectedColor: Color?,
                      badgeColor: Color?,
                      font: UIFont?
    ) -> some View {
        onAppear {
            let itemStyle = UITabBarItemAppearance()
            if let cgColor = itemColor?.cgColor {
                let uiItemClr = UIColor(cgColor: cgColor)
                itemStyle.normal.iconColor = uiItemClr

                if let font = font {
                    itemStyle.normal.titleTextAttributes = [
                        .font: font,
                        .foregroundColor: uiItemClr
                    ]
                    itemStyle.selected.titleTextAttributes = [
                        .font: font
                    ]
                } else {
                    itemStyle.normal.titleTextAttributes = [
                        .foregroundColor: uiItemClr
                    ]
                }
            }

            if let cgSelectedItemColor = selectedColor?.cgColor {
                let uiSelClr = UIColor(cgColor: cgSelectedItemColor)
                itemStyle.selected.iconColor = uiSelClr
                itemStyle.selected.titleTextAttributes = [
                    .foregroundColor: uiSelClr
                ]
            }

            if let cgBadgeColor = badgeColor?.cgColor {
                let uiBadgeClr = UIColor(cgColor: cgBadgeColor)
                itemStyle.normal.badgeBackgroundColor = uiBadgeClr
                itemStyle.selected.badgeBackgroundColor = uiBadgeClr
            }

            let appearance = UITabBarAppearance()
            if let cgBackgroundColor = bgColor?.cgColor {
                appearance.backgroundColor = UIColor(cgColor: cgBackgroundColor)
            }

            appearance.stackedLayoutAppearance = itemStyle
            appearance.inlineLayoutAppearance = itemStyle
            appearance.compactInlineLayoutAppearance = itemStyle

            UITabBar.appearance().standardAppearance = appearance
            if #available(iOS 15.0, *) {
                UITabBar.appearance().scrollEdgeAppearance = appearance
            }
        }
    }
}
