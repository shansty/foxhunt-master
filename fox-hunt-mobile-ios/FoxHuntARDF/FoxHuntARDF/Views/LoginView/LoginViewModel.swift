//
//  LoginViewModel.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 04.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

class LoginViewModel: ObservableObject {
    @Published var email: String
    @Published var pass: String
    @Published var domain: String
    
    init(email: String, pass: String, domain: String) {
        self.email = email
        self.pass = pass
        self.domain = domain
    }
}
