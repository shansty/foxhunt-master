//
//  NavigationController.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 24.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

import UIKit
import SwiftUI

/// https://stackoverflow.com/a/60598558
class NavigationController: UINavigationController {
    var isSwipeToBackEnabled = true

    override func viewDidLoad() {
        super.viewDidLoad()
        setupFullWidthBackGesture()
    }

    private lazy var fullWidthBackGestureRecognizer = UIPanGestureRecognizer()

    private func setupFullWidthBackGesture() {
        guard
            let interactivePopGestureRecognizer = interactivePopGestureRecognizer,
            let targets = interactivePopGestureRecognizer.value(forKey: "targets")
        else {
            return
        }

        fullWidthBackGestureRecognizer.setValue(targets, forKey: "targets")
        fullWidthBackGestureRecognizer.delegate = self
        view.addGestureRecognizer(fullWidthBackGestureRecognizer)
    }

    override func gestureRecognizerShouldBegin(_: UIGestureRecognizer) -> Bool {
        let isSystemSwipeToBackEnabled = interactivePopGestureRecognizer?.isEnabled == true
        let isThereStackedViewControllers = viewControllers.count > 1
        return isSystemSwipeToBackEnabled && isThereStackedViewControllers && isSwipeToBackEnabled
    }
}

extension UINavigationController: UIGestureRecognizerDelegate {
    override open func viewDidLoad() {
        super.viewDidLoad()
        interactivePopGestureRecognizer?.delegate = self

        let appearance = UINavigationBarAppearance()
        appearance.backgroundColor = .clear
        appearance.shadowColor = .clear
        appearance.titleTextAttributes = [.font: UIFont.systemFont(ofSize: 16),
                                          .foregroundColor: Color.appTextWhiteColor]
        navigationBar.standardAppearance = appearance
        navigationBar.scrollEdgeAppearance = navigationBar.standardAppearance

        view.backgroundColor = UIColor(Color.appBackgroundColor)
    }

    public func gestureRecognizerShouldBegin(_: UIGestureRecognizer) -> Bool {
        return viewControllers.count > 1
    }
}
