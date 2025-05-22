package com.itechart.foxhunt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class WrongCompetitionStatusException extends RuntimeException {
    public WrongCompetitionStatusException() {
    }

    public WrongCompetitionStatusException(String message) {
        super(message);
    }

    public WrongCompetitionStatusException(String message, Throwable cause) {
        super(message, cause);
    }

    public WrongCompetitionStatusException(Throwable cause) {
        super(cause);
    }
}
