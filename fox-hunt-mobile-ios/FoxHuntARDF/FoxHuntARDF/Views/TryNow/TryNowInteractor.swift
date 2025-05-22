//
//  TryNowInteractor.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 08.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Combine
import Foundation
import CoreLocation.CLLocation

protocol TryNowInteractor: ModuleInteractor {
    var currentLocationPublisher: Published<CLLocation?>.Publisher { get }
    var locationStatusPublisher: Published<LocationStatus?>.Publisher { get }
}

final class TryNowInteractorImpl: TryNowInteractor {
    typealias Presenter = TryNowPresenterImpl
    var presenter: TryNowPresenterImpl?

    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?

    @Published var locationStatus : LocationStatus?
    var locationStatusPublisher: Published<LocationStatus?>.Publisher { $locationStatus }
    var locationStatusSubscriber : AnyCancellable?

    @Published var currentLocation : CLLocation?
    var currentLocationPublisher: Published<CLLocation?>.Publisher { $currentLocation }
    var locationSubscriber : AnyCancellable?

    init() { }

    init(services: Services?) {
        self.services = services
    }

    var locationService: LocationService {
        get throws {
            guard let service = services?.resolve(LocationService.self) as? LocationService else {
                throw FoxHuntMobileError.internalInconsistency }
            locationStatusSubscriber = service.locationStatusPublisher.sink { [weak self] newStatus in
                self?.locationStatus = newStatus
                guard (self?.locationStatus != nil) else { return }
                switch self?.locationStatus {
                case .isGrantedPrecise:
                    service.startUpdatingLocation()
                    self?.locationSubscriber = service.currentLocationPublisher.sink{ [weak self] newLocation in
                        self?.currentLocation = newLocation
                    }
                case .none, .isDenied, .isDisabled, .isGrantedApproximate, .isNotDetermined:
                    break
                }
            }
            return service
        }
    }
}
