package com.itechart.foxhunt.api.competition.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.competition.dto.CancelCompetitionRequest;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionInvitation;
import com.itechart.foxhunt.api.competition.dto.GetAllCompetitionsRequest;
import com.itechart.foxhunt.api.competition.dto.ModifyCompetition;
import com.itechart.foxhunt.api.competition.dto.PersonalUserResult;
import com.itechart.foxhunt.api.competition.dto.View.Regular;
import com.itechart.foxhunt.api.competition.service.CompetitionService;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static com.itechart.foxhunt.api.core.ApiConstants.ID_PATH_VARIABLE;

@RestController
@RequestMapping(value = ApiConstants.COMPETITIONS, produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class CompetitionController implements CompetitionControllerInterface {

    private final CompetitionService competitionService;

    private final LoggedUserService loggedUserService;

    @GetMapping
    @Override
    public Page<? extends Competition> findAllAvailable(GetAllCompetitionsRequest competitionsRequest,
            @PageableDefault(size = Integer.MAX_VALUE) Pageable pageable,
            OrganizationId organizationId) {
        return competitionService
                .findAllAvailable(competitionsRequest, pageable, organizationId.getId(),
                        loggedUserService.getLoggedUser());
    }

    @GetMapping(ApiConstants.COMPETITION_INVITATIONS)
    @Secured(value = { ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_PARTICIPANT })
    @Override
    public List<CompetitionInvitation> getAllInvitationsByCompetitionId(OrganizationId organizationId,
            @PathVariable final Long id) {
        User loggedUser = loggedUserService.getLoggedUser();
        return competitionService.getAllInvitationsByCompetitionId(organizationId.getId(), id, loggedUser);
    }

    @GetMapping(ApiConstants.ID)
    @Secured(value = { ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_PARTICIPANT })
    @Override
    public Object getById(@PathVariable final Long id,
            OrganizationId organizationId) {
        log.debug(competitionService.getCompetitionById(id, organizationId.getId()) + " inside GetMapping");
        return competitionService.getCompetitionById(id, organizationId.getId());
    }

    @GetMapping(ApiConstants.COMPETITION_RESULTS)
    @Override
    public ResponseEntity<Page<PersonalUserResult>> getUserResults(OrganizationId organizationId,
            @PageableDefault(size = Integer.MAX_VALUE) Pageable pageable) {
        UserEntity loggedUser = loggedUserService.getLoggedUserEntity();
        Pageable sortedByStartDatePageable = PageRequest
                .of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("start_date").descending());

        return ResponseEntity.ok(competitionService.getUserResults(loggedUser.getId(), organizationId.getId(),
                sortedByStartDatePageable));
    }

    @PostMapping
    @JsonView(Regular.class)
    @Secured(value = { ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER })
    @Override
    public ResponseEntity<Competition> create(@RequestBody final ModifyCompetition competition,
            OrganizationId organizationId) {
        log.info("Received request from trainer: {} to add participant: {} to competition: {}");
        return new ResponseEntity<>(competitionService.create(competition, organizationId.getId()),
                HttpStatus.CREATED);

    }

    @PostMapping(value = ApiConstants.SUBSCRIBE_COMPETITION, params = { "participantId" })
    @Secured(value = { ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_ORGANIZATION_ADMIN })
    @Override
    public ResponseEntity<CompetitionInvitation> subscribe(@PathVariable(ID_PATH_VARIABLE) final Long competitionId,
            @RequestParam(required = false) Long participantId,
            OrganizationId organizationId) {
        Long loggedUserId = getLoggedUserId();
        log.info("Received request from trainer: {} to add participant: {} to competition: {}",
                loggedUserId, participantId, competitionId);
        var createdInvitation = competitionService
                .subscribe(organizationId.getId(), competitionId, participantId, ApiConstants.SOURCE_TRAINER);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdInvitation);
    }

    @PostMapping(ApiConstants.SUBSCRIBE_COMPETITION)
    @Secured(value = { ApiConstants.ROLE_PARTICIPANT })
    public ResponseEntity<CompetitionInvitation> subscribe(@PathVariable(ID_PATH_VARIABLE) final Long competitionId,
            OrganizationId organizationId) {
        Long loggedUserId = getLoggedUserId();
        log.info("Received request from participant: {} to subscribe to competition: {}", loggedUserId, competitionId);
        var createdInvitation = competitionService
                .subscribe(organizationId.getId(), competitionId, loggedUserId, ApiConstants.SOURCE_PARTICIPANT);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdInvitation);
    }

    @PutMapping(value = ApiConstants.ACCEPT_COMPETITION_INVITATION, params = { "participantId" })
    @Secured(value = { ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_ORGANIZATION_ADMIN })
    @Override
    public ResponseEntity<CompetitionInvitation> acceptInvitation(
            @PathVariable(ID_PATH_VARIABLE) final Long competitionId,
            @RequestParam(required = false) Long participantId,
            OrganizationId organizationId) {
        Long loggedUserId = getLoggedUserId();
        log.info("Received request from trainer: {} to accept user: {} to competition: {}",
                loggedUserId, participantId, competitionId);
        var acceptedInvitation = competitionService.acceptInvitation(organizationId.getId(), competitionId,
                participantId, ApiConstants.SOURCE_TRAINER);
        return ResponseEntity.ok(acceptedInvitation);
    }

    @PutMapping(ApiConstants.ACCEPT_COMPETITION_INVITATION)
    @Secured(value = { ApiConstants.ROLE_PARTICIPANT })
    public ResponseEntity<CompetitionInvitation> acceptInvitation(
            @PathVariable(ID_PATH_VARIABLE) final Long competitionId,
            OrganizationId organizationId) {
        Long loggedUserId = getLoggedUserId();
        log.info("Received request from participant {} to accept invitation to competition: {}", loggedUserId,
                competitionId);
        var acceptedInvitation = competitionService.acceptInvitation(organizationId.getId(), competitionId,
                loggedUserId, ApiConstants.SOURCE_PARTICIPANT);
        return ResponseEntity.ok(acceptedInvitation);
    }

    @PutMapping(value = ApiConstants.DECLINE_COMPETITION_INVITATION, params = { "participantId" })
    @Secured(value = { ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_ORGANIZATION_ADMIN })
    @Override
    public ResponseEntity<CompetitionInvitation> declineInvitation(
            @PathVariable(ID_PATH_VARIABLE) final Long competitionId,
            @RequestParam(required = false) Long participantId) {
        Long loggedUserId = getLoggedUserId();
        log.info("Received request from trainer: {} to refuse user: {} participate in competition: {} ",
                loggedUserId, participantId, competitionId);
        var declinedInvitation = competitionService.declineInvitation(competitionId, participantId);
        return ResponseEntity.status(HttpStatus.OK).body(declinedInvitation);
    }

    @PutMapping(ApiConstants.DECLINE_COMPETITION_INVITATION)
    @Secured(value = { ApiConstants.ROLE_PARTICIPANT })
    public ResponseEntity<CompetitionInvitation> declineInvitation(
            @PathVariable(ID_PATH_VARIABLE) final Long competitionId) {
        Long loggedUserId = getLoggedUserId();
        log.info("Received request from participant: {} to decline invitation to competition: {} ",
                loggedUserId, competitionId);
        var declinedInvitation = competitionService.declineInvitation(competitionId, loggedUserId);
        return ResponseEntity.ok(declinedInvitation);
    }

    @PutMapping(value = ApiConstants.PERMANENT_DECLINE_INVITATION, params = { "participantId" })
    @Secured(value = { ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_ORGANIZATION_ADMIN })
    @Override
    public ResponseEntity<CompetitionInvitation> declineInvitationPermanently(
            @PathVariable(ID_PATH_VARIABLE) Long competitionId,
            Long participantId,
            OrganizationId organizationId) {
        log.info("Received request from trainer: {} to permanently decline user: {} participate in competition: {} ",
                getLoggedUserId(), participantId, competitionId);
        CompetitionInvitation permanentlyDeclinedInvitation = competitionService
                .declineInvitationPermanently(organizationId.getId(), competitionId, participantId);
        return ResponseEntity.ok(permanentlyDeclinedInvitation);
    }

    @PatchMapping(ApiConstants.ID)
    @JsonView(Regular.class)
    @Secured(value = { ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER })
    @Transactional
    @Override
    public ResponseEntity<Competition> updateOne(@RequestBody ModifyCompetition competition,
            @PathVariable final Long id, OrganizationId organizationId) {
        log.info(competition + " inside PatchMapping");
        if (userAffectsCompetitionWithinItsOrganization(id, organizationId.getId())) {
            log.info(competitionService.updateById(competition, id, organizationId.getId()) + " if part");
            return ResponseEntity
                    .ok(competitionService.updateById(competition, id, organizationId.getId()));
        } else {
            log.info(ResponseEntity.badRequest().build() + " badRequest");
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping(ApiConstants.CANCELLATION)
    @Secured(value = { ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER })
    @Override
    public ResponseEntity<Competition> cancelOne(@Valid @RequestBody CancelCompetitionRequest cancelRequest,
            @PathVariable Long id,
            OrganizationId organizationId) {
        Competition canceledCompetition = competitionService.cancelById(cancelRequest, id, organizationId.getId());
        return ResponseEntity.ok(canceledCompetition);
    }

    @DeleteMapping(ApiConstants.ID)
    @Secured(value = { ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER })
    @Override
    public ResponseEntity<Long> deleteOne(@PathVariable final Long id,
            OrganizationId organizationId) {
        if (userAffectsCompetitionWithinItsOrganization(id, organizationId.getId())) {
            competitionService.deleteById(id);
            return ResponseEntity.ok(id);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping(ApiConstants.COMPETITION_PARTICIPANT)
    @Secured(value = { ApiConstants.ROLE_PARTICIPANT, ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_ORGANIZATION_ADMIN })
    public ResponseEntity<Long> removeParticipantFromCompetition(@PathVariable final Long id,
            @RequestParam(required = false) final Long participantId,
            OrganizationId organizationId) {
        UserEntity loggedUser = loggedUserService.getLoggedUserEntity();
        if (userAffectsCompetitionWithinItsOrganization(id, organizationId.getId())) {
            if (!hasRole(loggedUser, Role.PARTICIPANT)) {
                competitionService.removeParticipantFromCompetition(id, participantId);
            } else {
                competitionService.removeParticipantFromCompetition(id, loggedUser.getId());
            }
            return ResponseEntity.ok(participantId);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    private Long getLoggedUserId() {
        return loggedUserService.getLoggedUserId();
    }

    // TODO: move to service
    private boolean hasRole(UserEntity user, Role role) {
        return user.getRoles().stream()
                .map(RoleEntity::getRole)
                .anyMatch(userRole -> userRole.equals(role));
    }

    private boolean userAffectsCompetitionWithinItsOrganization(Long id, Long organizationId) {
        return competitionService.existsByIdAndWithinOrganizationWithId(id, organizationId);
    }

}
