package com.itechart.foxhunt.api.exception;

public class ExternalAuthenticationException extends RuntimeException {
    public ExternalAuthenticationException() {
    }

    public ExternalAuthenticationException(String message) {
        super(message);
    }

    public ExternalAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }

    public ExternalAuthenticationException(Throwable cause) {
        super(cause);
    }
}
