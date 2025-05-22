//
//  MainViewController.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 4.11.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import Combine
import SwiftUI
import UIKit

final class MainViewController: UIViewController {
    @ObservedObject var presenter: MainPresenter
    
    private var cancellables = Set<AnyCancellable>()
    
    init(presenter: MainPresenter) {
        self.presenter = presenter
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private let scrollView: UIScrollView = {
        let scrollView = UIScrollView()
        scrollView.isScrollEnabled = false
        scrollView.showsVerticalScrollIndicator = false
        scrollView.showsHorizontalScrollIndicator = false
        return scrollView
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.addSubview(scrollView)
        scrollView.contentSize = CGSize(width: view.width,
                                        height: scrollView.height)
        
        let mainVC = UIHostingController(rootView: MainView(presenter: presenter))
        addChild(mainVC)
        scrollView.addSubview(mainVC.view)
        mainVC.didMove(toParent: self)
        mainVC.view.clipsToBounds = true
        presenter.router?.navigationController = navigationController
        presenter.alertPresenter.navigationController = navigationController
        
        (navigationController as? NavigationController)?.isSwipeToBackEnabled = true
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        let tabbarHeight = 49.0
        scrollView.frame = CGRect(x: 0,
                                  y: view.safeAreaInsets.top,
                                  width: view.width,
                                  height: view.height - tabbarHeight)
        for (index, subview) in scrollView.subviews.enumerated() {
            subview.frame = CGRect(x: view.width * CGFloat(index),
                                   y: 0,
                                   width: scrollView.width,
                                   height: scrollView.height)
        }
    }
}
