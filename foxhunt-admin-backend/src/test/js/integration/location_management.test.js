const request = require("supertest");
const { orgId_without_feature_flag, orgId_with_feature_flag,
    generateToken, getLocationBody,
    locationName, uniqueLocationName,
    API_URL, org_admin_email,
    org_admin_email_without_location_management_flag,
    participant_email, locationNameForClonedRequest } = require("./test.data")


describe("Feature flag: LOCATION_MANAGEMENT", () => {

    it("Should succeed createLocation when LOCATION_MANAGEMENT is enabled and role is ROLE_ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email,
            organizationId: orgId_with_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });
        const body = getLocationBody(uniqueLocationName);
        const res = await request(API_URL)
            .post("/api/v1/locations")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe(body.name);
    })

    it("Should failed createLocation when LOCATION_MANAGEMENT is disabled and role is ROLE_ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email_without_location_management_flag,
            organizationId: orgId_without_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });
        const body = getLocationBody(uniqueLocationName);
        const res = await request(API_URL)
            .post("/api/v1/locations")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(`LOCATION_MANAGEMENT operations are unsupported`)
    })

    it("Should failed createLocation when LOCATION_MANAGEMENT is enabled but role is ROLE_PARTICIPANT", async () => {
        const token = generateToken({
            email: participant_email,
            organizationId: orgId_with_feature_flag,
            roles: ["PARTICIPANT"],
        });
        const body = getLocationBody(uniqueLocationName);
        const res = await request(API_URL)
            .post("/api/v1/locations")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(`Access is denied`)
    })

    it("Should failed createLocation when organization name already exist", async () => {
        const token = generateToken({
            email: org_admin_email,
            organizationId: orgId_with_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });
        const body = getLocationBody(locationName);
        const res = await request(API_URL)
            .post("/api/v1/locations")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(`Location with name ${body.name} already exists in organization ${orgId_with_feature_flag}.`)
    })

    it("Should succeed cloneLocation when LOCATION_MANAGEMENT is enabled and role is ROLE_ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email,
            organizationId: orgId_with_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });
        const sourceId = 10;
        const res = await request(API_URL)
            .post(`/api/v1/locations?sourceId=${sourceId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(locationNameForClonedRequest);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
    })

    it("Should failed cloneLocation when locationName is the same and LOCATION_MANAGEMENT is enabled and role is ROLE_ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email,
            organizationId: orgId_with_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });
        const sourceId = 10;
        const cloneRequest = {
            name: locationName
        };
        const res = await request(API_URL)
            .post(`/api/v1/locations?sourceId=${sourceId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(cloneRequest);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(`Location with name ${locationName} already exists in organization ${orgId_with_feature_flag}.`)
    })

    it("Should failed cloneLocation when LOCATION_MANAGEMENT is disabled and role is ROLE_ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email_without_location_management_flag,
            organizationId: orgId_without_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });
        const sourceId = 10;
        const res = await request(API_URL)
            .post(`/api/v1/locations?sourceId=${sourceId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(locationNameForClonedRequest);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(`LOCATION_MANAGEMENT operations are unsupported`)
    })
});