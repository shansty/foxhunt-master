//
//  AlertPresenter.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 4.11.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

import SwiftUI
import UIKit

struct AlertInfo {
    var title: String? = nil
    var message: String? = nil
    var buttons: [Button]

    struct Button {
        var title: String
        var style: UIAlertAction.Style = .default
        var action: () -> Void
    }
}

protocol AlertPresenter {
    var navigationController: UINavigationController? { get set }

    func show(alert: AlertInfo)
    func show(actionSheet: AlertInfo)
}

extension AlertPresenter {
    private var topVC: UIViewController? {
        var topVC = navigationController?.topViewController
        
        while let topPresentedVC = topVC?.presentedViewController {
            topVC = topPresentedVC
        }
        return topVC
    }


    func show(alert: AlertInfo) {
        let alertController = UIAlertController(title: alert.title,
                                                message: alert.message,
                                                preferredStyle: .alert)
        alert.buttons.forEach { button in
            let alertAction = UIAlertAction(title: button.title,
                                            style: button.style,
                                            handler: { _ in button.action() })
            alertController.addAction(alertAction)
        }
        topVC?.present(alertController, animated: true)
    }

    func show(actionSheet: AlertInfo) {
        let alertController = UIAlertController(title: actionSheet.title,
                                                message: actionSheet.message,
                                                preferredStyle: .actionSheet)
        actionSheet.buttons.forEach { button in
            let alertAction = UIAlertAction(title: button.title,
                                            style: button.style,
                                            handler: { _ in button.action() })
            alertController.addAction(alertAction)
        }
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        topVC?.present(alertController, animated: true)
    }
}
