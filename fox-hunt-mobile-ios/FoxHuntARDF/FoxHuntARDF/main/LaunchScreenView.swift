//
//  LaunchScreenView.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 25.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import SwiftUI

struct LaunchScreenView: View {
    weak var navigationController: UINavigationController?
    var services: Services
    var mainModule = MainModule()
    var loginModule = LoginModule()
    @State private var animate = false

    var body: some View {
        VStack {
            ZStack{
                pulseView
                Image.appFoxLogo
                    .resizable()
                    .frame(width: 200, height: 200)
            }
        }
        .onAppear {
            animate = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.1) {
                showInitialView()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.appBackgroundColor)
    }

    private func showInitialView() {
        if TokenService.authNeeded, let navigationController = navigationController {
            navigationController.setViewControllers([UIHostingController(rootView: loginModule.initialize(services, navigationController: navigationController))], animated: false)
        } else {
            navigationController?.setViewControllers([mainModule.initialize(services)], animated: false)
        }
    }

    private var pulseView: some View {
        ZStack {
            Circle()
                .foregroundColor(Color.appAccentColor)
                .opacity(0.35)
                .frame(width: 350, height: 350)
                .scaleEffect(self.animate ? 1 : 0 )

            Circle()
                .foregroundColor(Color.appAccentColor)
                .opacity(0.4)
                .frame(width: 300, height: 300)
                .scaleEffect(self.animate ? 1 : 0 )

            Circle()
                .foregroundColor(Color.appAccentColor)
                .opacity(0.45)
                .frame(width: 250, height: 250)
                .scaleEffect(self.animate ? 1 : 0 )
        }
        .animation(Animation.linear(duration: 1.5).repeatForever(autoreverses: false), value: animate)
    }
}

struct LaunchScreenView_Previews: PreviewProvider {
    static var previews: some View {
        LaunchScreenView(services: ServicesImpl())
    }
}
