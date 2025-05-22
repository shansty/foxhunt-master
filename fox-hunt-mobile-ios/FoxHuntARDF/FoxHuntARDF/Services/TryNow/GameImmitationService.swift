//
//  GameImmitationService.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 11.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import CoreLocation
import Combine

protocol GameImmitationService: Service {
    func startGame(with gameLevel: GameLevel)
    func stopGame()
    func searchFox()
    var startingTime: TimeInterval { get }
    var userLocation: CLLocation? { set get }
    var suggestedActiveFoxFrequency: Double { set get }
    var radiusFoxBecomesFound: ClosedRange<Double> { set get }
    var foxesPublisher: Published<[FoxGameEntity]>.Publisher { get }
    var needToFinishGamePublisher : Published<Bool>.Publisher { get }
    var currentTimePublisher: Published<TimeInterval?>.Publisher { get }
    var currentActiveFoxPublisher: Published<FoxGameEntity?>.Publisher { get }
    var distanseBetweenUserAndFoxPublisher: Published<CLLocationDistance?>.Publisher { get }
}

final class GameImmitationServiceImpl: NSObject, GameImmitationService, ObservableObject {

    /// changing active fox every n min
    private var gameArea: Double = 300
    private var timer : Cancellable?
    private var timeToChangeActiveFox: Int = 60
    private var frequency : ClosedRange<Double> = Constants.Frequency.range_3_5

    private var isPlayingFoxSound: Bool = false
    private var isPlayingWhiteNoise: Bool = false

    var services: Services
    var startingTime: TimeInterval = TimeInterval.oneHour

    var started: Bool
    func start() throws {}
    func stop() -> Error? {
        return nil
    }

    init(services: Services, started: Bool = false) {
        self.services = services
        self.started = started
    }

    @Published var isActiveTimer: Bool = false

    @Published private(set) var foxes : [FoxGameEntity] = []
    var foxesPublisher: Published<[FoxGameEntity]>.Publisher { $foxes }

    @Published private(set) var distanseBetweenUserAndFox : CLLocationDistance?
    var distanseBetweenUserAndFoxPublisher: Published<CLLocationDistance?>.Publisher { $distanseBetweenUserAndFox }

    @Published private(set) var currentTime : TimeInterval?
    var currentTimePublisher: Published<TimeInterval?>.Publisher { $currentTime }

    @Published private(set) var activeFox : FoxGameEntity?
    var currentActiveFoxPublisher: Published<FoxGameEntity?>.Publisher { $activeFox }

    @Published private(set) var needToFinishGame : Bool = false
    var needToFinishGamePublisher: Published<Bool>.Publisher { $needToFinishGame }

    var userLocation: CLLocation?
    var suggestedActiveFoxFrequency: Double = 3.40
    var radiusFoxBecomesFound: ClosedRange<Double> = 0.0...20.0
    var foxesToFind : [FoxGameEntity] { foxes.filter{ $0.isFound == false } }

    func startGame(with gameLevel: GameLevel) {
        generateGame(with: gameLevel)
        manageTimer()
    }

    func stopGame() {
        Sound.shared.stopPlayer()
        manageTimer()
        needToFinishGame = true
    }

    private func generateGame(with gameLevel: GameLevel) {
        self.gameArea = gameLevel.area
        self.frequency = gameLevel.frequency
        self.startingTime = gameLevel.duration
        self.currentTime = startingTime
        self.timeToChangeActiveFox = gameLevel.foxDuration
        generateFoxEntities(foxCount: gameLevel.foxAmount)
    }

    private func manageTimer() {
        if isActiveTimer {
            isActiveTimer = false
            timer?.cancel()
        } else {
            timer = Timer.publish(every: 1, on: .main, in: .default)
                .autoconnect()
                .sink(receiveValue: { [weak self] newTime in
                    self?.onTimerCounting()
                }) as Cancellable
            isActiveTimer = true
        }
    }

    @objc func onTimerCounting() {
        guard let currentTime, currentTime > 0 else {
            stopGame()
            return
        }
        self.currentTime = currentTime - 1
        if foxesToFind.isEmpty {
            stopGame()
        }
        if Int((startingTime - currentTime)) % timeToChangeActiveFox == 0 {
            manageActiveFox()
            searchFox()
        }
    }

