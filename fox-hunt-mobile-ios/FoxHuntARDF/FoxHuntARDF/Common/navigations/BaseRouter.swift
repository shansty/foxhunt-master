//
//  BaseRouter.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 1.11.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI
import UIKit

protocol BaseRouter {
    var navigationController: UINavigationController? { get set }

    func push<V: View>(view: V, animated: Bool)
    func pop()
    func popToRoot()

    func present<V: View>(view: V, transition: UIModalTransitionStyle)
    func dismiss(animated: Bool, completion: (() -> Void)?)
    func dissmisToRoot()
}

extension BaseRouter {
    var topVC: UIViewController? {
        var topVC = navigationController?.topViewController
        while let topPresentedVC = topVC?.presentedViewController {
            topVC = topPresentedVC
        }
        return topVC
    }

    func push<V: View>(view: V, animated: Bool = true) {
        let vc = UIHostingController(rootView: view)
        navigationController?.pushViewController(vc, animated: animated)
    }

    func push<V: View>(views: [V], animated: Bool = false) {
        var controllers = navigationController?.viewControllers ?? []
        views.forEach { view in
            controllers.append(UIHostingController(rootView: view))
        }
        navigationController?.setViewControllers(controllers, animated: animated)
    }

    func pop() {
        navigationController?.popViewController(animated: true)
    }

    func popToRoot() {
        navigationController?.popToRootViewController(animated: false)
    }

    func present<V: View>(view: V, transition: UIModalTransitionStyle = .crossDissolve) {
        let vc = UIHostingController(rootView: view)
        vc.modalPresentationStyle = .fullScreen
        vc.modalTransitionStyle = transition
        topVC?.present(vc, animated: true)
    }

    func dismiss(animated _: Bool = true, completion: (() -> Void)? = nil) {
        topVC?.dismiss(animated: true, completion: completion)
    }

    func dissmisToRoot() {
        navigationController?.topViewController?.dismiss(animated: false)
    }
}
