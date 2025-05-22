//
//  LightweightCacher.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 17.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

final class LightweightCacher {
    static func save<T: Encodable>(_ object: T, filename: String) {
        DispatchQueue.global().async {
            let fileManager = FileManager.default
            let urls = fileManager.urls(for: .cachesDirectory, in: .localDomainMask)
            guard let url = urls.first else { return }
            var fileURL = url.appendingPathComponent(filename)
            fileURL = fileURL.appendingPathExtension("json")
            let data = try? JSONEncoder().encode(object)
            try? data?.write(to: fileURL, options: [.atomicWrite])
        }
    }

    static func restore<T: Decodable>(filename: String, completion: @escaping (T?) -> Void) {
        DispatchQueue.global().async {
            let fileManager = FileManager.default
            let urls = fileManager.urls(for: .cachesDirectory, in: .localDomainMask)
            guard let url = urls.first else { return completion(nil) }
            var fileURL = url.appendingPathComponent(filename)
            fileURL = fileURL.appendingPathExtension("json")
            guard let data = try? Data(contentsOf: fileURL) else { return completion(nil) }
            let result = try? JSONDecoder().decode(T.self, from: data)
            completion(result)
        }
    }
}
