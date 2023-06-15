package com.gogohd.base.utils;

import java.util.Random;

public class VerificationCodeUtils {
    public static String generate() {
        Random random = new Random();
        Integer code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
