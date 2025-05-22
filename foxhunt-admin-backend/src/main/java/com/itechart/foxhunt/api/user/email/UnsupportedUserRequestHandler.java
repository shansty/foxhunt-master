package com.itechart.foxhunt.api.user.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

@Component
@Slf4j
public class UnsupportedUserRequestHandler<I, O> extends UserRequestHandler<I, O> {

    public UnsupportedUserRequestHandler(TransactionTemplate transactionTemplate) {
        super(transactionTemplate);
    }

    @Override
    protected void validateRequest(I request) {
        log.error("Received unsupported user request");
        throw new IllegalArgumentException("Unsupported user request");
    }

    @Override
    protected O createRequest(I request) {
        return null;
    }

    @Override
    protected void processRequest(O response) {
    }
}
