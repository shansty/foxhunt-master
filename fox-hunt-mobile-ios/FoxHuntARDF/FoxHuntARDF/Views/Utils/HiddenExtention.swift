//
//  HiddenExtention.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 09.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

extension View {
    func hidden(_ shouldHide: Bool) -> some View {
        opacity(shouldHide ? 0 : 1)
    }
}
