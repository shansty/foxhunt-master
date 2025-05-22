//
//  AlertViewState.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 14.02.23.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation

final class AlertViewState: ObservableObject {
    @Published var showErrorMessageAlert = false
    @Published var errorDescription: String = ""

    func clean(){
        showErrorMessageAlert = false
        errorDescription = ""
    }
}

extension AlertViewState {
    static var previewValue = AlertViewState()
}
