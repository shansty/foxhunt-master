package com.itechart.foxhunt.api.location.config;

public class LocationPackageDocConstants {
    public static final String SINGLE_LOCATION_PACKAGE = """
        {
            "locationPackageId": 1,
            "name": "Location Package",
            "description": "Location Package Description",
            "center": {
                "type": "Point",
                "coordinates": [
                    53.907,
                    27.567
                ]
            },
            "coordinates": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            54.07229554,
                            27.1309801
                        ],
                        [
                            53.75691715,
                            27.12960681
                        ],
                        [
                            53.74305082,
                            28.03715923
                        ],
                        [
                            54.07468959,
                            28.02891948
                        ],
                        [
                            54.07229554,
                            27.1309801
                        ]
                    ]
                ]
            },
            "zoom": 10,
            "creationDate": "2020-01-03T09:59:00",
            "updateDate": "2022-11-02T10:16:16",
            "createdBy": {
                "id": 1,
                "firstName": "Petya",
                "lastName": "Utochkin",
                "dateOfBirth": "2000-02-01T17:25:00",
                "country": "Belarus",
                "city": "Minsk",
                "email": "1123@gmail.com",
                "roles": [
                    {
                        "organizationId": null,
                        "userId": null,
                        "role": "ORGANIZATION_ADMIN"
                    },
                    {
                        "organizationId": null,
                        "userId": null,
                        "role": "TRAINER"
                    }
                ],
                "activatedSince": "2020-01-14T09:32:41",
                "completed": false,
                "activated": true
            },
            "updatedBy": {
                "id": 1,
                "firstName": "Petya",
                "lastName": "Utochkin",
                "dateOfBirth": "2000-02-01T17:25:00",
                "country": "Belarus",
                "city": "Minsk",
                "email": "1123@gmail.com",
                "roles": [
                    {
                        "organizationId": null,
                        "userId": null,
                        "role": "ORGANIZATION_ADMIN"
                    },
                    {
                        "organizationId": null,
                        "userId": null,
                        "role": "TRAINER"
                    }
                ],
                "activatedSince": "2020-01-14T09:32:41",
                "completed": false,
                "activated": true
            },
            "accessType": "SYSTEM",
            "locations": [
                {
                    "id": 4,
                    "name": "Red carpets",
                    "createdDate": "2020-01-03T09:59:00",
                    "updatedDate": "2020-02-03T14:11:00",
                    "createdBy": {
                        "userId": 1,
                        "email": "1123@gmail.com",
                        "firstName": "Petya",
                        "lastName": "Utochkin"
                    },
                    "global": true
                }
            ],
            "assignmentType": "LIST_BASED",
            "exactAreaMatch": false,
            "updatable": false
        }
        """;


    public static final String MODIFY_LOCATION_PACKAGE_REQUEST = """
        {
            "name": "Location Package",
            "description": "descr",
            "accessType": "PRIVATE",
            "coordinates": {
                "type": "Polygon",
                "coordinates": [
                    []
                ]
            },
            "center": {
                "type": "Point",
                "coordinates": [
                    53.907,
                    27.567
                ]
            },
            "zoom": 10,
            "locations": [
                {
                    "id": 12,
                    "name": "New Location 12",
                    "createdDate": "2022-11-02T10:01:32",
                    "updatedDate": "2022-11-02T10:18:47",
                    "createdBy": {
                        "userId": 1,
                        "email": "1123@gmail.com",
                        "firstName": "Petya",
                        "lastName": "Utochkin"
                    },
                    "updatedBy": {
                        "userId": 29,
                        "email": "alexander.belyaev@itechart-group.com",
                        "firstName": "Alexander",
                        "lastName": "Developer"
                    },
                    "isFavorite": false,
                    "global": false,
                    "updatable": true,
                    "center": {
                        "type": "Point",
                        "coordinates": []
                    },
                    "coordinates": {
                        "type": "Polygon",
                        "coordinates": [
                            []
                        ]
                    },
                    "forbiddenAreas": null
                }
            ],
            "assignmentType": "LIST_BASED"
        }
        """;
}
