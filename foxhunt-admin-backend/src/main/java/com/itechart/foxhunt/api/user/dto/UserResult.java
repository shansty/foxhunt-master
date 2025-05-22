package com.itechart.foxhunt.api.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResult {
    private User user;
    private long startPosition;
    private long foundFoxes;
    private int currentPosition;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime finishDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime startDate;

    private boolean completeCompetition;

    public int compareByCompetitionResult(UserResult anotherUserResult){

        final int compareByCompleteStatus = compareByCompetitionCompleteStatus(anotherUserResult);

        if(compareByCompleteStatus != 0){
            return compareByCompleteStatus;
        }

        final int compareByFoxes = compareByFoxes(anotherUserResult);

        if(compareByFoxes != 0){
            return compareByFoxes;
        }

        return compareByTime(anotherUserResult);
    }

    /**
     * Compare user position by finish date and completed status. User who complete game or still in game have higher
     * game position than user who not complete game
     * @param anotherUserResult  {@link UserResult}
     * @return int
     */
    public  int compareByCompetitionCompleteStatus(UserResult anotherUserResult){
        final boolean completedOrInGame = isCompletedOrInGame();
        final boolean completedOrInGameAnotherParticipant = anotherUserResult.isCompletedOrInGame();

        if(completedOrInGame && !completedOrInGameAnotherParticipant){
            return -1;
        }

        if(completedOrInGameAnotherParticipant && !completedOrInGame){
            return 1;
        }

        return 0;
    }

    /**
     * Compare user position by caught foxes. User who caught more foxes have have higher game position
     * @param anotherUserResult  {@link UserResult}
     * @return int
     */
    public  int compareByFoxes(UserResult anotherUserResult){

        if(foundFoxes > anotherUserResult.getFoundFoxes()){
            return -1;
        }

        if(anotherUserResult.getFoundFoxes() > foundFoxes){
            return 1;
        }

        return 0;
    }

    /**
     * Compare user position by game time. User who spent less time have have higher game position
     * @param anotherUserResult  {@link UserResult}
     * @return int
     */
    public  int compareByTime(UserResult anotherUserResult){
        final long gameTime = getGameTime();
        final long gameTimeAnotherUser = anotherUserResult.getGameTime();

        if(gameTime > gameTimeAnotherUser){
            return 1;
        }
        if(gameTimeAnotherUser > gameTime){
            return -1;
        }

        return 0;
    }

    public Long getGameTime(){
        if(startDate == null){
            return 0L;
        }

        if(finishDate == null){
            return startDate.until(LocalDateTime.now(), ChronoUnit.SECONDS);
        }

        return startDate.until(finishDate, ChronoUnit.SECONDS);
    }

    /**
     * return true if participant complete full distance or still in game
     * @return boolean
     */
    public boolean isCompletedOrInGame(){
        return   finishDate == null || completeCompetition;
    }
}
