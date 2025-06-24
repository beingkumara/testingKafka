package com.f1nity.authentication.utils;
import java.security.SecureRandom;
import org.springframework.stereotype.Service;

@Service
public class SecureOTPGenerator {
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int OTP_LENGTH = 6;

    public static String generateSecureOTP() {
        StringBuilder otp = new StringBuilder();

        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(secureRandom.nextInt(10)); // digits 0-9
        }

        return otp.toString();
    }

}
