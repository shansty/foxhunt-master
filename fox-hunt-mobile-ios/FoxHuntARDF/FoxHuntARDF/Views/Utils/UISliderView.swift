//  UISliderView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 03.01.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct UISliderView: UIViewRepresentable {
    @Binding var value: CGFloat

    var minValue = 1.0
    var maxValue = 100.0
    var thumbColor: UIColor = .white
    var minTrackColor: UIColor = .blue
    var maxTrackColor: UIColor = .lightGray

    class Coordinator: NSObject {
        var value: Binding<CGFloat>

        init(value: Binding<CGFloat>) {
            self.value = value
        }

        @objc func valueChanged(_ sender: UISlider) {
            self.value.wrappedValue = CGFloat(sender.value)
        }
    }

    func makeCoordinator() -> UISliderView.Coordinator {
        Coordinator(value: $value)
    }

    func makeUIView(context: Context) -> UISlider {
        let slider = UISlider(frame: .zero)
        slider.thumbTintColor = thumbColor
        slider.minimumTrackTintColor = minTrackColor
        slider.maximumTrackTintColor = maxTrackColor
        slider.minimumValue = Float(minValue)
        slider.maximumValue = Float(maxValue)
        slider.value = Float(value)

        slider.addTarget(
            context.coordinator,
            action: #selector(Coordinator.valueChanged(_:)),
            for: .valueChanged
        )
        return slider
    }

    func updateUIView(_ uiView: UISlider, context: Context) {
        uiView.value = Float(value)
    }
}
