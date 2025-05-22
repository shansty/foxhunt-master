//
//  Array.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 28.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

extension Array {
    func safeGet(_ index: Int) -> Element? {
        if count > index, index >= 0 {
            return self[index]
        }
        return nil
    }
}
