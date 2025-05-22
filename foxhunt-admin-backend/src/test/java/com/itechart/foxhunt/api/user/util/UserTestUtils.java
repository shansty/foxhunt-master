package com.itechart.foxhunt.api.user.util;

import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.user.dto.RegistrationUserInfo;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.enums.OrganizationStatus;
import com.itechart.foxhunt.domain.enums.OrganizationType;

import java.time.LocalDateTime;
import java.util.Set;

import static com.itechart.foxhunt.api.TestDataKeeper.USER_ID;

public class UserTestUtils {

    public static User getUser() {
        User userToTest = new User();

        userToTest.setId(USER_ID);
        userToTest.setFirstName("Default First Name");
        userToTest.setLastName("Default Last Name");
        userToTest.setDateOfBirth(LocalDateTime.of(1987, 5, 22, 16, 8));
        userToTest.setCountry("Default Country");
        userToTest.setCity("Default City");
        userToTest.setEmail("defaultemail@gmail.com");

        return userToTest;
    }

    public static User getActivatedUser() {
        User userToTest = getUser();
        userToTest.setActivated(true);
        userToTest.setActivatedSince(LocalDateTime.now());

        return userToTest;
    }

    public static UserEntity getUserEntity() {
        UserEntity user = new UserEntity();
        user.setId(USER_ID);
        user.setFirstName("Default First Name");
        user.setLastName("Default Last Name");
        user.setDateOfBirth(LocalDateTime.of(1987, 5, 22, 16, 8));
        user.setCountry("Default Country");
        user.setCity("Default City");
        user.setEmail("defaultemail@gmail.com");
        user.setActivated(true);
        user.setActivatedSince(LocalDateTime.now());
        return user;
    }

    public static RegistrationUserInfo getRegistrationUserInfo() {
        RegistrationUserInfo registrationUserInfo = new RegistrationUserInfo();

        registrationUserInfo.setEmail("defaultemal@gmail.com");
        registrationUserInfo.setFirstName("First Name");
        registrationUserInfo.setLastName("Last Name");
        registrationUserInfo.setCountry("Country Name");
        registrationUserInfo.setCity("City Name");
        registrationUserInfo.setPassword("Encoded Password");

        return registrationUserInfo;
    }

    public static Organization createUserOrganization() {
        Organization organization = new Organization();

        organization.setId(1L);
        organization.setName("Radio School");
        organization.setLegalAddress("ul. Pravdy 5");
        organization.setActualAddress("ul. Pravdy 5");
        organization.setApproximateEmployeesNumber(11);
        organization.setStatus(OrganizationStatus.ACTIVE);
        organization.setType(OrganizationType.FREE);
        organization.setSystem(false);
        organization.setFavoriteLocations(Set.of());

        return organization;
    }

    public static UserInvitationEntity buildUserInvitationEntity(Long organizationId, UserEntity user) {
        UserInvitationEntity userInvitationEntity = new UserInvitationEntity();
        userInvitationEntity.setOrganizationId(organizationId);
        userInvitationEntity.setUserEntity(user);
        return userInvitationEntity;
    }

}
