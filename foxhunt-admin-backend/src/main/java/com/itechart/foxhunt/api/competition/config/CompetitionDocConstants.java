package com.itechart.foxhunt.api.competition.config;

public class CompetitionDocConstants {

    public static final String GET_ALL_COMPETITIONS_RESPONSE = """
        {
            "content": [
                {
                    "id": 4,
                    "name": "Competition_3.5_Template",
                    "notes": "Template competition",
                    "coach": {
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
                            }
                        ],
                        "activatedSince": "2020-06-20T19:00:06",
                        "completed": false,
                        "activated": true
                    },
                    "foxAmount": 5,
                    "foxPoints": [],
                    "startPoint": {
                        "type": "Point",
                        "coordinates": [
                            53.96867673,
                            27.30264677
                        ]
                    },
                    "finishPoint": {
                        "type": "Point",
                        "coordinates": [
                            53.98070664,
                            27.30139962
                        ]
                    },
                    "startDate": "2022-11-03T10:43:51",
                    "createdDate": "2022-11-03T10:43:51",
                    "updatedDate": "2022-11-03T10:43:51",
                    "location": {
                        "id": 11,
                        "name": "Зеленое",
                        "description": "Остановочный пункт электропоездов в Минском районе с примыкающим лесным массивом.",
                        "center": {
                            "type": "Point",
                            "coordinates": [
                                53.97249843,
                                27.30587788
                            ]
                        },
                        "coordinates": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [
                                        53.99047578,
                                        27.30355728
                                    ],
                                    [
                                        53.99197019,
                                        27.30144792
                                    ],
                                    [
                                        53.9919449,
                                        27.30020337
                                    ],
                                    [
                                        53.99288057,
                                        27.29659848
                                    ],
                                    [
                                        53.99047578,
                                        27.30355728
                                    ]
                                ]
                            ]
                        },
                        "zoom": 15,
                        "forbiddenAreas": []
                    },
                    "distanceType": {
                        "id": 5,
                        "name": "M5",
                        "maxNumberOfFox": 5,
                        "distanceLength": 10000
                    },
                    "participants": [
                        {
                            "id": 19,
                            "firstName": "Anton",
                            "lastName": "Zavalski",
                            "dateOfBirth": "1995-11-01T17:25:00",
                            "country": "Belarus",
                            "city": "Minsk",
                            "email": "Anton.Zavalski@foxhunt.com",
                            "roles": [
                                {
                                    "organizationId": null,
                                    "userId": null,
                                    "role": "PARTICIPANT"
                                }
                            ],
                            "activatedSince": "2022-10-13T17:30:15",
                            "completed": false,
                            "activated": true
                        },
                        {
                            "id": 20,
                            "firstName": "Nikolai",
                            "lastName": "Grushevski",
                            "dateOfBirth": "1992-03-01T17:25:00",
                            "country": "Belarus",
                            "city": "Minsk",
                            "email": "Nikolai.Grushevski@foxhunt.com",
                            "roles": [
                                {
                                    "organizationId": null,
                                    "userId": null,
                                    "role": "PARTICIPANT"
                                }
                            ],
                            "activatedSince": "2022-10-13T17:30:15",
                            "completed": false,
                            "activated": true
                        },
                        {
                            "id": 22,
                            "firstName": "Ilya",
                            "lastName": "Kuzminovich",
                            "dateOfBirth": "1998-02-01T17:25:00",
                            "country": "Belarus",
                            "city": "Minsk",
                            "email": "Ilya.kuzminovich@foxhunt.com",
                            "roles": [
                                {
                                    "organizationId": null,
                                    "userId": null,
                                    "role": "PARTICIPANT"
                                }
                            ],
                            "activatedSince": "2022-10-13T17:30:15",
                            "completed": false,
                            "activated": true
                        },
                        {
                            "id": 23,
                            "firstName": "Boris",
                            "lastName": "Frolov",
                            "dateOfBirth": "1993-02-01T17:25:00",
                            "country": "Belarus",
                            "city": "Minsk",
                            "email": "Boris.Frolov@foxhunt.com",
                            "roles": [
                                {
                                    "organizationId": null,
                                    "userId": null,
                                    "role": "PARTICIPANT"
                                }
                            ],
                            "activatedSince": "2022-10-13T17:30:15",
                            "completed": false,
                            "activated": true
                        }
                    ],
                    "status": "SCHEDULED",
                    "foxDuration": 60,
                    "hasSilenceInterval": true,
                    "frequency": 3.5,
                    "isPrivate": false,
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
                        "activatedSince": "2020-06-20T19:00:06",
                        "completed": false,
                        "activated": true
                    }
                }
            ],
            "pageable": {
                "sort": {
                    "empty": true,
                    "sorted": false,
                    "unsorted": true
                },
                "offset": 0,
                "pageSize": 5,
                "pageNumber": 0,
                "paged": true,
                "unpaged": false
            },
            "last": true,
            "totalElements": 1,
            "totalPages": 1,
            "size": 5,
            "number": 0,
            "sort": {
                "empty": true,
                "sorted": false,
                "unsorted": true
            },
            "first": true,
            "numberOfElements": 1,
            "empty": false
        }
        """;

