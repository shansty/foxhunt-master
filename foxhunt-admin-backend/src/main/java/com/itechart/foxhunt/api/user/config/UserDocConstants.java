package com.itechart.foxhunt.api.user.config;

public class UserDocConstants {
    public static final String CHANGE_ORGANIZATION_ADMIN_REQUEST = """
        {
          "organizationId": 1,
          "userId": 1
        }
        """;
    public static final String CHANGE_ORGANIZATION_ADMIN_RESPONSE = """
        {
          "organizationId": 1,
          "user": {
            "userId": 1,
            "email": "1123@gmail.com",
            "firstName": "Petya",
            "lastName": "Utochkin"
          },
          "role": {
            "id": 4,
            "role": "ORGANIZATION_ADMIN"
          }
        }
        """;

    public static final String SINGLE_USER = """
        {
          "id": 1,
          "firstName": "Petya",
          "lastName": "Utochkin",
          "dateOfBirth": "2000-02-01T17:25:00",
          "country": "Belarus",
          "city": "Minsk",
          "email": "1123@gmail.com",
          "roles": [
            {
              "organizationId": 4,
              "userId": 1,
              "role": "TRAINER"
            }
          ],
          "activatedSince": "2020-01-14T09:32:41",
          "completed": false,
          "activated": true
        }
        """;
    public static final String GET_ALL_USERS_RESPONSE = """
        [
          {
          "id": 1,
          "firstName": "Petya",
          "lastName": "Utochkin",
          "dateOfBirth": "2000-02-01T17:25:00",
          "country": "Belarus",
          "city": "Minsk",
          "email": "1123@gmail.com",
          "roles": [
            {
              "organizationId": 4,
              "userId": 1,
              "role": "TRAINER"
            }
          ],
          "activatedSince": "2020-01-14T09:32:41",
          "completed": false,
          "activated": true
          }
        ]
        """;

    public static final String INVITE_USERS_REQUEST = """
        {
            "emails": ["foxhunt.itechart+1@gmail.com"],
            "role": "TRAINER"
        }
        """;

    public static final String SETUP_REGISTRATION_INFO_REQUEST = """
           {
             "firstName": "Alexander",
             "lastName": "Belyaev",
             "email": "foxhunt.itechart+1@gmail.com",
             "country": "Belarus",
             "city": "Minsk",
             "password": "password",
             "domain": "pravda"
           }
        """;
    public static final String SETUP_REGISTRATION_INFO_RESPONSE = """
        {
            "id": 42,
            "firstName": "Alexander",
            "lastName": "Belyaev",
            "country": "Belarus",
            "city": "Minsk",
            "email": "foxhunt.itechart+1@gmail.com",
            "roles": [
                {
                    "organizationId": 1,
                    "userId": 42,
                    "role": "TRAINER"
                }
            ],
            "activatedSince": "2022-11-01T19:50:22",
            "completed": false,
            "activated": true
        }
        """;

    public static final String FORGOT_PASSWORD_REQUEST = """
        {"email": "foxhunt.itechart+1@gmail.com"}
        """;
    public static final String VALIDATE_RESET_PASSWORD_RESPONSE = """
        {
            "resetPasswordRequestId": 2,
            "requestDate": "2022-11-01T20:07:34",
            "expirationDate": "2022-11-02T20:07:34",
            "resetDate": "2022-11-01T20:39:01",
            "token": "27d02dcc-0351-4d95-876a-418f9bf49eeb",
            "status": "ACCEPTED",
            "userEmail": "foxhunt.itechart+1@gmail.com",
            "emailTemplateEntity": {
                "id": 5,
                "name": "Reset password for existing user with password",
                "subject": "Reset your Foxhunt password",
                "message": "<html><head></head><body><p>Hi, ${username}</p>"
            },
            "userExisted": true
        }
        """;
    public static final String UPDATE_PASSWORD_AFTER_RESET_REQUEST = """
         {
             "email": "foxhunt.itechart+1@gmail.com",
             "password": "123456789"
         }
        """;
}
