//
//  ClickerSaver.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 13.02.23.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import SwiftUI

private var _tokenCalls: [String: Double] = [:]

func saveClick(file: String = #file,
               function: String = #function,
               line: Int = #line,
               interval: Double = 0.8,
               block: () -> Void) {
    let token = "\(file):\(function):\(line)"
    let now = Date().timeIntervalSince1970
    guard now - (_tokenCalls[token] ?? 0.0) > interval else {
        return
    }
    _tokenCalls[token] = now
    block()
}
