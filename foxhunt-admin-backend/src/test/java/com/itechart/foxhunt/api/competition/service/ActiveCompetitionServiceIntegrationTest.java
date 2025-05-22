package com.itechart.foxhunt.api.competition.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.foxhunt.api.AbstractMigrationTest;
import com.itechart.foxhunt.api.auth.security.AuthenticationInfo;
import com.itechart.foxhunt.api.auth.security.UserAuthentication;
import com.itechart.foxhunt.api.competition.controller.ActiveCompetitionController;
import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionTemplateRequest;
import com.itechart.foxhunt.api.competition.dto.DeviceInfo;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.competition.dto.Participant;
import com.itechart.foxhunt.api.competition.dto.ParticipantTracker;
import com.itechart.foxhunt.api.competition.dto.StartCompetition;
import com.itechart.foxhunt.api.competition.dto.TrackDeviceResponse;
import com.itechart.foxhunt.api.competition.repository.CompetitionParticipantRepository;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantEntity;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantId;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.NotificationType;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.SneakyThrows;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.itechart.foxhunt.api.TestDataKeeper.COMPETITION_TEMPLATE_ID;
import static com.itechart.foxhunt.api.TestDataKeeper.INVALID_ID;
import static com.itechart.foxhunt.api.TestDataKeeper.MESSAGE_FIELD;
import static com.itechart.foxhunt.api.TestDataKeeper.ORGANIZATION_ID;
import static com.itechart.foxhunt.api.TestDataKeeper.PARTICIPANT_EMAIL_FROM_TEMPLATE;
import static com.itechart.foxhunt.api.TestDataKeeper.PARTICIPANT_ID_FROM_TEMPLATE;
import static com.itechart.foxhunt.api.TestDataKeeper.PAYLOAD_FIELD;
import static com.itechart.foxhunt.api.TestDataKeeper.USER_EMAIL;
import static com.itechart.foxhunt.api.TestDataKeeper.USER_ID;
import static com.itechart.foxhunt.domain.enums.NotificationType.ACTIVE_FOX;
import static com.itechart.foxhunt.domain.enums.NotificationType.CURRENT_LOCATION;
import static com.itechart.foxhunt.domain.enums.NotificationType.PARTICIPANT_DISCONNECTED;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@AutoConfigureWebTestClient
public class ActiveCompetitionServiceIntegrationTest extends AbstractMigrationTest {

    private static final long START_COMPETITION_OFFSET_MINUTES = 10;

    private record ParticipantPair(User firstUser, User secondUser) {
    }

    private final String WATCH_COMPETITION_URL = ApiConstants.ACTIVE_COMPETITIONS + ApiConstants.SUBSCRIBE_COMPETITION;
    private final String TRACK_DEVICE_COMPETITION_URL = ApiConstants.ACTIVE_COMPETITIONS + ApiConstants.TRACK_DEVICE;

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private ActiveCompetitionController activeCompetitionController;

    @Autowired
    private CompetitionTemplateService competitionTemplateService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CompetitionParticipantRepository competitionParticipantRepository;

    private final Random numberGenerator = new Random();

    private final GeometryFactory geometryFactory = new GeometryFactory();

    private String authHeader;

    private Competition startedCompetition;

    @BeforeEach
    @SneakyThrows
    public void setup() {
        Set<Role> loggedUserRoles = Set.of(Role.TRAINER, Role.ORGANIZATION_ADMIN);
        setupAuthenticationContext(USER_EMAIL, ORGANIZATION_ID, loggedUserRoles);
        AuthenticationInfo authInfo = new AuthenticationInfo(USER_EMAIL, ORGANIZATION_ID, loggedUserRoles);
        authHeader = objectMapper.writeValueAsString(authInfo);
        startedCompetition =
            createStartedCompetitionByTemplate(ORGANIZATION_ID, USER_ID, COMPETITION_TEMPLATE_ID);
    }

    @Test
    public void expectRetrieveCurrentLocationEventsAfterCompetitionStart() {
        //when
        var eventStream = webTestClient.get()
            .uri(WATCH_COMPETITION_URL, startedCompetition.getId())
            .accept(MediaType.TEXT_EVENT_STREAM)
            .header("payload", authHeader)
            .exchange()
            .expectStatus().isOk()
            .expectHeader().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM)
            .returnResult(ServerSentEvent.class)
            .getResponseBody();

