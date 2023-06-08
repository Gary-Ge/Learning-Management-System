package com.gogohd.base.utils;

import com.gogohd.base.exception.BrainException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
public class JwtUtils {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    public static final long EXPIRE = 60 * 60 * 24 * 15;

    public static final String APP_SECRET = "ukc8BDbRigUDaY6pZFfWus2jZWLPHO";

    private void saveToken(String id, String token) {
        stringRedisTemplate.opsForValue().set(id, token, EXPIRE, TimeUnit.SECONDS);
        stringRedisTemplate.opsForValue().set(token, id, EXPIRE, TimeUnit.SECONDS);
    }

    public String generateJwtToken(String id) {

        String token = Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setHeaderParam("alg", "HS256")
                .setSubject("brainoverflow-user")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE * 1000))
                .claim("id", id)
                .signWith(SignatureAlgorithm.HS256, APP_SECRET)
                .compact();

        saveToken(id, token);

        return token;
    }

    public String getTokenFromUserId(String id) {
        String token = stringRedisTemplate.opsForValue().get(id);
        if (token == null) {
            // If the token is expired, generate a new one
            return generateJwtToken(id);
        } else {
            // Reset the expiring date of token
            saveToken(id, token);
            return token;
        }
    }

    public String getUserIdFromToken(String token) {
        String id = stringRedisTemplate.opsForValue().get(token);
        if (id == null) {
            throw new BrainException(ResultCode.INVALID_OR_EXPIRED_TOKEN, "Invalid token or token is expired");
        }
        // Reset the expiring date of token
        saveToken(id, token);
        return id;
    }
}
