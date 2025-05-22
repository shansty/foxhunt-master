package com.itechart.foxhunt.api.user;

import com.itechart.foxhunt.api.user.dao.UserInvitationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import javax.annotation.PostConstruct;

@Component
@RequiredArgsConstructor
@Slf4j
public class ExpireUserInvitationJob {

    private final UserInvitationRepository userInvitationRepository;
    private final TransactionTemplate transactionTemplate;

    @PostConstruct
    public void executeInvitationExpirationOnStartup() {
        log.info("Executing invitation expiration on startup");
        transactionTemplate.executeWithoutResult(status -> markInvitationsAsExpired());
    }

    @Scheduled(cron = "0 0 0 * * *") //daily
    public void executeInvitationExpirationJob() {
        log.info("Executing job to mark expired invitations as expired");
        transactionTemplate.executeWithoutResult(status -> markInvitationsAsExpired());
    }

    private void markInvitationsAsExpired() {
        long numberOfUpdatedInvitations = userInvitationRepository.markInvitationsAsExpired();
        log.info("Number of invitations marked as expired: {}", numberOfUpdatedInvitations);
    }

}
