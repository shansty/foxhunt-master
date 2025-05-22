UPDATE fh_admin.organization_user_role AS role
SET organization_id = organization.organization_id
FROM fh_admin.organization organization
WHERE organization.org_domain = 'pravda'
  AND role.organization_id IS NULL;

DELETE
FROM fh_admin.organization_user_role role_original
    USING fh_admin.organization_user_role role_duplicates
WHERE role_original.user_id = role_duplicates.user_id
  AND role_original.role_id = role_duplicates.role_id
  AND role_original.organization_id = role_duplicates.organization_id
  AND role_original.ctid < role_duplicates.ctid;

ALTER TABLE fh_admin.organization_user_role
    ADD PRIMARY KEY (user_id, role_id, organization_id);