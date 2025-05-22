//
//  LocationService.swift
//  FoxHuntARDF
//
//  Created by Sergey Verlygo on 12/05/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import CoreLocation
import Combine

enum LocationStatus {
    case isGrantedPrecise
    case isGrantedApproximate
    case isDenied
    case isDisabled
    case isNotDetermined
}

protocol LocationService: Service {
    var currentLocationPublisher: Published<CLLocation?>.Publisher { get }
    var locationStatusPublisher : Published<LocationStatus?>.Publisher { get }
    func stopUpdatingLocation()
    func startUpdatingLocation()
    func requestWhenInUseAuthorization()
}

final class LocationServiceImpl: NSObject, LocationService {
    unowned var services: Services
    let log: Log?

    init(_ services: Services) {
        self.services = services
        log = services.resolve(Log.self) as? Log
        self.locationManager = CLLocationManager()
        super.init()
        self.locationManager.delegate = self
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBestForNavigation
    }

    var started = false

    func start() throws {
        log?.info("Location Service starting...", with: .common)
        log?.info("Location Service is ON", with: .common)
        started = true
    }

    func stop() -> Error? {
        log?.info("Location Service stopping...", with: .common)
        stopUpdatingLocation()
        log?.info("Location Service is OFF", with: .common)
        return nil
    }

    private var locationManager: CLLocationManager

    @Published private(set) var currentLocation: CLLocation?
    @Published private(set) var locationStatus : LocationStatus?

    var currentLocationPublisher: Published<CLLocation?>.Publisher { $currentLocation }
    var locationStatusPublisher: Published<LocationStatus?>.Publisher { $locationStatus }

    func startUpdatingLocation() {
        locationManager.startUpdatingLocation()
    }

    func stopUpdatingLocation() {
        locationManager.stopUpdatingLocation()
    }

    func requestWhenInUseAuthorization() {
        locationManager.requestWhenInUseAuthorization()
    }
}

extension LocationServiceImpl : CLLocationManagerDelegate {

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
            switch locationManager.authorizationStatus {
            case .restricted, .denied:
                if CLLocationManager.locationServicesEnabled() {
                    locationStatus =  .isDenied
                } else {
                    locationStatus = .isDisabled
                }

            case .authorizedAlways, .authorizedWhenInUse, .authorized:
                switch locationManager.accuracyAuthorization {
                case .fullAccuracy:
                    locationStatus = .isGrantedPrecise
                case .reducedAccuracy:
                    locationStatus = .isGrantedApproximate
                @unknown default:
                    locationStatus = .isGrantedApproximate
                }

            case .notDetermined:
                locationStatus = .isNotDetermined
            @unknown default:
                locationStatus = nil
            }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        currentLocation = locations.last
        log?.info("New user location: \(String(describing: locations.last))", with: .common)
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print(error.localizedDescription)
        //TODO: Handle the errors
    }
}
