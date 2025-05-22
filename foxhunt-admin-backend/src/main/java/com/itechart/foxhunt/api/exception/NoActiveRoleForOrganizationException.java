package com.itechart.foxhunt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED)
public class NoActiveRoleForOrganizationException extends RuntimeException {

    public NoActiveRoleForOrganizationException() {
    }

    public NoActiveRoleForOrganizationException(String message) {
        super(message);
    }

    public NoActiveRoleForOrganizationException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoActiveRoleForOrganizationException(Throwable cause) {
        super(cause);
    }
}
