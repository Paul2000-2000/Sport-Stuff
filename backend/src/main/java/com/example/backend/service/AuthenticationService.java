package com.example.backend.service;



import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.SecureRandom;
import java.security.Key;
import java.util.Base64;


public class AuthenticationService {

    private static final String SECRET_KEY = generateSecretKey();

    private static String generateSecretKey() {

        byte[] keyBytes = new byte[32];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(keyBytes);

        return Base64.getEncoder().encodeToString(keyBytes);
    }

    public static String generateToken(String username, Long userId) {

        String userIdString = String.valueOf(userId);
        String token = Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
        return token;
    }


    public static Long extractUserIdFromToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(Base64.getDecoder().decode(SECRET_KEY)).parseClaimsJws(token);
            return claims.getBody().get("userId", Long.class);
        } catch (Exception e) {

            return null;
        }
    }
}
