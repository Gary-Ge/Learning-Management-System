package com.gogohd.base.handler;

import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.R;
import com.gogohd.base.utils.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.SocketTimeoutException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler
    @ResponseBody
    public R error(Exception e) {
        e.printStackTrace();
        return R.error().message("Unknown Exception");
    }

    @ExceptionHandler(BrainException.class)
    @ResponseBody
    public R error(BrainException e) {
        log.error(e.getMessage());
        e.printStackTrace();
        return R.error().code(e.getCode()).message(e.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseBody
    public R error(HttpMessageNotReadableException e) {
        log.error(e.getMessage());
        e.printStackTrace();
        return R.error().code(ResultCode.ERROR).message("Invalid format");
    }

    @ExceptionHandler(SocketTimeoutException.class)
    @ResponseBody
    public R error(SocketTimeoutException e) {
        e.printStackTrace();
        return R.error().code(ResultCode.ERROR).message("Response took too long");
    }
}
