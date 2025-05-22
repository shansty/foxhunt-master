//
//  CompetitionsPresenter.swift
//  FoxHuntARDF
//
//  Created by itechart on 26/09/2022.
//  Edited by IvannaVasilkova on 19/01/2023
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation
import SwiftUI
import MapKit

protocol CompetitionsPresenter: ModulePresenter, CompetitionsModuleIn {
    var competitions: [CompetitionsDetailViewModel] { get set }
}

typealias CompetitionState = Remote.CompetitionState

final class CompetitionsPresenterImpl: CompetitionsPresenter, ObservableObject {
    @Published var competitions : [CompetitionsDetailViewModel] = []
    
    typealias Interactor = CompetitionsInteractorImpl
    var interactor: CompetitionsInteractorImpl?
    
    @ServicesProperty var services: Services?
    @LoggerProperty var logger: Log?
    var router: CommonRouter? = MainRouter.shared
    
    private var competitionsCache: [Remote.Competition]?
    private var isForDemoPreview : Bool = true
}

extension CompetitionsPresenterImpl: CompetitionsModuleIn {
    func setNeedsUpdate() {
        self.logger?.debug("Needs update", with: .competitionsModule)
        
        _ = Task {
            self.logger?.debug("Starting update", with: .competitionsModule)
            
            guard let compsContent = try await interactor?.getCompetitions(nil) else {
                throw FoxHuntMobileError.networkError
            }
            
            logger?.debug("Got competitions content, start mapping", with: .competitionsModule)
            guard let competitions: [Remote.Competition] = compsContent.content as [Remote.Competition]? else {
                throw FoxHuntMobileError.parsingError
            }
            
            competitionsCache = competitions
            
            var competitionModels: [CompetitionsDetailViewModel] = isForDemoPreview ? CompetitionsPresenterImpl.mockedData : []
            
            competitions.forEach { competition in
                competitionModels.append(CompetitionsDetailViewModel(name: competition.name,
                                                                     location: competition.location.name,
                                                                     coach: "\(competition.coach.firstName) \(competition.coach.lastName)",
                                                                     comment: "",
                                                                     settings: CompetionsDetailSettings(id: IDType(competition.id),
                                                                                                        status: competition.status,
                                                                                                        foxesCount: UInt(competition.foxAmount),
                                                                                                        duration: competition.expectedCompetitionDuration ?? "N/A",
                                                                                                        distance: competition.distanceType.distanceLength.formatted(),
                                                                                                        participants: UInt(competition.participants.count),
                                                                                                        date: competition.startDate.toString(),
                                                                                                        approximateTime: "N/A",
                                                                                                        hasSilence: competition.hasSilenceInterval,
                                                                                                        coordinates:  MKCoordinateRegion(
                                                                                                            center: CLLocationCoordinate2D(
                                                                                                                latitude:competition.startPoint.coordinate?.x ?? 0,
                                                                                                                longitude: competition.startPoint.coordinate?.y ?? 0),
                                                                                                            span: MKCoordinateSpan(latitudeDelta: 0.2,
                                                                                                                                   longitudeDelta: 0.2)))))
            }
            
            logger?.debug("Mapped end successfully.", with: .competitionsModule)
            DispatchQueue.main.async { [weak self, competitionModels] in
                self?.logger?.debug("Updating view model...", with: .competitionsModule)
                self?.competitions = competitionModels
            }
        }
    }
}

extension CompetitionsPresenterImpl {
#if DEBUG
    static let preview = {
        let preview = CompetitionsPresenterImpl()
        preview.competitions = mockedData
        return preview
    }()
    
#endif
    static let mockedData = [CompetitionsDetailViewModel(name: "Krzyżówka",
                                                         location: "Rondo ONZ",
                                                         coach: "Alex Belyaev",
                                                         comment: "Any details",
                                                         settings: CompetionsDetailSettings(id: 1,
                                                                                            status: .running,
                                                                                            foxesCount: 3,
                                                                                            duration: "00:00",
                                                                                            distance: "30m",
                                                                                            participants: 5,
                                                                                            date: "19.01.2023",
                                                                                            approximateTime: "30min",
                                                                                            hasSilence: true,
                                                                                            coordinates: MKCoordinateRegion(
                                                                                                center: CLLocationCoordinate2D(latitude: 53.893009, longitude: 27.567444), // Minsk
                                                                                                span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2)))),
                             CompetitionsDetailViewModel(name: "Krzyżówka",
                                                         location: "Rondo ONZ",
                                                         coach: "Alex Belyaev",
                                                         comment: "Any details",
                                                         settings: CompetionsDetailSettings(id: 1,
                                                                                            status: .finished,
                                                                                            foxesCount: 3,
                                                                                            duration: "00:00",
                                                                                            distance: "30m",
                                                                                            participants: 5,
                                                                                            date: "19.01.2023",
                                                                                            approximateTime: "30min",
                                                                                            hasSilence: true,
                                                                                            coordinates: MKCoordinateRegion(
                                                                                                center: CLLocationCoordinate2D(latitude: 53.893009, longitude: 27.567444), // Minsk
                                                                                                span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2)))),
                             
                             CompetitionsDetailViewModel(name: "Krzyżówka",
                                                         location: "Rondo ONZ",
                                                         coach: "Alex Belyaev",
                                                         comment: "Any details",
                                                         settings: CompetionsDetailSettings(id: 1,
                                                                                            status: .canceled,
                                                                                            foxesCount: 3,
                                                                                            duration: "00:00",
                                                                                            distance: "30m",
                                                                                            participants: 5,
                                                                                            date: "19.01.2023",
                                                                                            approximateTime: "30min",
                                                                                            hasSilence: true,
                                                                                            coordinates: MKCoordinateRegion(
                                                                                                center: CLLocationCoordinate2D(latitude: 53.893009, longitude: 27.567444), // Minsk
                                                                                                span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2))))]
}
