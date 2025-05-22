//
//  GameSettingsInteractor.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 12.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import Foundation

protocol GameSettingsInteractor: ModuleInteractor {
}

final class GameSettingsInteractorImpl: GameSettingsInteractor {
    typealias Presenter = GameSettingsPresenterImpl
    var presenter: GameSettingsPresenterImpl?

    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?

    init() { }

    init(services: Services?) {
        self.services = services
    }
}
