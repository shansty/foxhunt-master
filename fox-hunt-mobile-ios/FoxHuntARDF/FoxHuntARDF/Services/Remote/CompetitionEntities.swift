//
//  CompetitionEntities.swift
//  FoxHuntARDF
//
//  Created by itechart on 06/07/2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

extension Remote {
    struct FilterDate {
        let day: Int32?
        let month: Int32?
        let year: Int32?
    }

    struct CompetitionsRequestParams {
        let id: Int64?
        let name: String?
        let offset: Int64?
        let pageNumber: Int32?
        let pageSize: Int32?
        let paged: Bool?
        let projection: String?
        let sortSorted: Bool?
        let sortUnsorted: Bool?
        let startDate: FilterDate?
        let statuses: [Remote.CompetitionState]?
        let unpaged: Bool?
        let upcoming: Bool?
    }

    enum CompetitionState: String, Codable {
        case running = "RUNNING"
        case finished = "FINISHED"
        case scheduled = "SCHEDULED"
        case canceled = "CANCELED"
    }

    struct CompetitionsContent: RemoteContent {
        typealias ContentType = [Competition]
        typealias PageableType = PageableImpl
        typealias SortableContent = SortableContentImpl

        var content: ContentType

        var empty: Bool

        var first: Bool

        var last: Bool

        var number: UInt

        var numberOfElements: UInt

        var pageable: PageableType

        var size: UInt

        var sort: SortableContent

        var totalElements: UInt

        var totalPages: UInt
    }

    struct Competition: Codable {
        let actualFinishDate: DateFormatted<StdTZDate>?
        let actualStartDate: DateFormatted<StdTZDate>?
        let cancellationReason: String?
        let coach: Remote.User
        let createdBy: Remote.User
        let createdDate: DateFormatted<StdDate>
        let distanceType: Remote.DistanceType
        let expectedCompetitionDuration: String?
        let finishPoint: Remote.Point
        /// minimum -128, and maximum 127
        let foxAmount: Int32
        let foxDuration: Int32
        let foxPoints: [Remote.FoxPoint]
        let frequency: Double
        let hasSilenceInterval: Bool
        let id: Int64
        let isPrivate: Bool
        let location: Remote.LocationFullDto
        let name: String
        let notes: String
        let participants: [Remote.User]
        let startDate: DateFormatted<StdDate>
        let startPoint: Remote.Point
        let status: Remote.CompetitionState
        let stoppingReason: String?
        let updatedDate: DateFormatted<StdDate>
    }

    struct CompetitionContent: RemoteContent {
        typealias SortableType = SortableContentImpl
        typealias PageableType = PageableImpl
        typealias ContentType = Competition

        var content: ContentType

        var empty: Bool

        var first: Bool

        var last: Bool

        var number: UInt

        var numberOfElements: UInt

        var pageable: PageableType

        var size: UInt

        var sort: SortableType

        var totalElements: UInt

        var totalPages: UInt
    }

    struct DistanceType: Codable {
        let distanceLength: Int32
        let id: Int64
        let maxNumberOfFox: Int32
        let name: String
    }

    enum GeometryType: String, Codable {
        case point = "Point"
        case line  = "Line"
        case polygon = "Polygon"
        case path = "Path"
    }

    struct Point: Codable {
        let area: Double?
        let boundary: Remote.Geometry?
        let boundaryDimension: Int32?
        let centroid: Remote.PointRef?
        let coordinate: Remote.Coordinate?
        let coordinateSequence: Remote.CoordinateSequence?
        let coordinates: Remote.CoordinateSequence
        let dimension: Int32?
        let empty: Bool?
        let envelope: Remote.Envelope?
        let envelopeInternal: Remote.Envelope?
        let factory: Remote.GeometryFactory?
        let type: GeometryType
        let interiorPoint: Remote.PointRef?
        let length: Double?
        let numGeometries: Int32?
        let numPoints: Int32?
        let precisionModel: Remote.PrecisionModel?
        let rectangle: Bool?
        let simple: Bool?
        let srid: Int32?
        let userData: Remote.UserData?
        let valid: Bool?
        let x: Double?
        let y: Double?
    }

    typealias UserData = [String: String]

