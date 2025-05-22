package com.foxes.main.di.provider

import com.foxes.main.data.api.CompetitionsApi
import com.foxes.main.data.api.models.CompetitionResponse
import com.foxes.main.di.AppDependencies
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf
import toothpick.InjectConstructor
import javax.inject.Provider

@InjectConstructor
class CompetitionsApiProvider(
    private val appDependencies: AppDependencies,
) : Provider<CompetitionsApi> {
    override fun get(): CompetitionsApi {
        return object: CompetitionsApi {
            override fun getCompetitions(): Flow<CompetitionResponse> {
                return flowOf(
                    appDependencies.gson.fromJson(data, CompetitionResponse::class.java)
                )
            }
        }
    }

    companion object {
        private val data = """
            {
              "content": [
                {
                  "id": 1,
                  "name": "comp1",
                  "notes": "Fake competition",
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
                      },
                      {
                        "organizationId": null,
                        "userId": null,
                        "role": "TRAINER"
                      }
                    ],
                    "activatedSince": "2020-01-04T15:07:08",
                    "completed": false,
                    "activated": true
                  },
                  "foxAmount": 2,
                  "foxPoints": [
                    {
                      "id": 2,
                      "index": 2,
                      "label": "F2",
                      "coordinates": {
                        "type": "Point",
                        "coordinates": [
                          53.909,
                          27.573
                        ]
                      },
                      "frequency": 144.0
                    },
                    {
                      "id": 1,
                      "index": 1,
                      "label": "F1",
                      "coordinates": {
                        "type": "Point",
                        "coordinates": [
                          53.906,
                          27.571
                        ]
                      },
                      "frequency": 144.0
                    }
                  ],
                  "startPoint": {
                    "type": "Point",
                    "coordinates": [
                      53.905,
                      27.57
                    ]
                  },
                  "finishPoint": {
                    "type": "Point",
                    "coordinates": [
                      53.91,
                      27.567
                    ]
                  },
                  "startDate": "2020-04-12T21:30:59",
                  "createdDate": "2020-02-01T17:25:00",
                  "updatedDate": "2022-11-03T12:42:09",
                  "location": {
                    "id": 1,
                    "name": "location1",
                    "description": "description1",
                    "center": {
                      "type": "Point",
                      "coordinates": [
                        53.908,
                        27.567
                      ]
                    },
                    "coordinates": {
                      "type": "Polygon",
                      "coordinates": [
                        [
                          [
                            53.907,
                            27.566
                          ],
                          [
                            53.91,
                            27.57
                          ],
                          [
                            53.907,
                            27.568
                          ],
                          [
                            53.908,
                            27.57
                          ],
                          [
                            53.907,
                            27.566
                          ]
                        ]
                      ]
                    },
                    "forbiddenAreas": []
                  },
                  "distanceType": {
                    "id": 2,
                    "name": "M2",
                    "maxNumberOfFox": 3,
                    "distanceLength": 1500
                  },
                  "participants": [
                    {
                      "id": 8,
                      "firstName": "Vitaly",
                      "lastName": "Polkon",
                      "dateOfBirth": "1995-02-01T17:25:00",
                      "country": "Belarus",
                      "city": "Minsk",
                      "email": "6754@gmail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-05-05T10:56:27",
                      "color": "#a68064",
                      "completed": false,
                      "activated": true
                    },
                    {
                      "id": 6,
                      "firstName": "Sveta",
                      "lastName": "Rukhina",
                      "dateOfBirth": "1995-02-01T17:25:00",
                      "country": "Belarus",
                      "city": "Minsk",
                      "email": "1999993@gmail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-05-28T14:49:35",
                      "color": "#a68064",
                      "completed": false,
                      "activated": true
                    },
                    {
                      "id": 5,
                      "firstName": "Stepan",
                      "lastName": "Vingradov",
                      "dateOfBirth": "1995-02-01T17:25:00",
                      "country": "Belarus",
                      "city": "Minsk",
                      "email": "234@gmail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-03-03T06:22:50",
                      "color": "#a68064",
                      "completed": false,
                      "activated": true
                    },
                    {
                      "id": 7,
                      "firstName": "Vitya",
                      "lastName": "Petrov",
                      "dateOfBirth": "1995-02-01T17:25:00",
                      "country": "Belarus",
                      "city": "Minsk",
                      "email": "45674@gmail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-01-05T14:57:03",
                      "color": "#a68064",
                      "completed": false,
                      "activated": true
                    },
                    {
                      "id": 4,
                      "firstName": "Vasya",
                      "lastName": "Galkin",
                      "dateOfBirth": "1995-02-01T17:25:00",
                      "country": "Belarus",
                      "city": "Minsk",
                      "email": "16231@gmail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-01-19T14:57:27",
                      "color": "#a68064",
                      "completed": false,
                      "activated": true
                    }
                  ],
                  "status": "CANCELED",
                  "foxDuration": 60,
                  "hasSilenceInterval": true,
                  "frequency": 144.0,
                  "isPrivate": false,
                  "createdBy": {
                    "id": 9,
                    "firstName": "Alex",
                    "lastName": "Belyaev",
                    "email": "Alex_Belyaev@mail.com",
                    "roles": [
                      {
                        "organizationId": null,
                        "userId": null,
                        "role": "TRAINER"
                      }
                    ],
                    "activatedSince": "2020-06-25T18:43:06",
                    "completed": false,
                    "activated": true
                  }
                },
                {
                  "id": 2,
                  "name": "comp2",
                  "notes": "Best competition ever!",
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
                      },
                      {
                        "organizationId": null,
                        "userId": null,
                        "role": "TRAINER"
                      }
                    ],
                    "activatedSince": "2020-01-04T15:07:08",
                    "completed": false,
                    "activated": true
                  },
                  "foxAmount": 1,
                  "foxPoints": [
                    {
                      "id": 3,
                      "index": 1,
                      "label": "V1",
                      "coordinates": {
                        "type": "Point",
                        "coordinates": [
                          53.906,
                          27.572
                        ]
                      },
                      "frequency": 144.0
                    }
                  ],
                  "startPoint": {
                    "type": "Point",
                    "coordinates": [
                      53.905,
                      27.57
                    ]
                  },
                  "finishPoint": {
                    "type": "Point",
                    "coordinates": [
                      53.91,
                      27.567
                    ]
                  },
                  "startDate": "2020-04-12T21:30:59",
                  "createdDate": "2020-01-03T09:59:00",
                  "updatedDate": "2020-02-03T14:11:00",
                  "location": {
                    "id": 2,
                    "name": "location2",
                    "description": "description2",
                    "center": {
                      "type": "Point",
                      "coordinates": [
                        53.908,
                        27.567
                      ]
                    },
                    "coordinates": {
                      "type": "Polygon",
                      "coordinates": [
                        [
                          [
                            53.907,
                            27.566
                          ],
                          [
                            53.91,
                            27.57
                          ],
                          [
                            53.907,
                            27.568
                          ],
                          [
                            53.908,
                            27.57
                          ],
                          [
                            53.907,
                            27.566
                          ]
                        ]
                      ]
                    },
                    "forbiddenAreas": []
                  },
                  "distanceType": {
                    "id": 3,
                    "name": "M3",
                    "maxNumberOfFox": 5,
                    "distanceLength": 3000
                  },
                  "participants": [
                    {
                      "id": 8,
                      "firstName": "Vitaly",
                      "lastName": "Polkon",
                      "dateOfBirth": "1995-02-01T17:25:00",
                      "country": "Belarus",
                      "city": "Minsk",
                      "email": "6754@gmail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-05-05T10:56:27",
                      "color": "#a68064",
                      "completed": false,
                      "activated": true
                    },
                    {
                      "id": 7,
                      "firstName": "Vitya",
                      "lastName": "Petrov",
                      "dateOfBirth": "1995-02-01T17:25:00",
                      "country": "Belarus",
                      "city": "Minsk",
                      "email": "45674@gmail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-01-05T14:57:03",
                      "color": "#a68064",
                      "completed": false,
                      "activated": true
                    }
                  ],
                  "status": "FINISHED",
                  "foxDuration": 120,
                  "hasSilenceInterval": false,
                  "frequency": 144.0,
                  "isPrivate": false,
                  "createdBy": {
                    "id": 9,
                    "firstName": "Alex",
                    "lastName": "Belyaev",
                    "email": "Alex_Belyaev@mail.com",
                    "roles": [
                      {
                        "organizationId": null,
                        "userId": null,
                        "role": "TRAINER"
                      }
                    ],
                    "activatedSince": "2020-06-25T18:43:06",
                    "completed": false,
                    "activated": true
                  }
                },
                {
                  "id": 3,
                  "name": "Крыжовка",
                  "notes": "Крыжовка Слева - Зима",
                  "coach": {
                    "id": 9,
                    "firstName": "Alex",
                    "lastName": "Belyaev",
                    "email": "Alex_Belyaev@mail.com",
                    "roles": [
                      {
                        "organizationId": null,
                        "userId": null,
                        "role": "TRAINER"
                      }
                    ],
                    "activatedSince": "2020-06-25T18:43:06",
                    "completed": false,
                    "activated": true
                  },
                  "foxAmount": 5,
                  "foxPoints": [
                    {
                      "id": 8,
                      "index": 5,
                      "label": "5",
                      "coordinates": {
                        "type": "Point",
                        "coordinates": [
                          53.958376,
                          27.306076
                        ]
                      },
                      "frequency": 144.0
                    },
                    {
                      "id": 7,
                      "index": 4,
                      "label": "4",
                      "coordinates": {
                        "type": "Point",
                        "coordinates": [
                          53.950646,
                          27.304447
                        ]
                      },
                      "frequency": 144.0
                    },
                    {
                      "id": 6,
                      "index": 3,
                      "label": "3",
                      "coordinates": {
                        "type": "Point",
                        "coordinates": [
                          53.956243,
                          27.295004
                        ]
                      },
                      "frequency": 144.0
                    },
                    {
                      "id": 5,
                      "index": 2,
                      "label": "2",
                      "coordinates": {
                        "type": "Point",
                        "coordinates": [
                          53.957468,
                          27.307572
                        ]
                      },
                      "frequency": 144.0
                    },
                    {
                      "id": 4,
                      "index": 1,
                      "label": "1",
                      "coordinates": {
                        "type": "Point",
                        "coordinates": [
                          53.953467,
                          27.301091
                        ]
                      },
                      "frequency": 144.0
                    }
                  ],
                  "startPoint": {
                    "type": "Point",
                    "coordinates": [
                      553.950607,
                      27.314374
                    ]
                  },
                  "finishPoint": {
                    "type": "Point",
                    "coordinates": [
                      53.952992,
                      27.312944
                    ]
                  },
                  "startDate": "2022-11-03T12:09:48",
                  "createdDate": "2022-11-03T11:39:48",
                  "updatedDate": "2022-11-03T12:09:48",
                  "location": {
                    "id": 3,
                    "name": "Крыжовка Слева",
                    "description": "Холмистый смешанный лес с дачными кооперативами и заболоченными местами. 30 минут от ЖД вокзала Минска в Молодеченском направлении",
                    "center": {
                      "type": "Point",
                      "coordinates": [
                        53.950789,
                        27.306704
                      ]
                    },
                    "coordinates": {
                      "type": "Polygon",
                      "coordinates": [
                        [
                          [
                            53.959851,
                            27.307862
                          ],
                          [
                            53.95535,
                            27.289824
                          ],
                          [
                            53.944307,
                            27.303471
                          ],
                          [
                            53.945418,
                            27.313347
                          ],
                          [
                            53.943497,
                            27.315911
                          ],
                          [
                            53.945878,
                            27.322262
                          ],
                          [
                            53.951429,
                            27.315631
                          ],
                          [
                            53.954892,
                            27.311869
                          ],
                          [
                            53.959851,
                            27.307862
                          ]
                        ]
                      ]
                    },
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
                      "id": 11,
                      "firstName": "Mark",
                      "lastName": "Zuman",
                      "email": "Mark_Zuman@mail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-04-19T01:05:14",
                      "participantNumber": 4,
                      "startPosition": 2,
                      "color": "#a68064",
                      "startDate": "2022-11-03T12:09:48",
                      "completed": false,
                      "activated": true
                    },
                    {
                      "id": 12,
                      "firstName": "Test",
                      "lastName": "Participant",
                      "email": "Test_Participant@mail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-07-27T15:08:51",
                      "participantNumber": 3,
                      "startPosition": 2,
                      "color": "#a68064",
                      "startDate": "2022-11-03T12:09:48",
                      "completed": false,
                      "activated": true
                    },
                    {
                      "id": 13,
                      "firstName": "Ivan",
                      "lastName": "Petrov",
                      "email": "Ivan_Petrov@mail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-09-13T09:53:54",
                      "participantNumber": 2,
                      "startPosition": 1,
                      "color": "#a68064",
                      "startDate": "2022-11-03T12:09:48",
                      "completed": false,
                      "activated": true
                    },
                    {
                      "id": 10,
                      "firstName": "Sergey",
                      "lastName": "Dodon",
                      "email": "Sergey_Dodon@mail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-08-17T13:00:39",
                      "participantNumber": 5,
                      "startPosition": 3,
                      "color": "#a68064",
                      "startDate": "2022-11-03T12:09:48",
                      "completed": false,
                      "activated": true
                    },
                    {
                      "id": 14,
                      "firstName": "Igor",
                      "lastName": "Ivanovitch",
                      "email": "Igor_Ivanovitch@mail.com",
                      "roles": [
                        {
                          "organizationId": null,
                          "userId": null,
                          "role": "PARTICIPANT"
                        }
                      ],
                      "activatedSince": "2020-01-28T22:04:30",
                      "participantNumber": 1,
                      "startPosition": 1,
                      "color": "#a68064",
                      "startDate": "2022-11-03T12:09:48",
                      "completed": false,
                      "activated": true
                    }
                  ],
                  "status": "FINISHED",
                  "foxDuration": 60,
                  "hasSilenceInterval": true,
                  "actualStartDate": "2022-11-03T12:09:48",
                  "frequency": 144.0,
                  "isPrivate": false,
                  "createdBy": {
                    "id": 9,
                    "firstName": "Alex",
                    "lastName": "Belyaev",
                    "email": "Alex_Belyaev@mail.com",
                    "roles": [
                      {
                        "organizationId": null,
                        "userId": null,
                        "role": "TRAINER"
                      }
                    ],
                    "activatedSince": "2020-06-25T18:43:06",
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
                "pageNumber": 0,
                "pageSize": 2147483647,
                "paged": true,
                "unpaged": false
              },
              "last": true,
              "totalElements": 3,
              "totalPages": 1,
              "size": 2147483647,
              "number": 0,
              "sort": {
                "empty": true,
                "sorted": false,
                "unsorted": true
              },
              "first": true,
              "numberOfElements": 3,
              "empty": false
            }
        """.trimIndent()
    }
}