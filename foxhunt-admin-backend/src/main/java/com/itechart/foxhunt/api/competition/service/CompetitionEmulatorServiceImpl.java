package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.auth.security.AuthenticationInfoService;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.DeviceInfo;
import com.itechart.foxhunt.api.competition.job.DelayedJob;
import com.itechart.foxhunt.api.user.dto.User;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompetitionEmulatorServiceImpl implements CompetitionEmulatorService {

    private final int POINTS_SAVING_INTERVAL = 1;
    private final int NUMBER_OF_DISCONNECTED_POINTS = 5;

    private final Random random = new Random();

    @Value("${foxhunt.competition.participant-disconnect-timeout}")
    private int participantDisconnectTimeout;

    private final DeviceTrackerService deviceTrackerService;
    private final CompetitionPathGeneratorService pathGeneratorService;
    private final AuthenticationInfoService authInfoService;

    private final Map<Long, CompletableFuture<Void>> emulatedCompetitions = new ConcurrentHashMap<>();

    @Override
    public CompletableFuture<Void> emulateCompetition(Competition competition) {
        Long organizationId = authInfoService.getLoggedUserAuthenticationInfo().getOrganizationId();
        Map<Integer, Map<User, Point>> participantsPaths = pathGeneratorService.generateParticipantsPathPoints(competition);

        CompletableFuture<Void> saveUsersLocationsFuture = CompletableFuture
            .runAsync(() -> emulateUsersMovement(participantsPaths, competition.getId(), organizationId));
        emulatedCompetitions.put(competition.getId(), saveUsersLocationsFuture);
        return saveUsersLocationsFuture;
    }

    private void emulateUsersMovement(Map<Integer, Map<User, Point>> participantsPaths, Long competitionId, Long organizationId) {
        Integer firstStep = Collections.min(participantsPaths.keySet());
        Set<Integer> stepsToMarkDisconnected = generateStepsToMarkDisconnected(firstStep, participantsPaths.size());
        participantsPaths.forEach((step, usersPoints) -> {
            DelayedJob job = () -> saveUserLocation(usersPoints, competitionId, organizationId);
            int delay = stepsToMarkDisconnected.contains(step) ?
                participantDisconnectTimeout + POINTS_SAVING_INTERVAL :
                POINTS_SAVING_INTERVAL;
            job.delayExecute(delay, TimeUnit.SECONDS);
        });
    }

    private Set<Integer> generateStepsToMarkDisconnected(int firstStep, int numberOfAllSteps) {
        Set<Integer> stepsToMarkDisconnected = random.ints(firstStep, numberOfAllSteps)
            .limit(NUMBER_OF_DISCONNECTED_POINTS - 1)
            .boxed()
            .collect(Collectors.toSet());
        stepsToMarkDisconnected.add(firstStep + 1);
        return stepsToMarkDisconnected;
    }

    private void saveUserLocation(Map<User, Point> pointsToSave, Long competitionId, Long organizationId) {
        pointsToSave.forEach((participant, pointToSave) -> {
            String payloadHeader = authInfoService.buildAuthHeader(organizationId, participant);
            DeviceInfo deviceInfo = new DeviceInfo(pointToSave);
            deviceTrackerService.trackDevice(payloadHeader, competitionId, deviceInfo);
        });
    }

    @Override
    public void finishCompetitionEmulation(Long competitionId) {
        CompletableFuture<Void> saveUsersLocationsJob = emulatedCompetitions.get(competitionId);
        if (saveUsersLocationsJob != null) {
            saveUsersLocationsJob.complete(null);
            emulatedCompetitions.remove(competitionId);
        }
    }
}
