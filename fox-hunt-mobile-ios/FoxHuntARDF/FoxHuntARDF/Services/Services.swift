//
//  Services.swift
//  FoxHuntARDF
//
//  Created by Sergey Verlygo on 09/05/2022.
//

import Foundation

protocol Service: AnyObject {
    var services: Services { get set }
    var started: Bool { get }
    func start() throws
    func stop() -> Error?
}

protocol Services: AnyObject {
    func append<P>(_ proto: P.Type, implementation: Service)
    func resolve<P>(_ proto: P.Type) -> Service?
    func start() throws
}

final class ServicesImpl: Services {
    private var services: [String: Service] = [:]

    func append<P>(_ proto: P.Type, implementation: Service) {
        let key = keyFor(aProto: proto.self)
        services[key] = implementation
        implementation.services = self
    }

    func resolve<P>(_ proto: P.Type) -> Service? {
        let key = keyFor(aProto: proto.self)
        return services[key]
    }

    // TODO: TaskGroup
    func start() throws {
        try services.forEach { (_: String, value: Service) in
            try value.start()
        }
    }

    private func keyFor<P>(aProto: P.Type) -> String {
        return ("\(aProto)")
    }
}
