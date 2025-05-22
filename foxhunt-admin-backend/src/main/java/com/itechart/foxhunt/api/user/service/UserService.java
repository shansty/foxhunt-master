package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.user.dto.ChangePasswordRequest;
import com.itechart.foxhunt.api.user.dto.GetUsersRequest;
import com.itechart.foxhunt.api.user.dto.RegistrationUserInfo;
import com.itechart.foxhunt.api.user.dto.SystemAdmin;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.UserEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

//TODO Is it really one interface? If so, what its Single responsibility is?
public interface UserService {

    List<User> getAll(Long organizationId, GetUsersRequest request, Pageable pageable);

    List<User> getAllByIds(List<Long> ids);

    List<User> findAll(Pageable pageable);

    long countAll(Long organizationId);

    User findById(Long id, Long organizationId);

    User findActiveUserInOrganization(String email, Long organizationId);

    User findInactiveUserByEmail(String email);

    UserEntity getOne(Long id);

    User getByEmail(String email);

    User findByEmail(String email);

    Long getIdByEmail(String email);

    Set<User> findByEmails(Set<String> emails);

    User create(User newUser);

    User getOrCreateIfNotExists(User user);

    User setRegistrationUserInfo(RegistrationUserInfo userInfo);

    User setPassword(User userDto);

    User changePassword(User user, ChangePasswordRequest request);

    User resetPassword(User user, String token);

    void deactivate(User initiatedUser, Long deactivatedUserId, Long organizationId);

    User update(User updatedUser, Long organizationId, User loggedUser);

    User activate(User newUser);

    boolean existsByEmailAndActive(String email);

    User findAdminByOrganizationId(Long id);

    SystemAdmin findSystemAdminByEmail(String email);

    void manageBanStatus(Long userId);

}
