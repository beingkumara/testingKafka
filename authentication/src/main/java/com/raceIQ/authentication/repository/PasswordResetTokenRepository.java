package com.raceIQ.authentication.repository;
import java.time.LocalDateTime;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.raceIQ.authentication.models.PasswordResetToken;
public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    public PasswordResetToken findByToken(String token);
    public PasswordResetToken findByUserId(String userId);

    public void deleteByExpirationLessThan(LocalDateTime now);
}
