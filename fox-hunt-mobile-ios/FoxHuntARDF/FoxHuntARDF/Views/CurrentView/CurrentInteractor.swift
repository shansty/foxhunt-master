//
//  CurrentInteractor.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 13.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Combine
import Foundation
import CoreLocation.CLLocation
import MediaPlayer

protocol CurrentInteractor: ModuleInteractor {
    var locationStatus: LocationStatus? { get }
    var timeRemainingPublisher : Published<TimeInterval?>.Publisher { get }
}

final class CurrentInteractorImpl: CurrentInteractor {

    typealias Presenter = CurrentPresenterImpl
    var presenter: CurrentPresenterImpl?

    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?

    var locationStatus : LocationStatus?
    var locationSubscriber : AnyCancellable?

    @Published private(set) var timeRemaining : TimeInterval? = 60.0
    var timeRemainingPublisher : Published<TimeInterval?>.Publisher { $timeRemaining }
    var timeRemainingSubscriber : AnyCancellable?

    @Published private(set) var needToFinishGame : Bool = false
    var needToFinishGamePublisher : Published<Bool>.Publisher { $needToFinishGame }
    var needToFinishGameSubscriber : AnyCancellable?

    @Published private(set) var activeFox : FoxGameEntity?
    var activeFoxPublisher : Published<FoxGameEntity?>.Publisher { $activeFox }
    var activeFoxSubscriber : AnyCancellable?

    @Published private(set) var foxes : [FoxGameEntity] = []
    var foxesPublisher : Published<[FoxGameEntity]>.Publisher { $foxes }
    var foxesSubscriber : AnyCancellable?

    @Published private(set) var distanseBetweenUserAndFox : CLLocationDistance?
    var distanseBetweenUserAndFoxPublisher : Published<CLLocationDistance?>.Publisher { $distanseBetweenUserAndFox }
    var distanseBetweenUserAndFoxSubscriber : AnyCancellable?

    @Published private(set) var currentLocation : CLLocationCoordinate2D?
    var currentLocationPublisher: Published<CLLocationCoordinate2D?>.Publisher { $currentLocation }

    var volume: Float?
    var volumeSubscriber: AnyCancellable?
    var timeSpent: TimeInterval?

    private var gameImmitationContainer : GameImmitationService?
    var gameImmitationService: GameImmitationService {
        get throws {
            guard let gameImmitationContainer else { throw FoxHuntMobileError.internalInconsistency }
            return gameImmitationContainer
        }
    }

    init() { }
    init(services: Services?) {
        self.services = services
        try? setupGameImmitationService()
        _ = try? locationService
    }

    var locationService: LocationService {
        get throws {
            guard let service = services?.resolve(LocationService.self) as? LocationService else {
                throw FoxHuntMobileError.internalInconsistency }
            service.startUpdatingLocation()
            locationSubscriber = service.currentLocationPublisher.sink { [weak self] newLocation in
                do {
                    try self?.gameImmitationService.userLocation = newLocation
                    self?.currentLocation = newLocation?.coordinate
                    try self?.gameImmitationService.searchFox()
                } catch {
                }
            }
            return service
        }
    }

    private func setupGameImmitationService() throws {
        guard let services = services else {
            throw FoxHuntMobileError.internalInconsistency }
        let service = GameImmitationServiceImpl(services: services)
        timeRemainingSubscriber = service.currentTimePublisher.sink { [weak self] timeRemaining in
            self?.timeRemaining = timeRemaining
            self?.timeSpent = service.startingTime - (timeRemaining ?? 0)
        }

        activeFoxSubscriber = service.currentActiveFoxPublisher.assign(to: \.activeFox, on: self)
        foxesSubscriber = service.foxesPublisher.assign(to: \.foxes, on: self)
        distanseBetweenUserAndFoxSubscriber = service.distanseBetweenUserAndFoxPublisher.assign(to: \.distanseBetweenUserAndFox, on: self)
        needToFinishGameSubscriber = service.needToFinishGamePublisher.assign(to: \.needToFinishGame, on: self)

        gameImmitationContainer = service
    }

    func startGame(with gameLevel: GameLevel){
        do {
            try gameImmitationService.startGame(with: gameLevel)
        } catch {
            print(error)
        }
    }

    func updateFrequency(suggestedActiveFoxFrequency: Double){
        try? gameImmitationService.suggestedActiveFoxFrequency = suggestedActiveFoxFrequency
        try? gameImmitationService.searchFox()
    }

    func updateVolume(newVolume: Float){
        MPVolumeView.setVolume(newVolume)
    }

    func updateRangeFoxFound(range: Double) {
           try? gameImmitationService.radiusFoxBecomesFound = 0...range
       }

    func stopGame(){
        try? gameImmitationService.stopGame()
    }
}
