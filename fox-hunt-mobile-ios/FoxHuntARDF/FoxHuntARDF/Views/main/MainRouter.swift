//
//  MainRouter.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 1.11.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

class CommonRouter: BaseRouter, ObservableObject {
    static let shared = CommonRouter()

    weak var navigationController: UINavigationController?
    private init() {}

    func reset() {
        popToRoot()
        dissmisToRoot()
    }
}

final class MainRouter: CommonRouter {
}

final class RegistationRouter: CommonRouter {
}

enum DebugRoutingType {
    case localBuild
    case remoteBuild
    case all
}
