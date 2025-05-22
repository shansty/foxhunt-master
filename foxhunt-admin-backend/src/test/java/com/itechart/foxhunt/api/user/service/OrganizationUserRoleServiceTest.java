package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.user.dao.OrganizationUserRoleRepository;
import com.itechart.foxhunt.api.user.dao.RoleRepository;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRole;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.mapper.OrganizationUserRoleMapper;
import com.itechart.foxhunt.api.user.mapper.OrganizationUserRoleMapperImpl;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.api.user.util.UserTestUtils;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntity;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntityPK;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {OrganizationUserRoleServiceImpl.class, UserMapperImpl.class, OrganizationUserRoleMapperImpl.class})
public class OrganizationUserRoleServiceTest {

    @MockBean
    RoleRepository roleRepository;

    @MockBean
    OrganizationUserRoleRepository organizationUserRoleRepository;

    @Autowired
    UserMapper userMapper;

    @Autowired
    OrganizationUserRoleMapper userRoleMapper;

    @Autowired
    OrganizationUserRoleService userRoleService;

    @Test
    void expectChangesOrganizationAdminInProvidedOrganization() {
        //given
        Long organizationId = 1L;
        Long userToTurnAdminId = 29L;

        RoleEntity trainerRole = buildRoleEntity(Role.TRAINER);
        RoleEntity organizationAdminRole = buildRoleEntity(Role.ORGANIZATION_ADMIN);

        User trainerToTurnAdmin = UserTestUtils.getUser();
        trainerToTurnAdmin.setId(userToTurnAdminId);
        UserEntity trainerToTurnAdminEntity = userMapper.domainToEntity(trainerToTurnAdmin);

        User currentOrgAdmin = UserTestUtils.getUser();
        currentOrgAdmin.setId(1L);
        UserEntity currentOrgAdminEntity = userMapper.domainToEntity(currentOrgAdmin);

        OrganizationUserRoleEntity trainerToTurnAdminRole =
            buildOrganizationUserRoleEntity(organizationId, trainerToTurnAdminEntity, trainerRole);
        OrganizationUserRoleEntity currentOrgAdminRole =
            buildOrganizationUserRoleEntity(organizationId, currentOrgAdminEntity, organizationAdminRole);

        OrganizationUserRoleEntity trainerTurnedToAdminRole =
            buildOrganizationUserRoleEntity(organizationId, trainerToTurnAdminEntity, organizationAdminRole);

        //when
        when(organizationUserRoleRepository
            .findByOrganizationAndUserAndRole(organizationId, userToTurnAdminId, Role.TRAINER))
            .thenReturn(Optional.of(trainerToTurnAdminRole));
        when(organizationUserRoleRepository.findByOrganizationAndRole(organizationId, Role.ORGANIZATION_ADMIN))
            .thenReturn(Optional.of(currentOrgAdminRole));

        //then
        OrganizationUserRole expectedReturnedAdminRole = userRoleMapper.entityToDomain(trainerTurnedToAdminRole);
        OrganizationUserRole returnedAdminRole = userRoleService.changeOrganizationAdmin(organizationId, userToTurnAdminId);
        assertEquals(expectedReturnedAdminRole, returnedAdminRole);

        verify(organizationUserRoleRepository).deleteAll(any());
        verify(organizationUserRoleRepository).saveAll(any());
    }

    @Test
    void expectEntityNotFoundExceptionWhenUserToTurnAdminDoesNotHaveTrainerRole() {
        //given
        Long organizationId = 1L;
        Long userToTurnAdminId = 29L;

        User trainerToTurnAdmin = UserTestUtils.getUser();
        trainerToTurnAdmin.setId(userToTurnAdminId);

        //when
        when(organizationUserRoleRepository
            .findByOrganizationAndUserAndRole(organizationId, userToTurnAdminId, Role.TRAINER))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> {
            userRoleService.changeOrganizationAdmin(organizationId, userToTurnAdminId);
        });
    }

    @Test
    void expectEntityNotFoundWhenUnableToFindOrganizationAdminInProvidedOrganization() {
        //given
        Long organizationId = 1L;
        Long userToTurnAdminId = 29L;

        RoleEntity trainerRole = new RoleEntity();
        trainerRole.setRole(Role.TRAINER);

        UserEntity trainerToTurnAdmin = userMapper.domainToEntity(UserTestUtils.getUser());
        trainerToTurnAdmin.setId(userToTurnAdminId);
        OrganizationUserRoleEntity trainerToTurnAdminRole =
            buildOrganizationUserRoleEntity(organizationId, trainerToTurnAdmin, trainerRole);

        //when
        when(organizationUserRoleRepository
            .findByOrganizationAndUserAndRole(organizationId, userToTurnAdminId, Role.TRAINER))
            .thenReturn(Optional.of(trainerToTurnAdminRole));
        when(organizationUserRoleRepository.findByOrganizationAndRole(organizationId, Role.ORGANIZATION_ADMIN))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> {
            userRoleService.changeOrganizationAdmin(organizationId, userToTurnAdminId);
        });
    }

    private RoleEntity buildRoleEntity(Role role) {
        RoleEntity roleEntity = new RoleEntity();
        roleEntity.setRole(role);
        return roleEntity;
    }

    private OrganizationUserRoleEntity buildOrganizationUserRoleEntity(Long organizationId, UserEntity user, RoleEntity roleEntity) {
        OrganizationUserRoleEntity organizationUserRoleEntity = new OrganizationUserRoleEntity();
        OrganizationUserRoleEntityPK id =
            new OrganizationUserRoleEntityPK(user.getId(), roleEntity.getId(), organizationId);
        organizationUserRoleEntity.setId(id);
        organizationUserRoleEntity.setRoleEntity(roleEntity);
        organizationUserRoleEntity.setUserEntity(user);
        organizationUserRoleEntity.setActive(true);
        return organizationUserRoleEntity;
    }

}
