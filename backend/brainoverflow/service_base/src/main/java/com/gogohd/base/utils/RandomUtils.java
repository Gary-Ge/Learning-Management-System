package com.gogohd.base.utils;

import java.util.Random;
import java.util.UUID;

public class RandomUtils {
    public static String generateVerificationCode() {
        Random random = new Random();
        Integer code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public static String generateUUID() {
        return UUID.randomUUID().toString();
    }
}
