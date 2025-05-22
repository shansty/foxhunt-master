package com.itechart.foxhunt.api.competition.job;

import java.util.concurrent.TimeUnit;

public interface DelayedJob {

    void execute();

    default void delayExecute(int interval, TimeUnit timeUnit) {
        try {
            timeUnit.sleep(interval);
            execute();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
