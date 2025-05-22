//
//  ControlCircleView.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 07.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI

struct ControlCircleView: View {
    
    @State var ringDiameter = 140.0
    @Binding var convertedControlValue : CGFloat
    @State var range: ClosedRange<Double>
    @State var toShowRounded : Bool = false
    
    var controlValue : CGFloat {
        (convertedControlValue - range.lowerBound) / (range.upperBound - range.lowerBound)
    }
    
    var rotationAngle : Angle {
        get { Angle(degrees: controlValue == 1 ? 180 :  (controlValue/2).truncatingRemainder(dividingBy:1) * 360)}
        set(newProgress) { setControlValue(newValue: newProgress.degrees / 360)  }
    }
    
    var body: some View {
        VStack {
            ZStack {
                ArcShape(rotationAngle: 0)
                    .stroke(Color.black, style: StrokeStyle(lineWidth: 10.0, dash: [4]))
                    .aspectRatio(2, contentMode: .fit)
                    .overlay() {
                        Text(toShowRounded ?
                             "\(Int(convertedControlValue * 100))"
                             : "\(convertedControlValue, specifier: "%.2f")")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    }
                ArcShape(rotationAngle: rotationAngle.degrees+180)
                    .stroke(Color.orange, style: StrokeStyle(lineWidth: 10.0, lineCap: .round))
                    .aspectRatio(2, contentMode: .fit)
                Circle()
                    .fill(Color.white)
                    .shadow(radius: 3)
                    .frame(width: 21, height: 21)
                    .offset(y: -ringDiameter / 2.0 + 8)
                    .rotationEffect(rotationAngle - Angle(degrees: 90))
                    .gesture(
                        DragGesture(minimumDistance: 0.0)
                            .onChanged() { value in
                                changeAngle(location: value.location)
                            }
                    )
            }
            .frame(width: ringDiameter, height: ringDiameter/2)
            .offset(y:ringDiameter/4)
        }
    }
    
    private func changeAngle(location: CGPoint) {
        let vector = CGVector(dx: location.x, dy: -location.y)
        // Calculate the angle of the vector
        let angleRadians = atan2(vector.dx, vector.dy)
        var distanceRadians = angleRadians - rotationAngle.radians + .pi/2
        if distanceRadians < -.pi {
            distanceRadians += .pi * 2
        } else if distanceRadians > .pi {
            distanceRadians -= .pi * 2
        }
        setControlValue(newValue: min(max((rotationAngle.radians + distanceRadians) / .pi, 0), 1))
    }
    
    private func setControlValue(newValue: CGFloat) {
        convertedControlValue = newValue * (range.upperBound - range.lowerBound) + range.lowerBound
    }
}

struct ArcShape: Shape {
    @State var rotationAngle : CGFloat
    
    func path(in rect: CGRect) -> Path {
        let r = rect.height-8
        let center = CGPoint(x: rect.midX, y: rect.midY)
        var path = Path()
        path.addArc(center: center,
                    radius: r,
                    startAngle: Angle(degrees: 180),
                    endAngle: Angle(degrees: rotationAngle),
                    clockwise: false)
        return path
    }
}
