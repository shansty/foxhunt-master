package com.itechart.foxhunt.api.competition.dto;

import com.itechart.foxhunt.api.competition.CompetitionInvitationStatus;
import lombok.Getter;

@Getter
public class CompetitionWithInvitationInfo extends Competition {

    private CompetitionInvitationStatus invitationStatus;

    private String source;

    public CompetitionWithInvitationInfo(
        CompetitionInvitationStatus invitationStatus, String source, Competition competition) {
        this.setId(competition.getId());
        this.setName(competition.getName());
        this.setNotes(competition.getNotes());
        this.setCreatedBy(competition.getCreatedBy());
        this.setCoach(competition.getCoach());
        this.setFoxAmount(competition.getFoxAmount());
        this.setFoxPoints(competition.getFoxPoints());
        this.setStartPoint(competition.getStartPoint());
        this.setFinishPoint(competition.getFinishPoint());
        this.setStartDate(competition.getStartDate());
        this.setCreatedDate(competition.getCreatedDate());
        this.setUpdatedDate(competition.getUpdatedDate());
        this.setLocation(competition.getLocation());
        this.setDistanceType(competition.getDistanceType());
        this.setParticipants(competition.getParticipants());
        this.setStatus(competition.getStatus());
        this.setFoxDuration(competition.getFoxDuration());
        this.setExpectedCompetitionDuration(competition.getExpectedCompetitionDuration());
        this.setHasSilenceInterval(competition.isHasSilenceInterval());
        this.setActualStartDate(competition.getActualStartDate());
        this.setActualFinishDate(competition.getActualFinishDate());
        this.setStoppingReason(competition.getStoppingReason());
        this.setFrequency(competition.getFrequency());
        this.invitationStatus = invitationStatus;
        this.source = source;
    }

    public CompetitionWithInvitationInfo(Competition competition) {
        this.setId(competition.getId());
        this.setName(competition.getName());
        this.setNotes(competition.getNotes());
        this.setCreatedBy(competition.getCreatedBy());
        this.setCoach(competition.getCoach());
        this.setFoxAmount(competition.getFoxAmount());
        this.setFoxPoints(competition.getFoxPoints());
        this.setStartPoint(competition.getStartPoint());
        this.setFinishPoint(competition.getFinishPoint());
        this.setStartDate(competition.getStartDate());
        this.setCreatedDate(competition.getCreatedDate());
        this.setUpdatedDate(competition.getUpdatedDate());
        this.setLocation(competition.getLocation());
        this.setDistanceType(competition.getDistanceType());
        this.setParticipants(competition.getParticipants());
        this.setStatus(competition.getStatus());
        this.setFoxDuration(competition.getFoxDuration());
        this.setExpectedCompetitionDuration(competition.getExpectedCompetitionDuration());
        this.setHasSilenceInterval(competition.isHasSilenceInterval());
        this.setActualStartDate(competition.getActualStartDate());
        this.setActualFinishDate(competition.getActualFinishDate());
        this.setStoppingReason(competition.getStoppingReason());
        this.setFrequency(competition.getFrequency());
    }
}
