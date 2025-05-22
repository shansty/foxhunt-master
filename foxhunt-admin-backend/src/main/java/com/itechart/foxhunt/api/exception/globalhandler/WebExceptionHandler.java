package com.itechart.foxhunt.api.exception.globalhandler;

import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.exception.CompetitionException;
import com.itechart.foxhunt.api.exception.ExternalAuthenticationException;
import com.itechart.foxhunt.api.exception.InternalServerErrorException;
import com.itechart.foxhunt.api.exception.NoActiveCompetitionException;
import com.itechart.foxhunt.api.exception.NoSuitableRoleException;
import com.itechart.foxhunt.api.exception.UserNotFoundException;
import com.itechart.foxhunt.api.exception.UserNotRegisteredException;
import com.itechart.foxhunt.api.exception.WrongCoachException;
import com.itechart.foxhunt.api.exception.WrongCompetitionStatusException;
import com.itechart.foxhunt.api.exception.WrongFoxAmountException;
import com.itechart.foxhunt.api.exception.WrongIndexesException;
import com.itechart.foxhunt.api.exception.WrongPointException;
import com.itechart.foxhunt.api.exception.WrongStartDateException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityNotFoundException;
import javax.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class WebExceptionHandler {

    public static final String ERROR_MESSAGE = "Error has occurred";

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse("Bad request",
            LocalDateTime.now(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationServiceException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(Exception ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse("api call not allowed for user with this role ",
            LocalDateTime.now(), HttpStatus.UNAUTHORIZED.value());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(Exception ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage(), LocalDateTime.now(), HttpStatus.FORBIDDEN.value());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({WrongIndexesException.class, UnsupportedOperationException.class})
    public ResponseEntity<ErrorResponse> handleCustomExceptions(Exception ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse(ex.getLocalizedMessage(),
            LocalDateTime.now(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ExternalAuthenticationException.class})
    public ResponseEntity<ErrorResponse> handleTokenExceptions(Exception ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse(ex.getLocalizedMessage(),
            LocalDateTime.now(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({EntityNotFoundException.class, UsernameNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleNotFoundExceptions(Exception ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse(ex.getMessage(),
            LocalDateTime.now(), HttpStatus.NOT_FOUND.value());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<ErrorResponse> handleNotFoundExceptions(IllegalArgumentException ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse(ex.getMessage(),
            LocalDateTime.now(), HttpStatus.CONFLICT.value());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({NullPointerException.class})
    public ResponseEntity<ErrorResponse> handleNullPointerExceptions(NullPointerException ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse("Interval server error. Please try again later.",
            LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse(
            Objects.requireNonNull(ex.getBindingResult().getFieldError()).getDefaultMessage(),
            LocalDateTime.now(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({WrongCompetitionStatusException.class, WrongStartDateException.class})
    public ResponseEntity<ErrorResponse> handleConflictCompetitionStatusExceptions(RuntimeException ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse(
            ex.getLocalizedMessage(),
            LocalDateTime.now(), HttpStatus.CONFLICT.value());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationExceptions(DataIntegrityViolationException ex) {
        log.error(ERROR_MESSAGE, ex);
        String nonConstraintViolationMessage = "Something wen wrong. Please try again later.";

        String errorMessage = ex.getCause() instanceof ConstraintViolationException cause ?
            buildViolationMessage(cause) : nonConstraintViolationMessage;

        ErrorResponse error = new ErrorResponse(errorMessage,
            LocalDateTime.now(), HttpStatus.CONFLICT.value());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    private String buildViolationMessage(ConstraintViolationException ex) {
        return ex.getConstraintViolations().stream().map(violation -> {
            String violatedProperty = violation.getPropertyPath().toString();
            String violationMessage = violation.getMessage();
            return String.format("%s with name %s", violatedProperty, violationMessage);
        }).collect(Collectors.joining("\n"));
    }

    @ExceptionHandler(NoSuitableRoleException.class)
    public ResponseEntity<ErrorResponse> handleRoleExceptions(NoSuitableRoleException ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse(
            ex.getLocalizedMessage(),
            LocalDateTime.now(), HttpStatus.CONFLICT.value());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundExceptions(UserNotFoundException ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse(
            ex.getLocalizedMessage(),
            LocalDateTime.now(), HttpStatus.CONFLICT.value());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NoActiveCompetitionException.class)
    public ResponseEntity<ErrorResponse> handleCompetitionNotFound(NoActiveCompetitionException ex) {

        return handleDefaultBadRequest(ex);
    }

    @ExceptionHandler(WrongCoachException.class)
    public ResponseEntity<ErrorResponse> handleWrongCoachException(WrongCoachException ex) {

        return handleDefaultBadRequest(ex);
    }

    @ExceptionHandler(WrongPointException.class)
    public ResponseEntity<ErrorResponse> handleWrongPointException(WrongPointException ex) {

        return handleDefaultBadRequest(ex);
    }

    @ExceptionHandler(WrongFoxAmountException.class)
    public ResponseEntity<ErrorResponse> handleWrongFoxAmountException(WrongFoxAmountException ex) {

        return handleDefaultBadRequest(ex);
    }

    @ExceptionHandler(CompetitionException.class)
    public ResponseEntity<ErrorResponse> handleCompetitionException(CompetitionException ex) {

        return handleDefaultBadRequest(ex);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex) {
        return handleDefaultBadRequest(ex);
    }

    @ExceptionHandler(InternalServerErrorException.class)
    public ResponseEntity<ErrorResponse> handleInternalServerError(InternalServerErrorException ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = new ErrorResponse(
            ex.getLocalizedMessage(),
            LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handlerResponseStatusException(ResponseStatusException ex) {
        log.error(ERROR_MESSAGE, ex);
        ErrorResponse error = ErrorResponse.builder()
            .message(ex.getReason())
            .timestamp(LocalDateTime.now())
            .status(ex.getRawStatusCode())
            .build();
        return new ResponseEntity<>(error, ex.getStatus());
    }

    @ExceptionHandler(UserNotRegisteredException.class)
    public ResponseEntity<ErrorResponse> handleUserNotRegisteredException(UserNotRegisteredException ex) {
        return handleDefaultBadRequest(ex);
    }

    private ResponseEntity<ErrorResponse> handleDefaultBadRequest(RuntimeException ex) {
        log.error(ERROR_MESSAGE, ex.getMessage());
        ErrorResponse error = new ErrorResponse(ex.getLocalizedMessage(),
            LocalDateTime.now(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
