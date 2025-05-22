//
//  GameResultsInteractor.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 02.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation

protocol GameResultsInteractor: ModuleInteractor {
}

final class GameResultsInteractorImpl: GameResultsInteractor {
    typealias Presenter = GameResultsPresenterImpl
    var presenter: GameResultsPresenterImpl?

    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?

    init() { }

    init(services: Services?) {
        self.services = services
    }
}
