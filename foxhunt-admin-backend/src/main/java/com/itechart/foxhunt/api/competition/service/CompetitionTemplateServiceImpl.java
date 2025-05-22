package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.config.CompetitionTemplateConfig;
import com.itechart.foxhunt.api.competition.config.CompetitionTemplateConfig.CompetitionTemplate;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionTemplateRequest;
import com.itechart.foxhunt.api.competition.entity.CompetitionInvitationEntity;
import com.itechart.foxhunt.api.competition.mapper.CompetitionLocationMapper;
import com.itechart.foxhunt.api.competition.mapper.CompetitionMapper;
import com.itechart.foxhunt.api.competition.mapper.CompetitionTemplateMapper;
import com.itechart.foxhunt.api.competition.repository.CompetitionInvitationRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionParticipantRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionRepository;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.location.dao.LocationRepository;
import com.itechart.foxhunt.api.user.dao.UserRepository;
import com.itechart.foxhunt.api.utils.GeomUtils;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.CompetitionLocation;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantEntity;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantId;
import com.itechart.foxhunt.domain.entity.DistanceTypeEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.competition.CompetitionInvitationStatus.ACCEPTED;

@Service
@Slf4j
@RequiredArgsConstructor
public class CompetitionTemplateServiceImpl implements CompetitionTemplateService {

    private static final String SOURCE_TRAINER = "Trainer";
    private static final int LOCATION_POINTS_QUANTITY = 2;

    private final CompetitionTemplateConfig competitionTemplateConfig;

    private final CompetitionTemplateMapper competitionTemplateMapper;
    private final CompetitionMapper competitionMapper;
    private final CompetitionLocationMapper locationMapper;

    private final DistanceTypeService distanceTypeService;

    private final CompetitionRepository competitionRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    private final CompetitionInvitationRepository competitionInvitationRepository;
    private final CompetitionParticipantRepository competitionParticipantRepository;


    @Override
    public List<CompetitionTemplate> getAll() {
        return competitionTemplateConfig.getTemplates();
    }

    @Override
    @Transactional
    public Competition createCompetitionByTemplate(Long organizationId, UserEntity user, CompetitionTemplateRequest templateRequest) {
        CompetitionTemplate template = getCompetitionTemplate(templateRequest.getTemplateId());
        template.setName(templateRequest.getName());
        CompetitionEntity competitionEntity = createCompetitionEntity(template, organizationId, user);

        List<UserEntity> users = getUsers(template);
        List<CompetitionParticipantEntity> competitionParticipantEntities = acceptInvitations(users, competitionEntity);
        saveInvitations(users, competitionEntity);

        competitionEntity.setParticipants(new HashSet<>(competitionParticipantEntities));
        return competitionMapper.entityToDomain(competitionEntity);
    }

    private CompetitionTemplate getCompetitionTemplate(Long templateId) {
        return competitionTemplateConfig.getTemplates().stream()
            .filter(t -> t.getTemplateId().equals(templateId))
            .findFirst().orElseThrow(() -> new BadRequestException("Invalid template id"));
    }

    private CompetitionEntity createCompetitionEntity(CompetitionTemplate template, Long organizationId, UserEntity user) {
        CompetitionEntity competition = competitionTemplateMapper.domainToEntity(template);

        DistanceTypeEntity distanceType = distanceTypeService.findDistanceByName(template.getDistanceTypeName());
        CompetitionLocation locationSnapshot = getLocationSnapshot(template.getLocationName());
        UserEntity coach = getCoach(user.getId());

        List<Point> competitionPoints = locationRepository
            .getRandomCoordinatesFromArea(locationSnapshot.getCoordinates(), LOCATION_POINTS_QUANTITY)
            .stream().map(GeomUtils::getPoint).toList();

        competition.setOrganizationId(organizationId);
        competition.setCoach(coach);
        competition.setCreatedBy(user);
        competition.setLocation(locationSnapshot);
        competition.setStartPoint(competitionPoints.get(0));
        competition.setFinishPoint(competitionPoints.get(1));
        competition.setDistanceType(distanceType);
        competition.setStartDate(LocalDateTime.now());
        competition.setStatus(CompetitionStatus.SCHEDULED);
        competition.setIsEmulated(true);

        return competitionRepository.save(competition);
    }

    private CompetitionLocation getLocationSnapshot(String locationName) {
        LocationEntity locationEntity = locationRepository.findByName(locationName)
            .orElseThrow(() -> new EntityNotFoundException(String.format("Location with name %s not found", locationName)));
        return locationMapper.entityToCompetitionLocation(locationEntity);
    }

    private UserEntity getCoach(Long coachId) {
        return userRepository.findById(coachId)
            .orElseThrow(() -> new BadRequestException(String.format("Coach with id %d does not exist", coachId)));
    }

    private List<UserEntity> getUsers(CompetitionTemplate template) {
        Set<String> emails = new HashSet<>(template.getParticipantEmails());
        return new ArrayList<>(userRepository.findByEmailIn(emails));
    }

    private List<CompetitionParticipantEntity> acceptInvitations(List<UserEntity> users, CompetitionEntity competitionEntity) {
        List<CompetitionParticipantEntity> participants = users.stream()
            .map(participant -> CompetitionParticipantEntity.builder()
                .id(new CompetitionParticipantId())
                .competition(competitionEntity)
                .user(participant)
                .build())
            .collect(Collectors.toList());
        return competitionParticipantRepository.saveAll(participants);
    }

    private void saveInvitations(List<UserEntity> users, CompetitionEntity competitionEntity) {
        List<CompetitionInvitationEntity> invitations =
            users.stream()
                .map(participant -> {
                    CompetitionInvitationEntity invitation = new CompetitionInvitationEntity();
                    invitation.setCreatedAt(LocalDateTime.now());
                    invitation.setCompetition(competitionEntity);
                    invitation.setParticipant(participant);
                    invitation.setSource(SOURCE_TRAINER);
                    invitation.setUpdatedAt(LocalDateTime.now());
                    invitation.setStatus(ACCEPTED);
                    return invitation;
                })
                .collect(Collectors.toList());
        competitionInvitationRepository.saveAll(invitations);
    }
}
