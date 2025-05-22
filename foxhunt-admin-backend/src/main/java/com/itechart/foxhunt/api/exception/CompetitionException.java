package com.itechart.foxhunt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class CompetitionException  extends RuntimeException {

    public CompetitionException() {
    }

    public CompetitionException(String message) {
        super(message);
    }

    public CompetitionException(String message, Throwable cause) {
        super(message, cause);
    }

    public CompetitionException(Throwable cause) {
        super(cause);
    }
}
