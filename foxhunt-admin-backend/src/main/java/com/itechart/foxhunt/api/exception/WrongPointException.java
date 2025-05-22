package com.itechart.foxhunt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class WrongPointException extends RuntimeException {
    private static final String  DEFAULT_MSG = "Location does not contain one of the points";

    public WrongPointException() {
        super(DEFAULT_MSG);
    }

    public WrongPointException(String message) {
        super(message);
    }

    public WrongPointException(String message, Throwable cause) {
        super(message, cause);
    }

    public WrongPointException(Throwable cause) {
        super(cause);
    }
}
