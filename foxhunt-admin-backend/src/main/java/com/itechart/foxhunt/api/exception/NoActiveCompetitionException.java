package com.itechart.foxhunt.api.exception;

public class NoActiveCompetitionException  extends RuntimeException {
    private static final String  DEFAULT_MSG = "No active competition";

    public NoActiveCompetitionException() {
        super( DEFAULT_MSG);
    }

    public NoActiveCompetitionException(String message) {
        super(message);
    }

    public NoActiveCompetitionException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoActiveCompetitionException(Throwable cause) {
        super(cause);
    }
}
