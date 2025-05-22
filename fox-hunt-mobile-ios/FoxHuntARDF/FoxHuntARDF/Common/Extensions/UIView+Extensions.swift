//
//  UIView+Extensions.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 4.11.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import UIKit

extension UIView {
    var width: CGFloat {
        return frame.size.width
    }

    var height: CGFloat {
        return frame.size.height
    }

    var left: CGFloat {
        return frame.origin.x
    }

    var right: CGFloat {
        return left + width
    }

    var top: CGFloat {
        return frame.origin.y
    }

    var bottom: CGFloat {
        return top + height
    }
}
