//
//  Pageable.swift
//  FoxHuntARDF
//
//  Created by itechart on 09/09/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

protocol SortableContent: Codable {
    var sorted: Bool { get set }
    var unsorted: Bool { get set }
    var empty: Bool { get set }
}

struct SortableContentImpl: SortableContent {
    var sorted: Bool
    var unsorted: Bool
    var empty: Bool
}

protocol Pageable: Codable {
    associatedtype SortableType
    var sort: SortableType { get set }
    var pageNumber: Int { get set }
    var pageSize: Int { get set }
    var offset: Int { get set }
    var paged: Bool { get set }
    var unpaged: Bool { get set }
}

struct PageableImpl: Pageable {
    typealias SortableType = SortableContentImpl

    var sort: SortableType

    var pageNumber: Int

    var pageSize: Int

    var offset: Int

    var paged: Bool

    var unpaged: Bool
}

protocol RemoteContent: Codable {
    associatedtype ContentType
    associatedtype PageableType
    associatedtype SortableType

    var content: ContentType { get set }
    var empty: Bool { get set }
    var first: Bool { get set }
    var last: Bool { get set }
    var number: UInt { get set }
    var numberOfElements: UInt { get set }
    var pageable: PageableType { get set }
    var size: UInt { get set }
    var sort: SortableType { get set }
    var totalElements: UInt { get set }
    var totalPages: UInt { get set }
}
