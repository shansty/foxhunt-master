//
//  ActivityIndicatorButtonTitle.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 14.02.23.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import SwiftUI

struct ActivityIndicatorButtonTitle : View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.appAccentColor)
                .frame(maxWidth: .infinity)
                .frame(height: 50)
            ProgressView()
                .foregroundColor(.black)
        }
    }
}

