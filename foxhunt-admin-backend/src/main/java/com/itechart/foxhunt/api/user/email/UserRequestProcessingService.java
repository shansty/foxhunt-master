package com.itechart.foxhunt.api.user.email;

public interface UserRequestProcessingService<I, O> {

    O process(I input);

}
