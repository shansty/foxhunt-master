//
//  Sounds.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 07.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import AVFoundation

class Sound: NSObject, AVAudioPlayerDelegate {

    typealias Mp3Resource = String

    var avAudioPlayer: AVAudioPlayer?

    public static let shared = Sound()

    private override init() {
        super.init()
    }

    func stopPlayer() {
        if let avAudioPlayer, avAudioPlayer.isPlaying {
            avAudioPlayer.stop()
        }
    }

    func playSignal(resource: Mp3Resource) { 
        stopPlayer()

        let path = Bundle.main.path(forResource: resource, ofType: "mp3") ?? ""
        let url = URL(fileURLWithPath: path)

        do {
            try AVAudioSession.sharedInstance().setCategory(AVAudioSession.Category.playback) // for playing music in the Silent mode
            try AVAudioSession.sharedInstance().setActive(true)

            avAudioPlayer?.delegate = self
            avAudioPlayer = try AVAudioPlayer(contentsOf: url)
            avAudioPlayer?.numberOfLoops = -1 // replay
            avAudioPlayer?.play()
        } catch {
            fatalError("Signal sound is absent. \(error)")
        }
    }
}
