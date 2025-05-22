//
//  FoxHuntARDFTests.swift
//  FoxHuntARDFTests
//
//  Created by itechart on 06/05/2022.
//

import XCTest
//@testable import FoxHuntARDF

import os

struct FHTestingConstants {
    static let testUser: String = "alexander.belyaev@itechart-group.com"
    static let testPass: String = "password"
    static let  testDom: String = "public"

    static let testUser2: String = "1123@gmail.com"
    static let testPass2: String = "password"
    static let testDom2: String = "public"

    static let testUser3: String = "Alexander.Belyaev@itechart-group.com"
}

class FoxHuntARDFTests: XCTestCase {
    var services: Services!

    var remote: RemoteService {
        get throws {
            guard let remoteSrv = services.resolve(RemoteService.self) as? RemoteService else {
                XCTFail("Couldn't instantiate RemoteService")
                throw FoxHuntMobileError.internalInconsistency
            }
            return remoteSrv
        }
    }

    override func setUpWithError() throws {
        services = ServicesImpl()
        services.append(ConfigService.self, implementation: ConfigImpl(services))
        services.append(UserService.self, implementation: UserServiceImpl(services))
        services.append(LocationService.self, implementation: LocationServiceImpl(services))
        services.append(RemoteService.self, implementation: RemoteServiceImpl(services))
        try? services.start()
        if let log = services.resolve(Log.self) as? Log {
            log.info("Services started", with: OSLog.common)
        }
    }

    // MARK: - API Gateway tests

    func testRemoteAPILoginAuth() async throws {
        let res = try await LoginRemoteService(remoteService: self.remote).performLogIn(
            with: FHTestingConstants.testUser,
            password: FHTestingConstants.testPass,
            domain: FHTestingConstants.testDom)

        XCTAssertTrue(res, "API Gateway login authentification is failed")
    }

    func testRemoteAPILoginAuthWithoutDomain() async throws {
        let res = try await LoginRemoteService(remoteService: self.remote).performLogIn(
            with: FHTestingConstants.testUser,
            password: FHTestingConstants.testPass,
            domain: nil)

        XCTAssertTrue(res, "API Gateway login authentification without domain is failed")
    }

    func testRemoteAPILogout() async throws {
        try await makeAuthIfNeeded()
        try await Task.sleep(nanoseconds: 1_000_000_000)
        try await LoginRemoteService(remoteService: self.remote).performLogOut()
    }

    func testRemoteAPIUpdateAccessToken() async throws {
        try await makeAuthIfNeeded()
        try await Task.sleep(nanoseconds: 1_000_000_000)
        try await LoginRemoteService(remoteService: self.remote).updateAccessToken()
    }

    // MARK: - Competitions tests

    func testRemoteCompetions() async throws {
        try await makeAuthIfNeeded()

        guard let comps = try await CompetitionsRemoteService(remoteService: self.remote).getCompetitions(nil) else {
            XCTFail("Competitions should be instantiated.")
            return
        }
        print(comps.empty ? "Content has no data" : "We get something")
    }

    func testRemoteCompetionById() async throws {
        try await makeAuthIfNeeded()

        guard let competition = try await CompetitionsRemoteService(remoteService: remote).getCompetition(withId: 4, nil) else {
            XCTFail("Competition #4 should be instantiated.")
            return
        }

        XCTAssertEqual(competition.name, "SVTest", "Competition with id=4 should be named SVTest")
    }

    // MARK: - Organizations tests

    func testRemoteOrganizationById() async throws {
        try await makeAuthIfNeeded()

        let idToCheck: IDType = 1
        let remoteService = try OrganizationsRemoteService(remoteService: remote)
        let organization = try await remoteService.getOrganization(byId: idToCheck)

        guard let org = organization else {
            XCTFail("Organization should be instantiated after network request") ; return }
        XCTAssertEqual(idToCheck, org.id)
        XCTAssertEqual(org.name, "Radio School", "Name is wrong.")
        XCTAssertEqual(org.status, Remote.Organization.Status.active, "Status is not active")
    }

    // MARK: - Privates

    @discardableResult
    private func makeAuthIfNeeded() async throws -> Bool {
        guard try self.remote.authNeeded else { return true }
        print("auth needed")
        return try await LoginRemoteService(remoteService: self.remote).performLogIn(
            with: FHTestingConstants.testUser,
            password: FHTestingConstants.testPass,
            domain: FHTestingConstants.testDom)
    }

    @discardableResult
    private func makeAuthLoginIfNeeded() async throws -> Bool {
        guard try self.remote.authNeeded else { return true }
        async let passed = try await LoginRemoteService(remoteService: self.remote).performLogIn(
            with: FHTestingConstants.testUser,
            password: FHTestingConstants.testPass,
            domain: nil)

        return try await passed
    }
}
