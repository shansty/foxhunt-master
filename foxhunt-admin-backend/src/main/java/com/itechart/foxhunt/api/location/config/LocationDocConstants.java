package com.itechart.foxhunt.api.location.config;

public class LocationDocConstants {
    public static final String SINGLE_LOCATION = """
        {
            "id": 4,
            "name": "Location Name",
            "description": "Location Description",
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
                            54.03431774,
                            27.26693591
                        ],
                        [
                            54.01329375,
                            27.37267932
                        ],
                        [
                            53.94043595,
                            27.29302844
                        ],
                        [
                            54.03431774,
                            27.26693591
                        ]
                    ]
                ]
            },
            "zoom": 10,
            "createdDate": "2020-01-03T09:59:00",
            "updatedDate": "2020-02-03T14:11:00",
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
                        "role": "TRAINER"
                    },
                    {
                        "organizationId": null,
                        "userId": null,
                        "role": "ORGANIZATION_ADMIN"
                    }
                ],
                "activatedSince": "2020-01-14T09:32:41",
                "completed": false,
                "activated": true
            },
            "isFavorite": false,
            "forbiddenAreas": [],
            "global": true,
            "updatable": false
        }
        """;

    public static final String CREATE_LOCATION_REQUEST = """
        {
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
                            53.96921489513674,
                            27.58759936523435
                        ],
                        [
                            53.96516629394055,
                            27.4640031738281
                        ],
                        [
                            53.8427123025379,
                            27.588972656249975
                        ],
                        [
                            53.96921489513674,
                            27.58759936523435
                        ]
                    ]
                ]
            },
            "description": "descr",
            "forbiddenAreas": [],
            "global": false,
            "name": "New Location12",
            "zoom": 10,
            "isFavorite": false
        }
        """;

    public static final String UPDATE_LOCATION_REQUEST = """
        {
            "id": 12,
            "name": "New Location 12",
            "description": "descr",
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
                            53.9692149,
                            27.58759937
                        ],
                        [
                            53.96516629,
                            27.46400317
                        ],
                        [
                            53.87537576012722,
                            27.60407885742185
                        ],
                        [
                            53.9692149,
                            27.58759937
                        ]
                    ]
                ]
            },
            "zoom": 10,
            "createdDate": "2022-11-02T10:01:32",
            "isFavorite": false,
            "forbiddenAreas": [],
            "global": false,
            "updatable": true
        }
        """;
}
