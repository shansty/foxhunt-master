//
//  AppDelegate.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 24.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI
import UIKit
import os

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    public let services: Services = ServicesImpl()

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        launchServices()
        let window = UIWindow(frame: UIScreen.main.bounds)
        let navigationController = NavigationController()
        let launchView = LaunchScreenView(navigationController: navigationController, services: services)
        navigationController.setViewControllers([UIHostingController(rootView: launchView)], animated: false)
        navigationController.navigationBar.isHidden = true
        window.rootViewController = navigationController
        window.makeKeyAndVisible()
        self.window = window
        
        return true
    }

    private func launchServices() {
        services.append(ConfigService.self, implementation: ConfigImpl(services))
        services.append(UserService.self, implementation: UserServiceImpl(services))
        services.append(LocationService.self, implementation: LocationServiceImpl(services))
        services.append(RemoteService.self, implementation: RemoteServiceImpl(services))
        services.append(GameImmitationService.self, implementation: GameImmitationServiceImpl(services: services))
        try? services.start()
        if let log = services.resolve(Log.self) as? Log {
            log.info("Services started", with: OSLog.common)
        }
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        //TODO: Disconnect sockets
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        //TODO: Connect sockets
    }
}
