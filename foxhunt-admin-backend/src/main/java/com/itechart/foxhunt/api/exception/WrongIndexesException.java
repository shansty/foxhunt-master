package com.itechart.foxhunt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class WrongIndexesException extends RuntimeException {
    public WrongIndexesException() {
    }

    public WrongIndexesException(String message) {
        super(message);
    }

    public WrongIndexesException(String message, Throwable cause) {
        super(message, cause);
    }

    public WrongIndexesException(Throwable cause) {
        super(cause);
    }
}
