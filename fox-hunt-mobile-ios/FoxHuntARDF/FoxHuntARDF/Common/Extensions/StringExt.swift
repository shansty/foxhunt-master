//
//  StringExt.swift
//  FoxHuntARDF
//
//  Created by itechart on 26/08/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import CryptoSwift

extension String {
    func salted(with str: String) -> String { return "\(self)\(str)"}
    func SHA3shed() -> String { return self.sha3(.sha512)}
}
