//
//  Constants.swift
//  FoxHuntARDF
//
//  Created by Sergey Verlygo on 06/05/2022.
//

import Foundation

final class ConstantsAPI {
     static let apiVersion = "v1"
     static let apiPrefix = "/api" + "/" + apiVersion
     static let id = "/{id}"
     static let system = "/system"
     static let link = "https://d9liiuuupc.execute-api.eu-west-3.amazonaws.com"
     static let prod = "/prod"

     static let users = apiPrefix + "/users"
     static let login = apiPrefix + "/login"
     static let location = apiPrefix + "/locations"
     static let health = apiPrefix + "/health"
     static let locationPackages = apiPrefix + "/location-packages"
     static let allOrganizationPackages = apiPrefix + "/organization-packages"
     static let competitions = apiPrefix + "/competitions"
     static let competitionTemplate = apiPrefix + "/competition-templates"
     static let activeCompetition = apiPrefix + "/active-competitions"
     static let dystanceTypes = apiPrefix + "/distance-types"
     static let replyCompetition = apiPrefix + "/replay-competitions"
     static let singleParicipantCompetition = apiPrefix + "/single-participant-competitions"
     static let features = apiPrefix + "/features"
     static let userFeedBacks = apiPrefix + "/user-feedbacks"
     static let helpContent = apiPrefix + "/help-content"
     static let tooltips = apiPrefix + "/tooltips"

     static let size = "/size"
     static let favorite = "/" + id + "/favorite"
     static let url = "/url"
     static let token = "/token"
     static let logout = "/logout"
     static let currentUser = "/current-user"
     static let refresh = "/refresh"
     static let authenticationLocal = "/authentication"
     static let authentication = link + prod + apiPrefix + "/login/mobile/authentication"
     static let signUp = link + prod + apiPrefix + "/register/mobile"
     static let emailVerification = link + prod + apiPrefix + "/register/mobile/verify"
     static let authenticate = "/authenticate"
     static let forgotPassword = "/forgot-password"
     static let resendCode = "/resend-code"
     static let resetPassword = "/reset-password"
     static let resetPasswordLink = resetPassword + "/{token}"
     static let currentUserOrganizations = currentUser + "/organizations"
     static let currentUserOrganization = currentUser + "/organization"
     static let password = "/password"
     static let competitionResults = "/results"

     static let verify = "/verify/{orgDomain}/invitation/{status}/{token}"

     static let countCompetitionState = id + size
     static let acceptCompetitionInitiation = id + "/invitation/accept"
     static let declineCompetitionInitiation = id + "/invitation/decline"
     static let competitionInvitations = id + "/invitations"
     static let participantFinish = id + "/participant/finish"
     static let competitionParticipant = id + "/participants"
     static let subscription = "/subscription"
     static let subscribeCompetition = id + subscription
     static let cancellation = id + "/cancellation"
     static let start = id + "/start"
     static let finish = id + "/finish"
     static let trackDevice = id + "/track"
     static let active = "/active"
     static let activeByUser = "/active" + id
     static let activeuser = id + "/active"

     static let userInfo = "/user-info"
     static let organizationInfo = "/organization-info"
     static let helpContentArticle = "/article"
     static let helpContentTopic = "/topic"
     static let helpContentArticleCreationByTopicId = helpContentTopic + id + helpContentArticle
     static let helpContentTopicById = helpContentTopic + id
     static let helpContentArticleById = helpContentArticle + id

     static let authHeader = "Authorization"

     static let roleOrganizationadmin = "ROLE_ORGANIZATION_ADMIN"
     static let roleParticipant = "ROLE_PARTICIPANT"
     static let roleTrainer = "ROLE_TRAINER"
     static let roleSystemAdmin = "ROLE_SYSTEM_ADMIN"

     static let badInvitation = "Bad invitation"
}

enum Constants {
    enum Frequency {
        static let range_3_5 : ClosedRange<Double> = 3.40...3.60
        static let range_144_0 : ClosedRange<Double> = 144.0...145.0
    }
    enum Volume {
        static let range_0_1 : ClosedRange<Double> = 0...1
    }
}
