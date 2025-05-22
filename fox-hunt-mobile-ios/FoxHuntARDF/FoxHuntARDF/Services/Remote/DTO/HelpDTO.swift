//
//  HelpDTO.swift
//  FoxHuntARDF
//
//  Created by Yauheni Skiruk on 11.10.22.
//  Copyright © 2022 iTechArt Group. All rights reserved.
//

import Foundation

// MARK: - HelpDTO
struct HelpDTO: Codable {
    let id: Int
    let title: String
    let notes: String?
    let contents: Contents?
    let index: Int
    let articles: [Article]
    let system: Bool
}

// MARK: - Article
struct Article: Codable, Hashable {
    let id: Int
    let title: String
    let notes: String?
    let contents: Contents
    let index: Int
}

// MARK: - Contents
struct Contents: Codable, Hashable {
    let editorText: [EditorText]
}

// MARK: - EditorText
struct EditorText: Codable, Hashable {
    let type: TypeEnum
    let children: [Child]
}

// MARK: - Child
struct Child: Codable, Hashable {
    let text: String
}

enum TypeEnum: String, Codable {
    case paragraph
}
