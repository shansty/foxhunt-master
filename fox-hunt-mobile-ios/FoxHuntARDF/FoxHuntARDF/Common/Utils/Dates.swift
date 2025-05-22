//
//  Dates.swift
//  FoxHuntARDF
//
//  Created by itechart on 20/09/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

// MARK: - Dates encoding/decoding

protocol DateFormatting {
    static var dateFormatter: DateFormatter { get }
}

enum DateFmtError: Error {
    case decoding
}

struct DateFormatted<DF: DateFormatting>: Codable, CustomStringConvertible {
    var description: String {
        get { toString() }
    }

    let rawValue: Date
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let text = try container.decode(String.self)
        guard let date = DF.dateFormatter.date(from: text) else {
            throw DateFmtError.decoding
        }
        self.rawValue = date
    }

    func toString() -> String {
        return DF.dateFormatter.string(from: rawValue)
    }
}

struct StdTZDate: DateFormatting {
    static var dateFormatter: DateFormatter {
        let fmt = DateFormatter()
        fmt.timeZone = TimeZone.current
        fmt.locale = Locale(identifier: "en_US_POSIX")
        fmt.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        return fmt
    }
}

struct StdDate: DateFormatting {
    static var dateFormatter: DateFormatter {
        let fmt = DateFormatter()
        fmt.timeZone = TimeZone.current
        fmt.locale = Locale(identifier: "en_US_POSIX")
        fmt.dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        return fmt
    }
}

extension DateFormatter {
    static let standardDateFormatter = {
       let dateFormatter = DateFormatter()
        dateFormatter.dateStyle = .medium
        dateFormatter.timeStyle = .long
        return dateFormatter
    }()

    static let justDateFormatter = {
        let dateFormatter = DateFormatter()
        dateFormatter.dateStyle = .medium
        dateFormatter.timeStyle = .none
        return dateFormatter
    }()
}