    private func manageActiveFox() {
        clearIsActiveFox()
        self.distanseBetweenUserAndFox = nil

        let foxesToFind = foxes.filter{ $0.isFound == false }
        if !foxesToFind.isEmpty {
            activeFox = foxesToFind.randomElement()
            guard var activeFox else { return }
            activeFox.isActive = true
            self.distanseBetweenUserAndFox = distanseBetweenUserAndFox
            foxes = foxes.map {
                var fox = $0
                if $0.id == activeFox.id { fox.isActive = true }
                return fox
            }
            searchFox()
        } else {
            stopGame()
        }
    }

    private func distanseBetweenUserAndFox(_ foxLocation: CLLocation) -> CLLocationDistance? {
        (userLocation != nil) ? userLocation?.distance(from: foxLocation) : nil
    }

    func backgroundFoxesSearch() {
        foxes = foxes.map {
            var fox = $0
            if let distanseBetweenUserAndFox = distanseBetweenUserAndFox(fox.location), radiusFoxBecomesFound.contains(distanseBetweenUserAndFox) {
                fox.isFound = true
            }
            return fox
        }
    }

    func searchFox(){
        backgroundFoxesSearch()

        guard let currentTime, currentTime > 0, !foxesToFind.isEmpty else {
            return
        }

        guard let activeFox,
              let distanseBetweenUserAndFox = distanseBetweenUserAndFox(activeFox.location)
        else { return }

        self.distanseBetweenUserAndFox = distanseBetweenUserAndFox

        if activeFox.frequency == suggestedActiveFoxFrequency {
            if radiusFoxBecomesFound.contains(distanseBetweenUserAndFox) {
                foxes = foxes.map {
                    var fox = $0
                    if $0.id == activeFox.id { fox.isFound = true }
                    return fox
                }
                self.activeFox = nil
                manageActiveFox()
            } else {
                isPlayingWhiteNoise = false
                if !isPlayingFoxSound {
                    isPlayingFoxSound = true
                    Sound.shared.stopPlayer()
                    Sound.shared.playSignal(resource: soundFoxCorrespondense(id: activeFox.id))
                }
            }
        }
        else {
            if !isPlayingWhiteNoise {
                isPlayingWhiteNoise = true
                isPlayingFoxSound = false
                Sound.shared.playSignal(resource: Files.whiteNoiseMp3.name)
            }
        }
    }

    private func generateFoxEntities(foxCount: Int) {
        if let userLocation {
            foxes.append(contentsOf: (0..<foxCount).map { i in
                let location = setRandomCoordinate(coordinate: userLocation.coordinate, meters: gameArea)
                return FoxGameEntity(id: FoxId(rawValue: i+1) ?? .First,
                                     location: location,
                                     isFound: false,
                                     isActive: false,
                                     frequency: randomFrequency(),
                                     soundCorrespondence: soundFoxCorrespondense(id: FoxId(rawValue: i) ?? .First))
            })
        }
    }

    private func randomFrequency() -> Double {
        return Double(.random(in: self.frequency)).rounded(toPlaces: 2)
    }

    private func setRandomCoordinate(coordinate: CLLocationCoordinate2D, meters: Double) -> CLLocation {
        let earthRadiusInKm = 6378.137
        let meterInDegree = (1 / ((2 * .pi / 360) * earthRadiusInKm)) / 1000

        let newLatitude = coordinate.latitude + (Double(.random(in: 0...meters)) * meterInDegree)
        let newLongitude = coordinate.longitude + (Double(.random(in: 0...meters)) * meterInDegree) / cos(coordinate.latitude * (.pi / 180))
        return CLLocation(latitude: newLatitude, longitude: newLongitude)
    }

    private func soundFoxCorrespondense(id: FoxId) -> String {
        switch id {
        case .First:
            return Files.FoxSounds.soundOfFox1Mp3.name
        case .Second:
            return Files.FoxSounds.soundOfFox2Mp3.name
        case .Third:
            return Files.FoxSounds.soundOfFox3Mp3.name
        case .Fouth:
            return Files.FoxSounds.soundOfFox4Mp3.name
        case .Fifth:
            return Files.FoxSounds.soundOfFox5Mp3.name
        }
    }

    private func clearIsActiveFox(){
        for index in foxes.indices {
            foxes[index].isActive = false
        }
    }
}
