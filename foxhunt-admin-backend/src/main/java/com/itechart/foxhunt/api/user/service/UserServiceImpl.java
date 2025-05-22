package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.ResetPasswordRequestStatus;
import com.itechart.foxhunt.api.user.dao.OrganizationUserActiveHistoryRepository;
import com.itechart.foxhunt.api.user.dao.OrganizationUserRoleRepository;
import com.itechart.foxhunt.api.user.dao.ResetPasswordRequestRepository;
import com.itechart.foxhunt.api.user.dao.SystemAdminRepository;
import com.itechart.foxhunt.api.user.dao.UserInvitationRepository;
import com.itechart.foxhunt.api.user.dao.UserRepository;
import com.itechart.foxhunt.api.user.dto.ChangePasswordRequest;
import com.itechart.foxhunt.api.user.email.EmailHandler;
import com.itechart.foxhunt.api.user.email.EmailTemplateRepository;
import com.itechart.foxhunt.api.user.email.role.ChangingRoleInfoKeeper;
import com.itechart.foxhunt.api.user.dto.GetUsersRequest;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleProjection;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.api.user.dto.RegistrationUserInfo;
import com.itechart.foxhunt.api.user.dto.SystemAdmin;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.dto.UserProjection;
import com.itechart.foxhunt.api.user.entity.SystemAdminEntity;
import com.itechart.foxhunt.api.user.mapper.OrganizationUserRoleMapper;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.service.validator.UserValidator;
import com.itechart.foxhunt.domain.entity.EmailTemplateEntity;
import com.itechart.foxhunt.domain.entity.OrganizationUserActiveHistoryEntity;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.enums.OrganizationStatus;
import com.itechart.foxhunt.domain.enums.Role;
import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import com.itechart.foxhunt.domain.utils.TemplateConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    private final SystemAdminRepository systemAdminRepository;

    private final UserRepository userRepository;

    private final OrganizationService organizationService;

    private final OrganizationUserRoleService organizationUserRoleService;

    private final OrganizationUserRoleRepository organizationUserRoleRepository;

    private final OrganizationUserRoleMapper organizationUserRoleMapper;

    private final OrganizationUserActiveHistoryRepository organizationUserActiveHistoryRepository;

    private final PasswordEncoder passwordEncoder;

    private final ResetPasswordRequestRepository resetPasswordRequestRepository;

    private final EmailHandler<ChangingRoleInfoKeeper> emailHandler;

    private final EmailTemplateRepository emailTemplateRepository;

    private final UserValidator userValidator;

    private final UserInvitationRepository userInvitationRepository;

    @Override
    public List<User> getAll(Long organizationId, GetUsersRequest request, Pageable pageable) {
        log.info("Try get all users for organization with id: {}", organizationId);
        List<UserProjection> users = userRepository
            .findAllByOrganizationId(organizationId, request.getRoles(), request.getIsActive(), pageable);
        List<Long> userIds = users.stream().map(UserProjection::getId).collect(toList());

        Map<Long, Set<OrganizationUserRoleProjection>> userRoles = organizationUserRoleRepository
            .findAllByOrganizationAndUsersAndRoles(organizationId, userIds, request.getRoles())
            .stream().collect(
                groupingBy(OrganizationUserRoleProjection::getUserId,
                    mapping(userRoleProjection -> userRoleProjection, toSet()))
            );

        return users.stream()
            .map(userMapper::projectionToDomain)
            .peek(user -> {
                Set<OrganizationUserRoleProjection> rolesProjections = userRoles.get(user.getId());
                boolean isUserActiveInOrganization = rolesProjections.stream().allMatch(role -> role.getIsActive());
                user.setActivated(isUserActiveInOrganization);

                Set<OrganizationUserRoleShortDto> roles = rolesProjections.stream()
                    .map(organizationUserRoleMapper::projectionToShortDto)
                    .collect(toSet());
                user.setRoles(roles);
            }).collect(toList());
    }

    @Override
    public List<User> getAllByIds(List<Long> userIds) {
        log.info("Fetching users by ids:  {}", userIds);
        return userRepository.findAllById(userIds)
            .stream()
            .map(userMapper::entityToDomain).toList();
    }

    @Override
    public List<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).stream()
            .map(userMapper::entityToDomain)
            .toList();
    }

    @Override
    public long countAll(Long organizationId) {
        return userRepository.countAllByOrganizationId(organizationId);
    }

    @Override
    public User findById(Long id, Long organizationId) {
        UserEntity userEntity = findUserById(id, organizationId);
        return prepareUser(userEntity, organizationId);
    }

    @Override
    public UserEntity getOne(Long id) {
        return userRepository.getById(id);
    }

    @Override
    public User getByEmail(String email) {
        UserEntity fetchedUser = userRepository.findByEmail(email).orElse(null);
        return userMapper.entityToDomain(fetchedUser);
    }

    @Override
    public User create(User newUser) {
        UserEntity userToSave = userMapper.domainToEntity(newUser);
        UserEntity savedUser = userRepository.save(Objects.requireNonNull(userToSave));
        return userMapper.entityToDomain(savedUser);
    }

    @Override
    public User getOrCreateIfNotExists(User user) {
        String email = user.getEmail();
        User fetchedUser = getByEmail(email);
        if (fetchedUser == null) {
            log.info("User with EMAIL: {} doesn't exist, try create it", email);
            return create(user);
        } else {
            log.info("User with EMAIL: {} already exists", email);
            return fetchedUser;
        }
    }

    @Override
    public User findByEmail(String email) {
        UserEntity fetchedUser = findUserByEmail(email);
        return userMapper.entityToDomain(fetchedUser);
    }

    @Override
    public Long getIdByEmail(String email) {
        return userRepository.findIdByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException(String.format("User with email %s not found", email)));
    }

    @Override
    public Set<User> findByEmails(Set<String> emails) {
        Set<User> users = new HashSet<>();
        userRepository.findByEmailIn(emails).forEach(userEntity -> users.add(userMapper.entityToDomain(userEntity)));
        return users;
    }

    @Override
    public User findInactiveUserByEmail(String email) {
        UserEntity fetchedUser = userRepository.findByEmailAndIsActivated(email, false)
            .orElseThrow(() -> new EntityNotFoundException(String.format("User with EMAIL: %s not found", email)));
        return userMapper.entityToDomain(fetchedUser);
    }

    private UserEntity findUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> {
                log.error("No user in DB with email: {}", email);
                throw new EntityNotFoundException(
                    String.format("No user in DB with email = %s", email));
            });
    }

    @Override
    public User findActiveUserInOrganization(String email, Long organizationId) {
        log.info("Try to findActiveUserInOrganization in UserDerviceImpl", email, " ", organizationId)
        UserEntity userEntity = userRepository.findActiveByEmailAndOrganizationId(email, organizationId)
            .orElseThrow(() -> new EntityNotFoundException(
                String.format("User with EMAIL: %s not found in Organization: %s", email, organizationId)));
        List<OrganizationUserRoleEntity> orgUserRoles = organizationUserRoleRepository.findAllByUserId(userEntity.getId());
        User activeUser = userMapper.entityToDomain(userEntity);
        activeUser.setRoles(retrieveUserRoles(orgUserRoles, organizationId));
        activeUser.setManageMultipleOrganizations(isManageMultipleOrganizations(orgUserRoles, organizationId));
        return activeUser;
    }

    private Set<OrganizationUserRoleShortDto> retrieveUserRoles(List<OrganizationUserRoleEntity> organizationUserRoles,
                                                                Long organizationId) {
        return organizationUserRoles.stream()
            .filter(orgUserRole -> organizationId.equals(orgUserRole.getId().getOrganizationId()))
            .map(organizationUserRoleMapper::entityToShortDto)
            .sorted(Comparator.comparing(shortDto -> shortDto.getRole().ordinal()))
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private boolean isManageMultipleOrganizations(List<OrganizationUserRoleEntity> organizationUserRoles,
                                                  Long organizationId) {
        return !organizationUserRoles.stream()
            .filter(orgUserRole -> orgUserRole.isActive() &&
                !organizationId.equals(orgUserRole.getId().getOrganizationId()) &&
                !Role.PARTICIPANT.equals(orgUserRole.getRoleEntity().getRole()))
            .collect(Collectors.toSet())
            .isEmpty();
    }

    private Set<OrganizationUserRoleShortDto> getUserRolesInOrganization(Long organizationId, Long userId) {
        return organizationUserRoleService
            .findAllByOrganizationIdAndUserId(organizationId, userId)
            .stream().map(organizationUserRoleMapper::entityToShortDto)
            .sorted(Comparator.comparing(role -> role.getRole().ordinal()))
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @Override
    @Transactional
    public User setRegistrationUserInfo(RegistrationUserInfo userInfo) {
        UserEntity userToUpdate = findUserByEmail(userInfo.getEmail());
        log.info("Validating set registration user information request...");
        validateSetRegistrationUserInfoRequest(userToUpdate);

        UserEntity userWithUpdatedFields = userMapper.mergeDomainToEntity(userToUpdate, userInfo);
        userWithUpdatedFields.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        userWithUpdatedFields.setActivated(true);
        userWithUpdatedFields.setActivatedSince(LocalDateTime.now());
        UserEntity savedUser = userRepository.save(userWithUpdatedFields);

        User registeredUser = userMapper.entityToDomain(savedUser);
        Set<OrganizationUserRoleShortDto> userRoles = organizationUserRoleRepository
            .findAllByUserId(registeredUser.getId()).stream()
            .map(organizationUserRoleMapper::entityToShortDto)
            .collect(toSet());
        registeredUser.setRoles(userRoles);

        Long organizationId = organizationService.getOrganizationIdByDomain(userInfo.getDomain());
        organizationService.updateInitialStatus(organizationId, registeredUser, OrganizationStatus.ACTIVE);
        return registeredUser;
    }

    private void validateSetRegistrationUserInfoRequest(UserEntity userEntity) {
        if (userEntity.getPassword() != null) {
            log.error("Registration information for User with EMAIL: {} already set", userEntity.getEmail());
            throw new IllegalArgumentException(
                String.format("Registration information for User with EMAIL: %s already set", userEntity.getEmail()));
        }
    }

    @Override
    public User setPassword(User userDto) {
        UserEntity userEntity = findUserByEmail(userDto.getEmail());
        userEntity.setPassword(userDto.getPassword());
        userEntity = userRepository.save(userEntity);
        log.info("Password for user: {} was set", userEntity.getEmail());
        return userMapper.entityToDomain(userEntity);
    }

    @Override
    public User changePassword(User user, ChangePasswordRequest request) {
        log.info("Received request to change password from user with ID {}.", user.getId());

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Provided old password is invalid");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        return setPassword(user);
    }

    @Override
    public User resetPassword(User user, String token) {
        log.info("Updating password for user with email {}", user.getEmail());
        checkResetPasswordRequestExistence(token, user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return setPassword(user);
    }

    @Override
    public boolean existsByEmailAndActive(String email) {
        return userRepository.existsByEmailAndIsActivated(email, true);
    }

    @Override
    @Transactional
    public void deactivate(User initiatedUser, Long deactivatedUserId, Long organizationId) {
        UserEntity deactivatedUser = findUserById(deactivatedUserId, organizationId);

        log.warn(String.format("Validation accessibility to deactivate user with id=%s and email=%s.",
            deactivatedUser.getId(), deactivatedUser.getEmail()));
        userValidator.validateUpdatingActiveStatus(initiatedUser, userMapper.entityToDomain(deactivatedUser));

        organizationUserRoleService.deactivateAllRoles(organizationId, deactivatedUser.getId());

        //TODO What exactly that table stores? Should we store all the changes of the status? If so, can it be done on the DB level?
        createOrganizationUserActivationHistory(organizationId, deactivatedUser, false);
    }

    @Override
    public User activate(User user) {
        UserEntity userToActivate = findUserByEmail(user.getEmail());
        validateInitialActivation(userToActivate);
        userToActivate.setActivated(true);
        userToActivate.setActivatedSince(LocalDateTime.now());
        UserEntity updatedUser = updateUser(userToActivate, user);
        return userMapper.entityToDomain(updatedUser);
    }

    private void validateInitialActivation(UserEntity userToActivate) {
        if (userToActivate.getActivatedSince() != null) {
            throw new IllegalArgumentException(
                String.format("User with EMAIL: %s already activated", userToActivate.getEmail()));
        }
    }

    @Override
    @Transactional
    public User update(User updatedUserRequest, Long organizationId, User loggedUser) {
        Long loggedUserId = loggedUser.getId();
        Long updatedUserRequestId = updatedUserRequest.getId();
        UserEntity userEntityToChange = findUserById(updatedUserRequestId, organizationId);
        User userToChange = prepareUser(userEntityToChange, organizationId);
        boolean isActive = userToChange.isActivated();
        Set<Role> oldRoles = userToChange.getRoles().stream().map(OrganizationUserRoleShortDto::getRole).collect(toSet());
        Set<Role> updatedUserRoles = updatedUserRequest.getRoles().stream().map(OrganizationUserRoleShortDto::getRole).collect(toSet());
        boolean rolesChanged = !oldRoles.equals(updatedUserRoles);

        boolean isSelfUpdate = loggedUserId.equals(updatedUserRequestId);
        if (!isSelfUpdate) {
            log.warn(String.format("Validation accessibility to change roles of user with id=%s and email=%s.",
                userToChange.getId(), userToChange.getEmail()));
            userValidator.validatePermissionsToUpdateOtherUsers(loggedUser, userToChange);
            userValidator.validatePermissionsToUpdateOtherUsers(loggedUser, updatedUserRequest);
        } else if (rolesChanged) {
            String msg = "User cannot change roles for himself.";
            log.warn(msg);
            throw new AccessDeniedException(msg);
        }

        if (rolesChanged) {
            organizationUserRoleService.deleteAllRoles(organizationId, updatedUserRequestId);
            organizationUserRoleService.addUsersToOrganization(organizationId, Set.of(updatedUserRequest), updatedUserRoles);
            organizationUserRoleService.updateActiveStatus(organizationId, updatedUserRequestId, isActive);
        }
        UserEntity userEntityResult = updateUser(userEntityToChange, updatedUserRequest);
        log.info("User with id {} was updated by user with id {}", updatedUserRequestId, loggedUserId);

        User userResult = prepareUser(userEntityResult, organizationId);

        if (rolesChanged) {
            sendEmailAboutChangedRoles(organizationId, userResult, oldRoles);
        }

        return userResult;
    }

    private User prepareUser(UserEntity userEntity, Long organizationId) {
        User userToReturn = userMapper.entityToDomain(userEntity);
        Set<OrganizationUserRoleShortDto> userRoles = getUserRolesInOrganization(organizationId, userEntity.getId());
        boolean isUserActiveInOrganization = userRoles.stream().allMatch(OrganizationUserRoleShortDto::getIsActive);
        userToReturn.setRoles(userRoles);
        userToReturn.setActivated(isUserActiveInOrganization && userToReturn.isActivated());
        return userToReturn;
    }

    private void sendEmailAboutChangedRoles(Long organizationId, User user, Set<Role> oldRoles) {
        EmailTemplateEntity emailTemplate = emailTemplateRepository.findByName(TemplateConstants.ROLE_CHANGED_TEMPLATE);
        ChangingRoleInfoKeeper changingRoleInfoKeeper = ChangingRoleInfoKeeper.builder()
            .organization(organizationService.findOrganizationById(organizationId))
            .oldRoles(oldRoles)
            .updatedRoles(user.getRoles().stream().map(OrganizationUserRoleShortDto::getRole).collect(toSet()))
            .user(user)
            .emailTemplateEntity(emailTemplate)
            .build();
        emailHandler.processMessage(changingRoleInfoKeeper);
    }

    private void createOrganizationUserActivationHistory(Long organizationId, UserEntity user, boolean isActive) {
        OrganizationUserActiveHistoryEntity organizationUserActiveHistory = new OrganizationUserActiveHistoryEntity();
        organizationUserActiveHistory.setOrganizationId(organizationId);
        organizationUserActiveHistory.setUser(user);
        organizationUserActiveHistory.setActive(isActive);
        organizationUserActiveHistory.setDate(LocalDateTime.now());
        //TODO rename table and repository
        organizationUserActiveHistoryRepository.save(organizationUserActiveHistory);
    }

    private UserEntity findUserById(Long userId, Long organizationId) {
        return userRepository.findByIdAndOrganizationId(userId, organizationId)
            .orElseThrow(() -> {
                log.error("Unable to find user with id {} in organization {}", userId, organizationId);
                throw new EntityNotFoundException("Unable to find user with id " + userId);
            });
    }

    public User findAdminByOrganizationId(Long organizationId) {
        UserEntity userEntity = userRepository.findByRoleNameAndOrganizationId(Role.ORGANIZATION_ADMIN.name(), organizationId)
            .orElseThrow(() -> {
                log.error("Unable to find organization admin for organizationId {}", organizationId);
                throw new EntityNotFoundException("Unable to find organization admin for organizationId " + organizationId);
            });

        return userMapper.entityToDomain(userEntity);
    }

    @Override
    public SystemAdmin findSystemAdminByEmail(String email) {
        SystemAdminEntity systemAdminEntity = systemAdminRepository.findByEmail(email)
            .orElseThrow(() -> {
                log.error("Unable to find system admin with email {}", email);
                throw new EntityNotFoundException("Unable to find system admin with email " + email);
            });
        return userMapper.entityToDomain(systemAdminEntity);
    }

    @Override
    public void manageBanStatus(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
            .orElseThrow(() -> {
                String errorMessage = String.format("Unable to find user with id=%s", userId);
                log.error(errorMessage);
                throw new EntityNotFoundException(errorMessage);
            });

        boolean isBanned = !userEntity.isBanned();
        userEntity.setBanned(isBanned);
        userEntity.setActivated(!isBanned && nonNull(userEntity.getActivatedSince()));
        userRepository.save(userEntity);

        if (userEntity.isBanned()) {
            organizationUserRoleService.deleteAllRoles(userId);
            declineUserInvitations(userEntity);
        }
    }

    private void declineUserInvitations(UserEntity user) {
        Set<UserInvitationEntity> invitations =
            userInvitationRepository.findByUserEntityAndStatus(user, UserInvitationStatus.NEW);
        invitations.forEach(invitation -> {
            invitation.setStatus(UserInvitationStatus.DECLINED);
            invitation.setDeclinationReason("User was banned");
        });
        userInvitationRepository.saveAll(invitations);
    }

    private UserEntity updateUser(UserEntity userForUpdate, User updatedUser) {
        userForUpdate.setFirstName(updatedUser.getFirstName());
        userForUpdate.setLastName(updatedUser.getLastName());
        userForUpdate.setCountry(updatedUser.getCountry());
        userForUpdate.setCity(updatedUser.getCity());
        userForUpdate.setDateOfBirth(updatedUser.getDateOfBirth());
        userForUpdate.setAvatar(updatedUser.getAvatar());

        return userRepository.save(userForUpdate);
    }

    private void checkResetPasswordRequestExistence(String token, String email) {
        log.debug("Validating update password request with token {} for user with email {}", token, email);
        resetPasswordRequestRepository.findByTokenAndStatus(token, ResetPasswordRequestStatus.ACCEPTED)
            .orElseThrow(() -> {
                log.warn("Reset password request with token {} for user with email {} not found", token, email);
                throw new IllegalArgumentException(String.format("Reset password request with token %s not found", token));
            });
    }

}
