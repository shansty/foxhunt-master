//
//  ColoredTextView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 27.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

func coloredText(str: String, searched: String, seachedTextColor: Color, baseTextColor: Color) -> Text {
    
    var result: Text!
    
    let parts = str.components(separatedBy: searched)
    
    guard !str.isEmpty && !searched.isEmpty else {
        return Text(str)
    }
    
    for i in parts.indices {
        result = (result == nil ? Text(parts.safeGet(i) ?? "") : result + Text(parts.safeGet(i) ?? ""))
        
        if i != parts.count - 1 {
            result = result.foregroundColor(baseTextColor) + Text(searched).foregroundColor(seachedTextColor)
        }
    }
    return result.foregroundColor(baseTextColor)
}
