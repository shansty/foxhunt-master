package com.itechart.foxhunt.api.user.email;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.support.TransactionTemplate;

@RequiredArgsConstructor
public abstract class UserRequestHandler<I, O> {

    protected final TransactionTemplate transactionTemplate;

    public O handleRequest(I request) {
        validateRequest(request);
        O createdRequest = transactionTemplate.execute(status -> createRequest(request));
        processRequest(createdRequest);
        return createdRequest;
    }

    protected void validateRequest(I request) {}

    protected abstract O createRequest(I request);

    protected abstract void processRequest(O response);

}
