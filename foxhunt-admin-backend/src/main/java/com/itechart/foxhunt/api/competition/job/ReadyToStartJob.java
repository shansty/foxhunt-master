package com.itechart.foxhunt.api.competition.job;

import com.itechart.foxhunt.domain.enums.NotificationType;
import com.itechart.foxhunt.api.competition.dto.TimeToStartNotification;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@AllArgsConstructor
@Slf4j
public class ReadyToStartJob implements Runnable {

    public static final long READY_TIME_SECONDS = 30;

    private SseEmitter client;

    private final LocalDateTime startMoment;

    @Override
    public void run() {
        try {
            client.send(SseEmitter.event().name(NotificationType.READY_TO_START.name())
                    .data(new TimeToStartNotification(READY_TIME_SECONDS, startMoment)));
        } catch (Exception e) {
            log.error(String.format("Cannot send READY_TO_START notification as %s", e.getMessage()));
        }
    }
}
