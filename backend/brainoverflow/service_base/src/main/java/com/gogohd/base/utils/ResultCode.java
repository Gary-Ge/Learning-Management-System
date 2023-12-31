package com.gogohd.base.utils;

public interface ResultCode {

    public static Integer SUCCESS = 20000;

    public static Integer ERROR = 20001;

    public static Integer ILLEGAL_ARGS = 20002;

    public static Integer INVALID_OR_EXPIRED_TOKEN = 20003;

    public static Integer NO_TOKEN = 20004;

    public static Integer TOO_MANY_REQUESTS = 20005;

    public static Integer SEND_EMAIL_ERROR = 20006;

    public static Integer UPLOAD_FILE_ERROR = 20007;

    public static Integer NO_AUTHORITY = 20008;

    public static Integer NOT_FOUND = 20009;
}
