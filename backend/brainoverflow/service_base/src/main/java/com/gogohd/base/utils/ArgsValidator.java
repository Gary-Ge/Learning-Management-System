package com.gogohd.base.utils;

import java.util.regex.Pattern;

public class ArgsValidator {
    public static boolean isValidPassword(String password) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$";
        return Pattern.matches(regex, password);
    }

    public static boolean isValidEmail(String email) {
        String regex = "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|" +
                "(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$";
        return Pattern.matches(regex, email);
    }

    public static boolean isValidYoutubeLink(String youtubeLink) {
        String regex = "^((?:https?:)?\\/\\/)?((?:www|m)\\.)?((?:youtube\\.com|youtu.be))(\\/(?:[\\w\\-]+\\?v=|embed" +
                "\\/|v\\/)?)([\\w\\-]+)(\\S+)?$";
        return Pattern.matches(regex, youtubeLink);
    }
}
