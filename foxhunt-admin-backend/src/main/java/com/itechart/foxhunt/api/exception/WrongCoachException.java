package com.itechart.foxhunt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class WrongCoachException extends RuntimeException {


    public WrongCoachException() {
    }

    public WrongCoachException(String message) {
        super(message);
    }

    public WrongCoachException(String message, Throwable cause) {
        super(message, cause);
    }

    public WrongCoachException(Throwable cause) {
        super(cause);
    }
}
