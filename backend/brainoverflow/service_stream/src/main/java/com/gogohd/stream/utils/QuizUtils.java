package com.gogohd.stream.utils;

import java.util.regex.Pattern;

public class QuizUtils {

    private static final String PATTERN_SINGLE_AB = "^[AB]$";
    private static final String PATTERN_SINGLE_ABC = "^[ABC]$";
    private static final String PATTERN_SINGLE_ABCD = "^[ABCD]$";

    private static final String PATTERN_MULTI_AB = "^(?!.*(.).*\\1)[AB]{1,2}$";
    private static final String PATTERN_MULTI_ABC = "^(?!.*(.).*\\1)[ABC]{1,3}$";
    private static final String PATTERN_MULTI_ABCD = "^(?!.*(.).*\\1)[ABCD]{1,4}$";

    public static boolean checkAnswerValidity(String answer, Integer type, int optionCount) {
        if (type == 0) {
            switch (optionCount) {
                case 2:
                    return Pattern.matches(PATTERN_SINGLE_AB, answer);
                case 3:
                    return Pattern.matches(PATTERN_SINGLE_ABC, answer);
                case 4:
                    return Pattern.matches(PATTERN_SINGLE_ABCD, answer);
            }
        } else {
            switch (optionCount) {
                case 2:
                    return Pattern.matches(PATTERN_MULTI_AB, answer);
                case 3:
                    return Pattern.matches(PATTERN_MULTI_ABC, answer);
                case 4:
                    return Pattern.matches(PATTERN_MULTI_ABCD, answer);
            }
        }
        return false;
    }
}
