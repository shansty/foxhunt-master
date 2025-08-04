const request = require("supertest");
const { orgId_without_feature_flag, orgId_with_feature_flag,
    generateToken, getLocationPackageBody,
    locationName,
    API_URL, org_admin_email,
    participant_email,
    org_admin_email_without_location_management_flag } = require("./test.data")


describe("Feature flag: LOCATION_PACKAGE_MANAGEMENT (createOne)", () => {

    it("Should succeed createOne when LOCATION_PACKAGE_MANAGEMENT is enabled and role is ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email,
            organizationId: orgId_with_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });

        const body = getLocationPackageBody(locationName);
        const res = await request(API_URL)
            .post("/api/v1/location-packages")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("description");
        expect(res.body).toHaveProperty("name");
        expect(res.body.description).toBe(body.description);
        expect(res.body.name).toBe(body.name);
    });

    it("Should fail createOne when LOCATION_PACKAGE_MANAGEMENT is disabled and role is ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email_without_location_management_flag,
            organizationId: orgId_without_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });

        console.log(token)

        const body = getLocationPackageBody(locationName);

        const res = await request(API_URL)
            .post("/api/v1/location-packages")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(`LOCATION_PACKAGE_MANAGEMENT operations are unsupported`);
    });


    it("Should fail createOne when LOCATION_PACKAGE_MANAGEMENT is enabled but role is PARTICIPANT", async () => {
        const token = generateToken({
            email: participant_email,
            organizationId: orgId_with_feature_flag,
            roles: ["PARTICIPANT"],
        });
        const body = getLocationPackageBody(locationName);

        const res = await request(API_URL)
            .post("/api/v1/location-packages")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(`Access is denied`);
    });
});

describe("Feature flag: LOCATION_PACKAGE_MANAGEMENT (deleteOne)", () => {

    it("Should succeed deleteOne when LOCATION_PACKAGE_MANAGEMENT is enabled and role is ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email,
            organizationId: orgId_with_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });

        const createBody = getLocationPackageBody(locationName + "_for_delete");
        const createRes = await request(API_URL)
            .post("/api/v1/location-packages")
            .set("Authorization", `Bearer ${token}`)
            .send(createBody);

        expect(createRes.status).toBe(201);
        const packageId = createRes.body.locationPackageId;

        const deleteRes = await request(API_URL)
            .delete(`/api/v1/location-packages/${packageId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body).toBe(packageId);
    });

    it("Should fail deleteOne when LOCATION_PACKAGE_MANAGEMENT is disabled and role is ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email_without_location_management_flag,
            organizationId: orgId_without_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });

        const fakeId = 999997;

        const res = await request(API_URL)
            .delete(`/api/v1/location-packages/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("LOCATION_PACKAGE_MANAGEMENT operations are unsupported");
    });

    it("Should fail deleteOne when LOCATION_PACKAGE_MANAGEMENT is enabled but role is PARTICIPANT", async () => {
        const token = generateToken({
            email: participant_email,
            organizationId: orgId_with_feature_flag,
            roles: ["PARTICIPANT"],
        });

        const fakeId = 999996;

        const res = await request(API_URL)
            .delete(`/api/v1/location-packages/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Access is denied");
    });
});


describe("Feature flag: LOCATION_PACKAGE_MANAGEMENT (updateOne)", () => {

    it("Should succeed updateOne when LOCATION_PACKAGE_MANAGEMENT is enabled and role is ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email,
            organizationId: orgId_with_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });

        const createBody = getLocationPackageBody(locationName + "_for_update");
        const createRes = await request(API_URL)
            .post("/api/v1/location-packages")
            .set("Authorization", `Bearer ${token}`)
            .send(createBody);

        expect(createRes.status).toBe(201);
        const packageId = createRes.body.locationPackageId;

        const updatedBody = { ...createBody, name: createBody.name + "_updated", description: "Updated description" };
        const updateRes = await request(API_URL)
            .put(`/api/v1/location-packages/${packageId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedBody);

        expect(updateRes.status).toBe(200);
        expect(updateRes.body).toHaveProperty("locationPackageId", packageId);
        expect(updateRes.body.name).toBe(updatedBody.name);
        expect(updateRes.body.description).toBe("Updated description");
    });

    it("Should fail updateOne when LOCATION_PACKAGE_MANAGEMENT is disabled and role is ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email_without_location_management_flag,
            organizationId: orgId_without_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });

        const fakeId = 999999; 
        const body = getLocationPackageBody(locationName + "_fail_update");

        const res = await request(API_URL)
            .put(`/api/v1/location-packages/${fakeId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("LOCATION_PACKAGE_MANAGEMENT operations are unsupported");
    });

    it("Should fail updateOne when LOCATION_PACKAGE_MANAGEMENT is enabled but role is PARTICIPANT", async () => {
        const token = generateToken({
            email: participant_email,
            organizationId: orgId_with_feature_flag,
            roles: ["PARTICIPANT"],
        });

        const fakeId = 999998; 
        const body = getLocationPackageBody(locationName + "_fail_participant");

        const res = await request(API_URL)
            .put(`/api/v1/location-packages/${fakeId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Access is denied");
    });

});
