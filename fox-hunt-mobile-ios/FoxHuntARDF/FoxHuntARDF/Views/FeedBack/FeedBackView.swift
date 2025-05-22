//
//  FeedBackView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 21.02.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct StarsRateView : View {
    let starAmount = 5
    @State var rating = 0
    var body: some View {
        HStack(spacing: 20) {
            ForEach(1...starAmount, id: \.self) { star in
                Image(systemName: star <= rating ? "star.fill" : "star")
                    .resizable()
                    .frame(width: 40, height: 40)
                    .foregroundColor(.appAccentColor)
                    .onTapGesture {
                        rating = star
                    }
            }
        }
    }
}

struct FeedBackView : View {
    @State var text = ""
    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            Text(L10n.giveFeedback)
                .font(.system(size: 27, weight: .black))
            Text(L10n.pleaseRateYourExperience)
                .font(.system(size: 18, weight: .medium))
            StarsRateView()
                .padding(.bottom, 32)
            Text(L10n.careToShareMoreAboutIt)
                .font(.system(size: 18, weight: .medium))
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
            TextEditor(text: $text)
                .frame(height: 80)
                .padding(16)
                .overlay(
                    RoundedRectangle(cornerRadius: 15).stroke(Color.appAccentColor, lineWidth: 1))
                .padding([.horizontal])
            Spacer()
            Button {
                saveClick {
                }
            } label: {
                Text(L10n.share)
                    .font(.system(size: 24, weight: .medium))
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity, maxHeight: 50)
                    .background(Color.accentColor)
                    .cornerRadius(15)
            }
        }
    }
}

struct FeedBackView_Previews: PreviewProvider {
    static var previews: some View {
        FeedBackView()
    }
}