    public static final String SINGLE_COMPETITION = """
        {
            "id": 4,
            "name": "Competition_3.5_Template",
            "notes": "Template competition",
            "coach": {
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
                    }
                ],
                "activatedSince": "2020-06-20T19:00:06",
                "completed": false,
                "activated": true
            },
            "foxAmount": 5,
            "foxPoints": [],
            "startPoint": {
                "type": "Point",
                "coordinates": [
                    53.96867673,
                    27.30264677
                ]
            },
            "finishPoint": {
                "type": "Point",
                "coordinates": [
                    53.98070664,
                    27.30139962
                ]
            },
            "startDate": "2022-11-03T10:43:51",
            "createdDate": "2022-11-03T10:43:51",
            "updatedDate": "2022-11-03T10:43:51",
            "location": {
                "id": 11,
                "name": "Зеленое",
                "description": "Остановочный пункт электропоездов в Минском районе с примыкающим лесным массивом.",
                "center": {
                    "type": "Point",
                    "coordinates": [
                        53.97249843,
                        27.30587788
                    ]
                },
                "coordinates": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                53.99047578,
                                27.30355728
                            ],
                            [
                                53.99197019,
                                27.30144792
                            ],
                            [
                                53.9919449,
                                27.30020337
                            ],
                            [
                                53.99288057,
                                27.29659848
                            ],
                            [
                                53.99047578,
                                27.30355728
                            ]
                        ]
                    ]
                },
                "zoom": 15,
                "forbiddenAreas": [
                    {
                        "id": null,
                        "coordinates": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [
                                        53.98109879,
                                        27.30307674
                                    ],
                                    [
                                        53.98061186,
                                        27.30326986
                                    ],
                                    [
                                        53.98039684,
                                        27.30351662
                                    ],
                                    [
                                        53.98016286,
                                        27.30409598
                                    ],
                                    [
                                        53.9800427,
                                        27.3047719
                                    ],
                                    [
                                        53.98010594,
                                        27.30520105
                                    ],
                                    [
                                        53.98018183,
                                        27.30541563
                                    ],
                                    [
                                        53.98057391,
                                        27.30573749
                                    ],
                                    [
                                        53.98096599,
                                        27.30579114
                                    ],
                                    [
                                        53.98115571,
                                        27.30566239
                                    ],
                                    [
                                        53.98169323,
                                        27.30521178
                                    ],
                                    [
                                        53.98188294,
                                        27.30485773
                                    ],
                                    [
                                        53.98199044,
                                        27.30407452
                                    ],
                                    [
                                        53.98188294,
                                        27.3035059
                                    ],
                                    [
                                        53.98166161,
                                        27.30306601
                                    ],
                                    [
                                        53.98109879,
                                        27.30307674
                                    ]
                                ]
                            ]
                        }
                    }
                ]
            },
            "distanceType": {
                "id": 5,
                "name": "M5",
                "maxNumberOfFox": 5,
                "distanceLength": 10000
            },
            "participants": [
                {
                    "id": 19,
                    "firstName": "Anton",
                    "lastName": "Zavalski",
                    "dateOfBirth": "1995-11-01T17:25:00",
                    "country": "Belarus",
                    "city": "Minsk",
                    "email": "Anton.Zavalski@foxhunt.com",
                    "roles": [
                        {
                            "organizationId": null,
                            "userId": null,
                            "role": "PARTICIPANT"
                        }
                    ],
                    "activatedSince": "2022-10-13T17:30:15",
                    "completed": false,
                    "activated": true
                }
            ],
            "status": "SCHEDULED",
            "foxDuration": 60,
            "hasSilenceInterval": true,
            "frequency": 3.5,
            "isPrivate": false,
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
                "activatedSince": "2020-06-20T19:00:06",
                "completed": false,
                "activated": true
            }
        }
        """;
    public static final String MODIFY_COMPETITION_REQUEST = """
        {
            "coachId": 1,
            "createdBy": {
                "firstName": "",
                "lastName": ""
            },
            "finishPoint": {
                "type": "Point",
                "coordinates": [
                    53.987966768788816,
                    27.308771061306572
                ]
            },
            "isPrivate": false,
            "location": {
                "id": 4,
                "name": "Red carpets",
                "description": "description2",
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
                    "activatedSince": "2020-06-20T19:00:06",
                    "completed": false,
                    "activated": true
                },
                "isFavorite": false,
                "forbiddenAreas": [],
                "global": true,
                "updatable": true
            },
            "name": "New Competition",
            "notes": "",
            "startDate": "2022-11-03T11:41:46",
            "startPoint": {
                "type": "Point",
                "coordinates": [
                    54.01951802604537,
                    27.28267853200969
                ]
            },
            "foxPoints": null
        }
        """;
}
