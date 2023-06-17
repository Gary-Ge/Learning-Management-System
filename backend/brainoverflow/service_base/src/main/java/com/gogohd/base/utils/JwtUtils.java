package com.gogohd.base.utils;

import com.gogohd.base.exception.BrainException;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {
    public static final long EXPIRE = 60L * 60 * 24 * 30 * 1000;

    public static final String APP_SECRET = "ukc8BDbRigUDaY6pZFfWus2jZWLPHO";

    public String generateJwtToken(String id) {

        return Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setHeaderParam("alg", "HS256")
                .setSubject("brainoverflow-user")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE))
                .claim("id", id)
                .signWith(SignatureAlgorithm.HS256, APP_SECRET)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(APP_SECRET)
                    .parseClaimsJws(token)
                    .getBody();
            System.out.println((String) claims.get("id"));
            return (String) claims.get("id");
        } catch (ExpiredJwtException e) {
            throw new BrainException(ResultCode.INVALID_OR_EXPIRED_TOKEN, "Expired token");
        } catch (JwtException e) {
            throw new BrainException(ResultCode.INVALID_OR_EXPIRED_TOKEN, "Invalid token");
        }
    }
}
