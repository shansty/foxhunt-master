//
//  MainAlertPresenter.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 4.11.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import UIKit

final class MainAlertPresenter: AlertPresenter {
    static let shared = MainAlertPresenter()

    weak var navigationController: UINavigationController?

     init() {}
}
