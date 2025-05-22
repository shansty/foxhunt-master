//
//  County+CityParser.swift
//  FoxHuntARDF
//
//  Created by IvannaVasilkova on 02.02.2023.
//  Copyright © 2023 iTechArt Group. All rights reserved.
//

import Foundation

class CountyCityParser {

    var contryCities: [String : [String]] = [:]
    var countries : [String] = []

    func getNeededCities(for country: String) -> [String] {
        return contryCities[country] ?? []
    }

    func сountryCityParser() {
        guard let path = Bundle(for: CountyCityParser.self).path(forResource: "countriesToCities", ofType: "json") else { return }
        do {
            let jsonData = try Data(contentsOf: URL(fileURLWithPath: path) , options: .mappedIfSafe)
            let jsonResult = try? JSONSerialization.jsonObject(with: jsonData) as? NSDictionary
            if let dict = jsonResult as? [String: [String]] {
                contryCities = dict
                countries = Array(dict.keys).sorted{ $0 < $1 }
            }
        }
        catch {
            print(error)
        }
    }
}