    class PointRef: Codable {
        let box: Point
    }

    struct FoxPoint: Codable {
        let coordinates: Point
        let frequency: Double
        let id: Int64
        let index: Int32
        let label: String
    }

    struct LocationFullDto: Codable {
        let center: Remote.Point
        let coordinates: Remote.Polygon
        let createdBy: Remote.User?
        let createdDate: Date?
        let description: String
        let forbiddenAreas: [Remote.ForbiddenArea]
        let global: Bool?
        let id: Int64
        let isFavorite: Bool?
        let name: String
        let updatable: Bool?
        let updatedBy: Remote.User?
        let updatedDate: Date?
        let zoom: Int32?
    }

    typealias BoundaryType = [String: String]

    struct Geometry: Codable {
        let area: Double
        let boundary: BoundaryType
        let boundaryDimension: Int32
        let centroid: Remote.PointRef
        let coordinate: Remote.Coordinate
        let coordinates: [Remote.Coordinate]
        let dimension: Int32
        let empty: Bool
        let envelope: Remote.Envelope
        let envelopeInternal: Remote.Envelope
        let factory: Remote.GeometryFactory
        let type: GeometryType
        let interiorPoint: Remote.PointRef
        let length: Double
        let numGeometries: Int32
        let numPoints: Int32
        let precisionModel: Remote.PrecisionModel
        let rectangle: Bool
        let simple: Bool
        let srid: Int32
        let userData: Remote.UserData
        let valid: Bool
    }

    struct Coordinate: Codable {
        let x, y, z: Double
    }

    typealias Dimension = Double
    typealias CoordinateSequence = [Dimension]

    struct Envelope: Codable {
		let area: Double
		let height: Double
		let maxX: Double
		let maxY: Double
		let minX: Double
		let minY: Double
		let null: Bool
		let width: Double
    }

    struct GeometryFactory: Codable {
        let coordinateSequenceFactory: Remote.CoordinateSequenceFactory
        let precisionModel: Remote.PrecisionModel
        let srid: Int32
    }

    struct PrecisionModel: Codable {
        let floating: Bool
        let maximumSignificantDigits: Int32
        let offsetX: Double
        let offsetY: Double
        let scale: Double
        let type: [String: String]
    }

    typealias CoordinateSequenceFactory = [String: String]

    struct Polygon: Codable {
        let area: Double?
        let boundary: Remote.Geometry?
        let boundaryDimension: Int32?
        let centroid: Remote.Point?
        let coordinate: Remote.Coordinate?
        let coordinates: [[[Remote.Dimension]]]
        let dimension: Int32?
        let empty: Bool?
        let envelope: Remote.Envelope?
        let envelopeInternal: Remote.Envelope?
        let exteriorRing: Remote.LineString?
        let factory: Remote.GeometryFactory?
        let type: GeometryType
        let interiorPoint: Remote.Point?
        let length: Double?
        let numGeometries: Int32?
        let numInteriorRing: Int32?
        let numPoints: Int32?
        let precisionModel: Remote.PrecisionModel?
        let rectangle: Bool?
        let simple: Bool?
        let srid: Int32?
        let userData: Remote.UserData?
        let valid: Bool?
    }

    struct ForbiddenArea: Codable {
        let coordinates: Remote.Polygon
        let id: Int64?
    }

    struct LineString: Codable {
		let area: Double
		let boundary: Remote.Geometry
		let boundaryDimension: Int32
		let centroid: Remote.Point
		let closed: Bool
		let coordinate: Remote.Coordinate
		let coordinateSequence: Remote.CoordinateSequence
        let coordinates: [Remote.Coordinate]
		let dimension: Int32
		let empty: Bool
		let endPoint: Remote.Point
		let envelope: Remote.Envelope
		let envelopeInternal: Remote.Envelope
		let factory: Remote.GeometryFactory
        let type: GeometryType
		let interiorPoint: Remote.Point
		let length: Double
		let numGeometries: Int32
		let numPoints: Int32
		let precisionModel: Remote.PrecisionModel
		let rectangle: Bool
		let ring: Bool
		let simple: Bool
		let srid: Int32
		let startPoint: Remote.Point
        let userData: Remote.UserData
		let valid: Bool
    }
}
