//
//  StorageStoreTests.swift
//  FoxHuntARDF
//
//  Created by Ivy on 24.11.2022.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import XCTest
//@testable import FoxHuntARDF

final class StorageStoreTests: XCTestCase {

    var secureStoreWithGenericPwd: SecureStore!

    override func setUp() {
        super.setUp()
        let genericPwdQueryable = GenericPasswordQueryable(service: "someService")
          secureStoreWithGenericPwd = SecureStore(secureStoreQueryable: genericPwdQueryable)
    }

    override func tearDown() {
        try? secureStoreWithGenericPwd.removeAllValues()
        super.tearDown()
    }

    func testSaveGenericPassword() {
      do {
        try secureStoreWithGenericPwd.setValue("token12345", for: "token")
      } catch (let e) {
        XCTFail("Saving token failed with \(e.localizedDescription).")
      }
    }

    func testReadGenericPassword() {
      do {
        try secureStoreWithGenericPwd.setValue("token12345", for: "token")
        let password = try secureStoreWithGenericPwd.getValue(for: "token")
        XCTAssertEqual("token12345", password)
      } catch (let e) {
        XCTFail("Reading token failed with \(e.localizedDescription).")
      }
    }

    func testUpdateGenericPassword() {
      do {
        try secureStoreWithGenericPwd.setValue("token12345", for: "token")
        try secureStoreWithGenericPwd.setValue("token6789", for: "token")
        let password = try secureStoreWithGenericPwd.getValue(for: "token")
        XCTAssertEqual("token6789", password)
      } catch (let e) {
        XCTFail("Updating token failed with \(e.localizedDescription).")
      }
    }

    func testRemoveGenericPassword() {
      do {
        try secureStoreWithGenericPwd.setValue("token12345", for: "token")
        try secureStoreWithGenericPwd.removeValue(for: "token")
        XCTAssertNil(try secureStoreWithGenericPwd.getValue(for: "token"))
      } catch (let e) {
        XCTFail("Removing token failed with \(e.localizedDescription).")
      }
    }


    func testRemoveAllGenericPasswords() {
      do {
        try secureStoreWithGenericPwd.setValue("token12345", for: "token")
        try secureStoreWithGenericPwd.setValue("token6789", for: "token2")
        try secureStoreWithGenericPwd.removeAllValues()
        XCTAssertNil(try secureStoreWithGenericPwd.getValue(for: "token"))
        XCTAssertNil(try secureStoreWithGenericPwd.getValue(for: "token2"))
      } catch (let e) {
        XCTFail("Removing tokens failed with \(e.localizedDescription).")
      }
    }

}
