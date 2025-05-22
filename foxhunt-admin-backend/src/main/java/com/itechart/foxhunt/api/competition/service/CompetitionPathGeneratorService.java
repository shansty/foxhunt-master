package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.user.dto.User;
import org.locationtech.jts.geom.Point;

import java.util.Map;

public interface CompetitionPathGeneratorService {

    Map<Integer, Map<User, Point>> generateParticipantsPathPoints(Competition competition);

}
