//
//  TabBarNavigationView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 13.12.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct Embedding: UIViewControllerRepresentable {

    let navigationController = NavigationController()

    func makeUIViewController(context: Context) -> some UIViewController {
        navigationController.setNavigationBarHidden(true, animated: false)
        return navigationController
    }

    func updateUIViewController(_ uiViewController: UIViewControllerType, context: Context) {}

    func withSubviews(subviews: [some View]) -> Embedding {
        navigationController.setViewControllers(subviews.map({ UIHostingController(rootView:$0 )}), animated: true)
        return self
    }
}
