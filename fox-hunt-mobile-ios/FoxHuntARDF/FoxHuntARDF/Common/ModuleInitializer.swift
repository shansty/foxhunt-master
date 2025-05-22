//
//  ModuleInitializer.swift
//  FoxHuntARDF
//
//  Created by itechart on 14/06/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

protocol ModulePresenter {
    associatedtype Interactor: ModuleInteractor

    var services: Services? { get set }
    var interactor: Interactor? { get set }
    var router: CommonRouter? { get set }

    init()
    init(services: Services?)
}

extension ModulePresenter {
    init(services: Services?) {
        self.init()
        self.services = services
    }
}

extension ModulePresenter {
    func goBack() {
        router?.pop()
    }

    func goToNextScreen(view: AnyView) {
        router?.push(view: view, animated: true)
    }
}

protocol ModuleInteractor: ObservableObject {
    associatedtype Presenter: ModulePresenter
    var presenter: Presenter? { get set }

    var services: Services? { get set }

    init()
    init(services: Services?)
}

protocol ModuleView {
    associatedtype Presenter: ModulePresenter
    var presenter: Presenter { get set }
}

protocol ModuleInitializer {
    associatedtype Presenter: ModulePresenter
    associatedtype Interactor: ModuleInteractor
    associatedtype SomeView: View

    func initialize(_ services: Services) -> SomeView?
}
