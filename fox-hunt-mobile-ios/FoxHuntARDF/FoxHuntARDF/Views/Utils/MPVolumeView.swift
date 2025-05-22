//
//  MPVolumeView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 22.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import MediaPlayer

//Update system volume
extension MPVolumeView {
    static func setVolume(_ volume: Float) {
        let volumeView = MPVolumeView()
        let slider = volumeView.subviews.first(where: { $0 is UISlider }) as? UISlider

        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 0.01) {
            slider?.value = volume
        }
    }
}
