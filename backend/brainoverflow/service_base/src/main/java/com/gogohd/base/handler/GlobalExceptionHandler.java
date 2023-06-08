package com.gogohd.base.handler;

import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

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
}
