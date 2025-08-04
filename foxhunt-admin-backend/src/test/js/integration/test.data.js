const jwt = require("jsonwebtoken");

const API_URL = "http://localhost:8083";
const JWT_SECRET = "cchjr2kl01k5sblv2l9y";
const orgId_with_feature_flag = 1;
const orgId_without_feature_flag = 2;
const org_admin_email = "1123@gmail.com";
const participant_email = "1623@gmail.com";
const org_admin_email_without_location_management_flag = "bestteam@mail.com";
const uniqueLocationName = `Location name for test ${Date.now()}`;
const locationName = "Testing";

function getLocationBody(location_name) {
    return {
        "center": {
            "type": "Point",
            "coordinates": [
                53.91282017003054,
                27.517807022909864
            ]
        },
        "coordinates": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        53.924288606882676,
                        27.47410203659949
                    ],
                    [
                        53.883943804966734,
                        27.509120957497945
                    ],
                    [
                        53.90847973112322,
                        27.620357529763567
                    ],
                    [
                        53.941509381663266,
                        27.537960068826074
                    ],
                    [
                        53.940496592540775,
                        27.500537888650292
                    ],
                    [
                        53.92915166664659,
                        27.412990586404202
                    ],
                    [
                        53.90178955031349,
                        27.41024400437293
                    ],
                    [
                        53.88333529233043,
                        27.46929551804481
                    ],
                    [
                        53.880292595666795,
                        27.509807603005758
                    ],
                    [
                        53.87907545470851,
                        27.540020005349508
                    ],
                    [
                        53.88739187515509,
                        27.50431443894324
                    ],
                    [
                        53.87927831400687,
                        27.551692978982302
                    ],
                    [
                        53.8922592525124,
                        27.502254502419806
                    ],
                    [
                        53.924288606882676,
                        27.47410203659949
                    ]
                ]
            ]
        },
        "createdBy": {
            "id": 1,
            "email": "test@gmail.com",
            "activated": true,
            "firstName": "",
            "lastName": ""
        },
        "description": "Test location2",
        "forbiddenAreas": [],
        "global": false,
        "id": null,
        "name": location_name,
        "updatedBy": {
            "id": 1,
            "email": "test@gmail.com",
            "activated": true,
            "firstName": "",
            "lastName": ""
        },
        "zoom": 12,
        "isFavorite": false
    }
}

function generateToken({ email, organizationId, roles }) {
    const now = Math.floor(Date.now() / 1000);
    return jwt.sign(
        {
            email,
            organizationId,
            roles,
            iat: now,
            exp: now + 3600,
        },
        JWT_SECRET,
        { algorithm: "HS256" }
    );
}

const locationNameForClonedRequest = {
    name: `Cloned location for test ${Date.now()}`
};


function getLocationPackageBody(name) {
    return {
        "name": name,
        "description": "Integration test package",
        "center": { "type": "Point", "coordinates": [27.51, 53.91] },
        "coordinates": { "type": "Polygon", "coordinates": [[[27.51, 53.91], [27.52, 53.92], [27.51, 53.91]]] },
        "zoom": 12,
        "accessType": "PRIVATE",
        "assignmentType": "AREA_BASED",
        "locations": []
    };
};

module.exports = {
    API_URL,
    uniqueLocationName,
    locationName,
    orgId_without_feature_flag,
    orgId_with_feature_flag,
    org_admin_email,
    org_admin_email_without_location_management_flag,
    participant_email,
    locationNameForClonedRequest,
    generateToken,
    getLocationBody,
    getLocationPackageBody
};