package com.itechart.foxhunt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class WrongFoxAmountException extends RuntimeException {
    private static final String  DEFAULT_MSG = "The number of fox points in request does not match quantity in competition";

    public WrongFoxAmountException() {
        super(DEFAULT_MSG);
    }

    public WrongFoxAmountException(String message) {
        super(message);
    }

    public WrongFoxAmountException(String message, Throwable cause) {
        super(message, cause);
    }

    public WrongFoxAmountException(Throwable cause) {
        super(cause);
    }
}
