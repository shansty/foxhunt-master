package com.itechart.foxhunt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class WrongStartDateException extends RuntimeException {
    public WrongStartDateException() {
    }

    public WrongStartDateException(String message) {
        super(message);
    }

    public WrongStartDateException(String message, Throwable cause) {
        super(message, cause);
    }

    public WrongStartDateException(Throwable cause) {
        super(cause);
    }
}
