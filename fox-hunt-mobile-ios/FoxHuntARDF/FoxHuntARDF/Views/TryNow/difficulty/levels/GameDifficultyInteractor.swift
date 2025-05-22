//
//  GameDifficultyInteractor.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 11.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation

protocol GameDifficultyInteractor: ModuleInteractor {
}

final class GameDifficultyInteractorImpl: GameDifficultyInteractor {
    typealias Presenter = GameDifficultyPresenterImpl
    var presenter: GameDifficultyPresenterImpl?

    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?

    init() { }

    init(services: Services?) {
        self.services = services
    }
}
