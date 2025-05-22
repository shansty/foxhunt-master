//
//  NavigationView.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 3.02.23.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import SwiftUI

struct NavigationHeaderView: View {
    let action: () -> Void
    let text: String
    var showBackButton: Bool = true

    var body: some View {
        HStack {
            Button {
                action()
            } label: {
                Image(systemName: "arrow.left")
                    .resizable()
                    .foregroundColor(showBackButton ? .white : .clear)
                    .font(.system(size: 15, weight: .bold))
                    .frame(width: 15, height: 15, alignment: .leading)
            }

            Spacer()

            Text(text)
                .foregroundColor(.white)
                .font(.system(size: 21, weight: .bold))
                .frame(alignment: .center)
                .padding(.leading, -15)

            Spacer()
        }
        .padding(.horizontal, 24)
        .frame(height: 40)
    }
}

struct NavigationView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationHeaderView(action: {}, text: "TextView")
    }
}
