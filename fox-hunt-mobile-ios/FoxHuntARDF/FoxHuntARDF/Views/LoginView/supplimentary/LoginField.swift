//
//  LoginField.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 14.02.23.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import SwiftUI

struct LoginField : View {
    @State var text: String
    @State var placeholder: String
    @Binding var fieldValue: String
    var isSecureField: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(text)
                .fontWeight(.semibold)
                .font(.system(size: 18.0))
                .multilineTextAlignment(.leading)
                .foregroundColor(.appLightOrangeColor)

            (isSecureField
             ? AnyView(SecureField(placeholder, text: $fieldValue))
             : AnyView(TextField(placeholder, text: $fieldValue)))
            .padding(10)
            .background(Color.white)
            .autocapitalization(.none)
            .font(.system(size: 18.0))
            .foregroundColor(.appCustomBrownColor)
            .cornerRadius(5)
        }
    }
}
