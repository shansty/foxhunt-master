package com.itechart.foxhunt.api.auth;

import com.itechart.foxhunt.api.auth.security.AuthenticationInfo;
import com.itechart.foxhunt.api.auth.security.AuthorizationService;
import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.organization.ChangeOrganizationRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = ApiConstants.LOGIN, produces = MediaType.APPLICATION_JSON_VALUE)
@Validated
@Slf4j
public class LoginController {

    private final AuthorizationService authorizationService;

    private final LoggedUserService loggedUserService;

    @PostMapping(ApiConstants.AUTHENTICATE)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Authentication payload was received"),
        @ApiResponse(responseCode = "401", description = "Bad credentials")
    })
    @Operation(summary = "Returns authentication claims by email and password", description = "Get token by email and password")
    public ResponseEntity<AuthenticationInfo> authenticate(
        @RequestBody @Valid AuthenticationRequest authenticationRequest) {
        log.debug("Received authentication request from User with EMAIL: {}", authenticationRequest.getEmail());
        AuthenticationInfo authenticationInfo = authorizationService.validateAuthenticationRequest(authenticationRequest);
        return ResponseEntity.ok(authenticationInfo);
    }

    @PostMapping(ApiConstants.AUTHENTICATE_SYSTEM)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "System admin authentication payload was received"),
        @ApiResponse(responseCode = "401", description = "Bad credentials")
    })
    @Operation(summary = "Returns system admin authentication claims by email and password")
    public ResponseEntity<AuthenticationInfo> authenticateSystemAdmin(@RequestBody @Valid SystemAdminAuthenticationRequest request) {
        log.debug("Received authentication request from System Admin with EMAIL: {}", request.getEmail());
        AuthenticationInfo authenticationInfo = authorizationService.validateSystemAdminAuthenticationRequest(request);
        return ResponseEntity.ok(authenticationInfo);
    }

    @PutMapping(ApiConstants.CHANGE_ORGANIZATION)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Organization has been changed"),
        @ApiResponse(responseCode = "400", description = "Bad change organization request")
    })
    @Operation(summary = "Returns authentication claims with changed organization")
    public ResponseEntity<AuthenticationInfo> changeOrganization(@RequestBody ChangeOrganizationRequest changeRequest) {
        String loggedUserEmail = loggedUserService.getLoggedUserEmail();
        log.info("Received request from User with EMAIL {} to change current organization to Organization with DOMAIN {}",
            loggedUserEmail, changeRequest.getDomain());
        AuthenticationInfo authenticationInfo = authorizationService.changeOrganization(changeRequest, loggedUserEmail);
        return ResponseEntity.ok(authenticationInfo);
    }

    @PostMapping(ApiConstants.AUTHENTICATE_GOOGLE)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Authentication payload was received"),
        @ApiResponse(responseCode = "401", description = "Bad credentials")
    })
    @Operation(summary = "Returns authentication claims by google email")
    public ResponseEntity<AuthenticationInfo> authenticateGoogle(@RequestBody @Valid GoogleAuthenticationRequest authenticationRequest) {
        log.info("Received google authentication request from User with EMAIL: {}", authenticationRequest.getEmail());
        AuthenticationInfo authenticationInfo = authorizationService.handleGoogleAuthenticationRequest(authenticationRequest);
        return ResponseEntity.ok(authenticationInfo);
    }

}
