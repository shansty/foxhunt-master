//
//  GameResultsPresenter.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 02.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol GameResultsPresenter : ModulePresenter {
    var services: Services? { set get }
}

class GameResultsPresenterImpl: GameResultsPresenter , ObservableObject{

    typealias Interactor = GameResultsInteractorImpl
    var interactor: GameResultsInteractorImpl?

    weak var navigationController : UINavigationController?
    private var tryNowModule = TryNowModule()

    @LoggerProperty var logger: Log?

    var services: Services?
    var router: CommonRouter? = MainRouter.shared

    required init() {}

    init(services: Services, navigationController: UINavigationController){
        self.services = services
        self.navigationController = navigationController
    }

    func showTryNowView() {
        DispatchQueue.main.async { [weak self] in
            let currentVC = UIHostingController(rootView: self?.setTryNowView())
            self?.navigationController?.setViewControllers([currentVC], animated: true)
        }
    }

    private func setTryNowView() -> AnyView {
        if let services = services, let navigationController {
            return AnyView(tryNowModule.initialize(services, navigationController: navigationController))
        } else {
            return AnyView(EmptyView())
        }
    }
}
