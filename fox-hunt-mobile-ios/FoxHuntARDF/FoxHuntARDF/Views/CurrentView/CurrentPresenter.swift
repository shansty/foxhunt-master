//
//  CurrentPresenter.swift
//  FoxHuntARDF
//
//  Created by itechart on 06/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI
import Combine
import MapKit

protocol CurrentPresenter: ModulePresenter, ObservableObject {
}

class CurrentPresenterImpl: CurrentPresenter {

    typealias Interactor = CurrentInteractorImpl
    var interactor: Interactor? {
        didSet {
            timeRemainingSubscriber = interactor?.timeRemainingPublisher.assign(to: \.timeRemaining, on: self)
            foxesSubscriber = interactor?.foxesPublisher.assign(to: \.foxes, on: self)
            distanseBetweenUserAndFoxSubscriber = interactor?.distanseBetweenUserAndFoxPublisher.assign(to: \.distanseBetweenUserAndFox, on: self)
            activeFoxSubscriber = interactor?.activeFoxPublisher.compactMap{ $0 }.sink(receiveValue: { [weak self] newActiveFox in
                self?.activeFox = newActiveFox
                self?.mapModel?.updateActiveFox(activeFox: newActiveFox.location.coordinate)
            })
            currentLocationSubscriber = interactor?.currentLocationPublisher.compactMap{ $0 }.sink(receiveValue: { [weak self] newLocation in
                self?.currentLocation = newLocation
                self?.mapModel?.updateLocation(currentPosition: newLocation)
            })
            needToFinishGameSubscriber = interactor?.needToFinishGamePublisher.sink(receiveValue: { [weak self] newValue in
                if newValue {
                    self?.showGameResultsView()
                    self?.needToFinishGameSubscriber?.cancel()
                }
            })
        }
    }

    @ServicesProperty var services: Services?
    var gameLevel: GameLevel?
    private var gameResultsModule = GameResultsModule()
    weak var navigationController: UINavigationController?

    @Published var timeRemaining : TimeInterval?
    var timeRemainingSubscriber : AnyCancellable?

    @Published var activeFox : FoxGameEntity?
    var activeFoxSubscriber : AnyCancellable?

    @Published var foxes : [FoxGameEntity] = []
    var foxesSubscriber : AnyCancellable?

    @Published var needToFinishGame: Bool = false
    var needToFinishGameSubscriber : AnyCancellable?

    @Published var distanseBetweenUserAndFox : CLLocationDistance?
    var distanseBetweenUserAndFoxSubscriber : AnyCancellable?

    @Published var currentLocation : CLLocationCoordinate2D?
    var currentLocationSubscriber : AnyCancellable?

    var mapModel : ActivityMapModel?
    var router: CommonRouter? = MainRouter.shared
    required init() {}

    init(services: Services, navigationController: UINavigationController, gameLevel: GameLevel) {
        self.services = services
        self.navigationController = navigationController
        self.gameLevel = gameLevel
    }

    func startGame(){
        if let gameLevel {
            interactor?.startGame(with: gameLevel)
        }
    }

    func updateFrequency(suggestedActiveFoxFrequency: Double) {
        interactor?.updateFrequency(suggestedActiveFoxFrequency: suggestedActiveFoxFrequency)
    }

    func updateVolume(newVolume: Float) {
        interactor?.updateVolume(newVolume: newVolume)
    }

    func updateRangeFoxFound(range: Double) {
          interactor?.updateRangeFoxFound(range: range)
      }

    func showResults() {
        interactor?.stopGame()
    }

    func showMapView() {
        DispatchQueue.main.async { [weak self] in
            let currentVC = UIHostingController(rootView: self?.setActivityMapView())
            if let presentationController = currentVC.presentationController as? UISheetPresentationController {
                presentationController.detents = [.medium()]
            }
            self?.navigationController?.present(currentVC, animated: true)
        }
    }

    func showGameResultsView() {
        DispatchQueue.main.async { [weak self] in
            let currentVC = UIHostingController(rootView: self?.setGameResultsView())
            self?.navigationController?.setViewControllers([currentVC], animated: true)
        }
    }

    private func setActivityMapView() -> AnyView {
        if let currentPosition = currentLocation, let foxPosition = activeFox?.location {
            let model = ActivityMapModel(currentPosition: currentPosition,
                                         activeFox: foxPosition.coordinate)

            mapModel = model
            return AnyView(ActivityMapView(model: model,
                                           gameZone: MKCoordinateRegion(
                                            center: currentLocation!,
                                            span: MKCoordinateSpan(latitudeDelta: 0.02,
                                                                   longitudeDelta: 0.02))))
        } else {
            return AnyView(EmptyView())
        }
    }

    private func setGameResultsView() -> AnyView {
        if let services = services, let navigationController {
            let model = GameResultsModel(foundFoxCount: foxes.filter{$0.isFound == true}.count,
                                         allFoxCount: foxes.count,
                                         timeSpent: interactor?.timeSpent ?? 0)
            return AnyView(gameResultsModule.initialize(services,
                                                        navigationController: navigationController,
                                                        gameResultsModel: model))
        } else {
            return AnyView(EmptyView())
        }
    }
}
