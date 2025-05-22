package com.itechart.foxhunt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class NoSuitableRoleException extends RuntimeException {

    public NoSuitableRoleException() {
    }

    public NoSuitableRoleException(String message) {
        super(message);
    }

    public NoSuitableRoleException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoSuitableRoleException(Throwable cause) {
        super(cause);
    }
}
