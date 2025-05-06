package com.raceIQ.authentication.task;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.raceIQ.authentication.repository.PasswordResetTokenRepository;

@Component
public class TokenCleanupTask {
    

    @Autowired
    private PasswordResetTokenRepository tokenRepo;


    @Scheduled(fixedRateString = "${token.cleanup.interval}")

    public void deleteExpiredTokens() {
        System.out.println("Running scheduled cleanup task...");
        tokenRepo.deleteByExpirationLessThan(LocalDateTime.now());
    }
}
