package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.user.dao.OrganizationUserRoleRepository;
import com.itechart.foxhunt.api.user.dao.RoleRepository;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRole;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.mapper.OrganizationUserRoleMapper;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntity;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntityPK;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationUserRoleServiceImpl implements OrganizationUserRoleService {

    private final RoleRepository roleRepository;
    private final OrganizationUserRoleRepository organizationUserRoleRepository;
    private final UserMapper userMapper;
    private final OrganizationUserRoleMapper userRoleMapper;

    @Override
    public OrganizationUserRoleEntity addUserToOrganization(Long organizationId, User user, Role role) {
        return addUserToOrganization(organizationId, user, role, false);
    }

    @Override
    public OrganizationUserRoleEntity addUserToOrganization(Long organizationId, User user, Role role, boolean isActive) {
        log.info("Adding user {} to organization {} with role {}", user.getEmail(), organizationId, role);
        UserEntity userToAdd = userMapper.domainToEntity(user);
        RoleEntity roleEntity = findRole(role);
        OrganizationUserRoleEntity organizationUserRoleEntity =
            buildOrganizationUserRoleEntity(organizationId, userToAdd, roleEntity, isActive);
        return organizationUserRoleRepository.save(organizationUserRoleEntity);
    }

    @Override
    public List<OrganizationUserRoleEntity> addUsersToOrganization(Long organizationId, Set<User> users, Set<Role> roles) {
        Set<OrganizationUserRoleEntity> allOrgUserRoleEntities = new HashSet<>();
        roles.forEach(role -> {
            RoleEntity roleEntity = findRole(role);
            Set<OrganizationUserRoleEntity> orgUserRoleEntities = users.stream()
                .map(user -> {
                    UserEntity userEntity = userMapper.domainToEntity(user);
                    return buildOrganizationUserRoleEntity(organizationId, userEntity, roleEntity);
                })
                .collect(Collectors.toSet());
            allOrgUserRoleEntities.addAll(orgUserRoleEntities);
        });
        return organizationUserRoleRepository.saveAll(allOrgUserRoleEntities);
    }

    @Override
    public OrganizationUserRoleEntity findOrganizationUserRole(Long organizationId, Long userId, Role role) {
        log.info("Finding organization user role for organization {} and user {}", organizationId, userId);
        return organizationUserRoleRepository.findByOrganizationAndUserAndRole(organizationId, userId, role)
            .orElseThrow(() -> {
                log.error("Unable to find role {} in organization {} for user {}", role, organizationId, userId);
                throw new EntityNotFoundException(String.format("Unable to find role %s for provided user", role));
            });
    }

    @Override
    @Transactional
    public OrganizationUserRole changeOrganizationAdmin(Long organizationId, Long userId) {
        log.info("Changing organization admin to user with ID {} in organization {}", userId, organizationId);

        log.debug("Fetching trainer to turn admin role...");
        OrganizationUserRoleEntity trainerToTurnAdmin = findOrganizationUserRole(organizationId, userId, Role.TRAINER);
        RoleEntity trainerRole = trainerToTurnAdmin.getRoleEntity();
        log.debug("Fetching current organization admin role...");
        OrganizationUserRoleEntity currentOrgAdmin = findOrganizationAdmin(organizationId);
        RoleEntity organizationAdminRole = currentOrgAdmin.getRoleEntity();

        OrganizationUserRoleEntity orgAdminTurnedToTrainer =
            buildOrganizationUserRoleEntity(organizationId, currentOrgAdmin.getUserEntity(), trainerRole);
        orgAdminTurnedToTrainer.setActive(true);
        OrganizationUserRoleEntity trainerTurnedToOrgAdmin =
            buildOrganizationUserRoleEntity(organizationId, trainerToTurnAdmin.getUserEntity(), organizationAdminRole);
        orgAdminTurnedToTrainer.setActive(true);

        log.debug("Deleting current organization admin role and trainer to turn admin role...");
        organizationUserRoleRepository.deleteAll(List.of(currentOrgAdmin, trainerTurnedToOrgAdmin));
        log.debug("Saving organization admin turned trainer role and new organization admin role...");
        organizationUserRoleRepository.saveAll(List.of(orgAdminTurnedToTrainer, trainerTurnedToOrgAdmin));

        return userRoleMapper.entityToDomain(trainerTurnedToOrgAdmin);
    }

    @Override
    public void updateActiveStatus(Long organizationId, Long userId, Role role, boolean isActive) {
        OrganizationUserRoleEntity roleToToggle = findOrganizationUserRole(organizationId, userId, role);
        roleToToggle.setActive(isActive);
        organizationUserRoleRepository.save(roleToToggle);
    }

    @Override
    public Set<OrganizationUserRoleEntity> findAllByOrganizationIdAndUserId(Long organizationId, Long userId) {
        return organizationUserRoleRepository.findAllByOrganizationIdAndUserId(organizationId, userId);
    }

    @Override
    public void updateActiveStatus(Long organizationId, Long userId, boolean isActive) {
        Set<OrganizationUserRoleEntity> orgUserRoles = findAllByOrganizationIdAndUserId(organizationId, userId);
        orgUserRoles.forEach(orgUserRole -> orgUserRole.setActive(isActive));
        organizationUserRoleRepository.saveAll(orgUserRoles);
    }

    public Set<OrganizationUserRoleEntity> findAllByOrganizationAndUserEmailsAndActiveStatus(Long organizationId,
                                                                                             Set<String> userEmails,
                                                                                             boolean isActive) {
        return organizationUserRoleRepository.findAllByOrganizationAndUserEmailsAndActiveStatus(organizationId, userEmails, isActive);
    }

    @Override
    public void deactivateAllRoles(Long organizationId, Long userId) {
        Set<OrganizationUserRoleEntity> deactivatedOrgUserRoles = findAllByOrganizationIdAndUserId(organizationId, userId).stream()
            .peek(orgUserRole -> orgUserRole.setActive(false))
            .collect(Collectors.toSet());
        organizationUserRoleRepository.saveAll(deactivatedOrgUserRoles);
    }

    @Override
    public void deleteAllRoles(Long organizationId, Long userId) {
        Set<OrganizationUserRoleEntity> orgUserRoles =
            organizationUserRoleRepository.findAllByOrganizationIdAndUserId(organizationId, userId);
        organizationUserRoleRepository.deleteAll(orgUserRoles);
    }

    @Override
    public void deleteAllRoles(Long userId) {
        List<OrganizationUserRoleEntity> orgUserRoles = organizationUserRoleRepository.findAllByUserId(userId);
        organizationUserRoleRepository.deleteAll(orgUserRoles);
    }

    private OrganizationUserRoleEntity findOrganizationAdmin(Long organizationId) {
        return organizationUserRoleRepository.findByOrganizationAndRole(organizationId, Role.ORGANIZATION_ADMIN)
            .orElseThrow(() -> {
                log.error("Unable to find organization admin in organization {}", organizationId);
                throw new EntityNotFoundException("Organization admin not found");
            });
    }

    private RoleEntity findRole(Role role) {
        return roleRepository.findByRole(role).orElseThrow(() -> {
            log.error("Role {} doesn't exist", role);
            throw new EntityNotFoundException(String.format("Role %s not found", role));
        });
    }

    private OrganizationUserRoleEntity buildOrganizationUserRoleEntity(Long organizationId,
                                                                       UserEntity user, RoleEntity roleEntity) {
        return buildOrganizationUserRoleEntity(organizationId, user, roleEntity, false);
    }

    private OrganizationUserRoleEntity buildOrganizationUserRoleEntity(Long organizationId,
                                                                       UserEntity user, RoleEntity roleEntity, boolean isActive) {
        OrganizationUserRoleEntity organizationUserRoleEntity = new OrganizationUserRoleEntity();
        OrganizationUserRoleEntityPK id =
            new OrganizationUserRoleEntityPK(user.getId(), roleEntity.getId(), organizationId);
        organizationUserRoleEntity.setId(id);
        organizationUserRoleEntity.setRoleEntity(roleEntity);
        organizationUserRoleEntity.setUserEntity(user);
        organizationUserRoleEntity.setActive(isActive);
        return organizationUserRoleEntity;
    }
}
