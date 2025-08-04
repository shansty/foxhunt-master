const request = require("supertest");
const { orgId_without_feature_flag, orgId_with_feature_flag,
    generateToken,
    API_URL, org_admin_email,
    participant_email } = require("./test.data")


describe("Feature flag: FAVORITE_LOCATION_MANAGEMENT", () => {

    it("Should succeed toggleFavoriteLocation when FAVORITE_LOCATION_MANAGEMENT is enabled and role is ROLE_ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email,
            organizationId: orgId_with_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });
        const id = 16;
        const res = await request(API_URL)
            .put(`/api/v1/locations/${id}/favorite`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toBe(id);
    })

    it("Should failed toggleFavoriteLocation when FAVORITE_LOCATION_MANAGEMENT is disabled and role is ROLE_ORGANIZATION_ADMIN", async () => {
        const token = generateToken({
            email: org_admin_email,
            organizationId: orgId_without_feature_flag,
            roles: ["ORGANIZATION_ADMIN"],
        });
        const id = 16;
        const res = await request(API_URL)
            .put(`/api/v1/locations/${id}/favorite`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(`FAVORITE_LOCATION_MANAGEMENT operations are unsupported`)
    })

    it("Should failed toggleFavoriteLocation when FAVORITE_LOCATION_MANAGEMENT is enabled but role is ROLE_PARTICIPANT", async () => {
        const token = generateToken({
            email: participant_email,
            organizationId: orgId_with_feature_flag,
            roles: ["PARTICIPANT"],
        });
        const id = 16;
        const res = await request(API_URL)
            .put(`/api/v1/locations/${id}/favorite`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(`Access is denied`)
    })
});