        //then
        List<String> expectedRetrievedEvents =
            List.of(ACTIVE_FOX.name(), CURRENT_LOCATION.name());
        StepVerifier
            .create(eventStream.mapNotNull(ServerSentEvent::event))
            .recordWith(ArrayList::new)
            .thenConsumeWhile(event -> !event.contains(CURRENT_LOCATION.name()))
            .expectRecordedMatches(serverSentEvent -> serverSentEvent.containsAll(expectedRetrievedEvents))
            .thenCancel().verify();
    }

    @Test
    public void expectRetrieveParticipantDisconnectedEvent() {
        //when
        var eventStream = webTestClient.get()
            .uri(WATCH_COMPETITION_URL, startedCompetition.getId())
            .accept(MediaType.TEXT_EVENT_STREAM)
            .header("payload", authHeader)
            .exchange()
            .expectStatus().isOk()
            .expectHeader().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM)
            .returnResult(ServerSentEvent.class)
            .getResponseBody();

        //then
        StepVerifier
            .create(eventStream.mapNotNull(ServerSentEvent::event))
            .recordWith(ArrayList::new)
            .thenConsumeWhile(serverSentEvent -> !serverSentEvent.contains(PARTICIPANT_DISCONNECTED.name()))
            .expectRecordedMatches(serverSentEvent -> serverSentEvent.contains(PARTICIPANT_DISCONNECTED.name()))
            .thenCancel().verify();
    }

    @Test
    public void expectRetrieveCurrentLocationEventWithDisconnectedLocationsAfterReceivingDisconnectEvent() {
        //when
        var eventStream = webTestClient.get()
            .uri(WATCH_COMPETITION_URL, startedCompetition.getId())
            .accept(MediaType.TEXT_EVENT_STREAM)
            .header("payload", authHeader)
            .exchange()
            .expectStatus().isOk()
            .expectHeader().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM)
            .returnResult(ServerSentEvent.class)
            .getResponseBody();

        //then
        StepVerifier
            .create(eventStream.mapNotNull(serverSentEvent -> serverSentEvent))
            .recordWith(ArrayList::new)
            .thenConsumeWhile(serverSentEvent -> !PARTICIPANT_DISCONNECTED.name().equals(serverSentEvent.event()))
            .thenConsumeWhile(serverSentEvent -> !CURRENT_LOCATION.name().equals(serverSentEvent.event()))
            .expectRecordedMatches(serverSentEventsList -> {
                List<Long> disconnectedParticipantsIds = serverSentEventsList.stream()
                    .filter(serverSentEvent -> PARTICIPANT_DISCONNECTED.name().equals(serverSentEvent.event()))
                    .map(serverSentEvent ->
                        objectMapper.convertValue(serverSentEvent.data(), ActiveTracker.class).getParticipantId())
                    .toList();

                List<ParticipantTracker> lastParticipantTrackers = serverSentEventsList.stream()
                    .filter(serverSentEvent -> CURRENT_LOCATION.name().equals(serverSentEvent.event()))
                    .map(serverSentEvent -> Arrays.asList(objectMapper.convertValue(serverSentEvent.data(), ParticipantTracker[].class)))
                    .reduce((first, second) -> second)
                    .orElseThrow(() -> new IllegalStateException("Unable to find last participants tracker list"));
                return lastParticipantTrackers.stream()
                    .filter(participantTracker -> disconnectedParticipantsIds.contains(participantTracker.getParticipantId()))
                    .allMatch(participantTracker -> {
                        ActiveTracker lastParticipantLocation = participantTracker.getTrackerList().get(0);
                        return lastParticipantLocation.getIsDisconnected();
                    });
            }).thenCancel().verify();
    }

    @Test
    public void shouldReturnOkStatusAndParticipantOutOfPolygonNotificationTypeWhenParticipantIsOutOfLocationArea() {
        setupAuthenticationContext(PARTICIPANT_EMAIL_FROM_TEMPLATE, ORGANIZATION_ID, Set.of(Role.PARTICIPANT));
        Point outOfPolygonPoint = geometryFactory.createPoint(new Coordinate(58.96919143862909, 22.30698515833221));
        DeviceInfo deviceInfo = new DeviceInfo(outOfPolygonPoint);

        ResponseEntity<TrackDeviceResponse> response =
            activeCompetitionController.trackDevice(startedCompetition.getId(), deviceInfo);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(NotificationType.USER_IS_OUT_OF_POLYGON, response.getBody().getNotificationType());
        assertNull(response.getBody().getFoxPoint());
    }

    @Test
    public void shouldReturnOkStatusAndParticipantFinishNotificationTypeWhenParticipantVisitFinishPoint() {
        updateParticipantInCompetition(startedCompetition.getId(), PARTICIPANT_ID_FROM_TEMPLATE, START_COMPETITION_OFFSET_MINUTES);
        setupAuthenticationContext(PARTICIPANT_EMAIL_FROM_TEMPLATE, ORGANIZATION_ID, Set.of(Role.PARTICIPANT));
        DeviceInfo deviceInfo = new DeviceInfo(startedCompetition.getFinishPoint());

        ResponseEntity<TrackDeviceResponse> response =
            activeCompetitionController.trackDevice(startedCompetition.getId(), deviceInfo);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(NotificationType.PARTICIPANT_FINISH, response.getBody().getNotificationType());
        assertNull(response.getBody().getFoxPoint());
    }

    @Test
    public void shouldReturnOkStatusAndParticipantFoundFoxNotificationTypeWhenParticipantVisitFoxPoint() {
        setupAuthenticationContext(PARTICIPANT_EMAIL_FROM_TEMPLATE, ORGANIZATION_ID, Set.of(Role.PARTICIPANT));
        FoxPoint foxPoint = startedCompetition.getFoxPoints().get(0);
        DeviceInfo deviceInfo = new DeviceInfo(foxPoint.getCoordinates());

        ResponseEntity<TrackDeviceResponse> response =
            activeCompetitionController.trackDevice(startedCompetition.getId(), deviceInfo);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(NotificationType.FOX_FOUND, response.getBody().getNotificationType());
        assertNotNull(response.getBody().getFoxPoint());
        assertEquals(foxPoint, response.getBody().getFoxPoint());
    }

    @Test
    public void shouldReturnBadRequestAndCompetitionIsNotActiveWhenCompetitionIsNotActive() {
        DeviceInfo deviceInfo = new DeviceInfo(startedCompetition.getStartPoint());
        String expectedMessage = String.format("No active competitions with id %s", INVALID_ID);

        webTestClient.post()
            .uri(TRACK_DEVICE_COMPETITION_URL, INVALID_ID)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(deviceInfo)
            .header(PAYLOAD_FIELD, authHeader)
            .exchange()
            .expectStatus().isBadRequest()
            .expectBody().jsonPath(MESSAGE_FIELD).isEqualTo(expectedMessage);
    }

    @Test
    public void shouldReturnBadRequestAndNoActiveCompetitionWhenUserDoesNotParticipateInCompetition() {
        DeviceInfo deviceInfo = new DeviceInfo(startedCompetition.getFoxPoints().get(0).getCoordinates());
        String expectedMessage = "No active competition";

        webTestClient.post()
            .uri(TRACK_DEVICE_COMPETITION_URL, startedCompetition.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(deviceInfo)
            .header(PAYLOAD_FIELD, authHeader)
            .exchange()
            .expectStatus().isBadRequest()
            .expectBody().jsonPath(MESSAGE_FIELD).isEqualTo(expectedMessage);
    }

    private void updateParticipantInCompetition(Long competitionId, Long participantId, long offsetMinutes) {
        CompetitionParticipantEntity competitionParticipant = competitionParticipantRepository
            .findById(new CompetitionParticipantId(competitionId, participantId))
            .orElseThrow();
        LocalDateTime updatedDate = competitionParticipant.getStartDate().minusMinutes(offsetMinutes);
        competitionParticipant.setStartDate(updatedDate);
        competitionParticipantRepository.save(competitionParticipant);
    }

    private void setupAuthenticationContext(String userEmail, Long organizationId, Set<Role> roles) {
        Set<GrantedAuthority> userAuthorities = roles.stream()
            .map(role -> new SimpleGrantedAuthority(role.getRoleString()))
            .collect(Collectors.toSet());
        UserAuthentication userAuthentication = new UserAuthentication(userEmail, organizationId, userAuthorities);
        SecurityContextHolder.getContext().setAuthentication(userAuthentication);
    }

    private Competition createStartedCompetitionByTemplate(Long organizationId, Long coachId, Long templateId) {
        UserEntity competitionCoach = userMapper.domainToEntity(userService.findById(coachId, organizationId));
        String competitionName = String.format("Competition %s", RandomStringUtils.random(10, true, true));

        CompetitionTemplateRequest competitionTemplateRequest = new CompetitionTemplateRequest(competitionName, templateId);

        Competition competitionToStart = competitionTemplateService
            .createCompetitionByTemplate(organizationId, competitionCoach, competitionTemplateRequest);
        List<FoxPoint> foxPoints = buildFoxPointsList(competitionToStart);
        List<Participant> participants = buildCompetitionParticipantsList(competitionToStart);

        StartCompetition startCompetitionRequest = new StartCompetition(foxPoints, participants);

        return activeCompetitionController
            .startOne(competitionToStart.getId(), startCompetitionRequest, new OrganizationId(organizationId))
            .getBody();
    }

    private List<FoxPoint> buildFoxPointsList(Competition competition) {
        double competitionFrequency = competition.getFrequency();
        List<Point> foxesCoordinates = List.of(
            geometryFactory.createPoint(new Coordinate(53.96919143862909, 27.30698515833221)),
            geometryFactory.createPoint(new Coordinate(53.974701775785135, 27.306902072586837)),
            geometryFactory.createPoint(new Coordinate(53.95826189722614, 27.31352568511907)),
            geometryFactory.createPoint(new Coordinate(53.970876554218925, 27.308892143700128)),
            geometryFactory.createPoint(new Coordinate(53.98121428746189, 27.299172831510035))
        );
        return IntStream.range(0, foxesCoordinates.size())
            .mapToObj(foxIndex -> buildFoxPoint(foxesCoordinates.get(foxIndex), ++foxIndex, competitionFrequency))
            .toList();
    }

    private FoxPoint buildFoxPoint(Point foxCoordinate, int foxPointIndex, double competitionFrequency) {
        FoxPoint foxPoint = new FoxPoint();
        foxPoint.setCoordinates(foxCoordinate);
        foxPoint.setIndex(foxPointIndex);
        foxPoint.setLabel(String.format("T%s", ++foxPointIndex));
        foxPoint.setFrequency(generateFoxPointFrequency(competitionFrequency));
        return foxPoint;
    }

    private double generateFoxPointFrequency(double competitionFrequency) {
        double distributionRange = 0.1;
        double frequencyDistribution = BigDecimal
            .valueOf(numberGenerator.nextDouble(-distributionRange, distributionRange))
            .setScale(2, RoundingMode.CEILING)
            .doubleValue();
        return competitionFrequency + frequencyDistribution;
    }

    private List<Participant> buildCompetitionParticipantsList(Competition competition) {
        int cycleInterval = competition.getFoxAmount() + 1;
        List<User> users = competition.getParticipants().stream().toList();
        List<ParticipantPair> participantPairs = buildPairsList(users);
        List<Participant> participantsToReturn = new ArrayList<>();

        int participantNumber = 0;
        long pairPosition = 0;
        for (ParticipantPair pair : participantPairs) {
            pairPosition++;
            long pairStartDelay = pairPosition == 1 ? 1 : 1 + (pairPosition - 1) * cycleInterval;
            LocalDateTime pairStartTime = competition.getStartDate().plusMinutes(pairStartDelay);

            Participant firstPairParticipant =
                buildParticipant(++participantNumber, pairPosition, pairStartTime, pair.firstUser);
            Participant secondPairParticipant =
                buildParticipant(++participantNumber, pairPosition, pairStartTime, pair.secondUser);

            participantsToReturn.add(firstPairParticipant);
            participantsToReturn.add(secondPairParticipant);
        }

        return participantsToReturn;
    }

    private List<ParticipantPair> buildPairsList(List<User> users) {
        AtomicInteger counter = new AtomicInteger(0);
        Map<Integer, List<User>> participantsByPairIndex = users.stream()
            .collect(Collectors.groupingBy(user -> {
                int pairIndex = counter.getAndIncrement();
                return (pairIndex % 2 == 0) ? pairIndex : pairIndex - 1;
            }));
        return participantsByPairIndex.values().stream()
            .map(userList -> {
                User firstUser = userList.get(0);
                User secondUser = userList.size() == 2 ? userList.get(1) : null;
                return new ParticipantPair(firstUser, secondUser);
            }).toList();
    }

    private Participant buildParticipant(Integer participantNumber, Long pairIndex, LocalDateTime startDate, User user) {
        Participant participant = new Participant();
        participant.setParticipantNumber(participantNumber);
        participant.setStartPosition(pairIndex);
        participant.setCompleted(false);
        participant.setColor(generateRandomColor());
        participant.setId(user.getId());
        participant.setStartDate(startDate);
        return participant;
    }

    private String generateRandomColor() {
        int randomColor = numberGenerator.nextInt(0xFFFFFF + 1);
        return String.format("#%06x", randomColor);
    }
}
