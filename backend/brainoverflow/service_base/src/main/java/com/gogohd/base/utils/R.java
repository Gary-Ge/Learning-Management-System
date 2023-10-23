package com.gogohd.base.utils;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class R {

    @Schema(description = "The request is success or not")
    private boolean success;

    @Schema(description = "The status code")
    private Integer code;

    @Schema(description = "Error or Success message, frontend can display it directly")
    private String message;

    @Schema(description = "Data returned, the data returned by API would be in this data object")
    private Map<String, Object> data = new HashMap<>();

    private R() {}

    public static R success() {
        R r = new R();
        r.setSuccess(true);
        r.setCode(ResultCode.SUCCESS);
        r.setMessage("Success");
        return r;
    }

    public static R error() {
        R r = new R();
        r.setSuccess(false);
        r.setCode(ResultCode.ERROR);
        r.setMessage("error");
        return r;
    }

    public R success(Boolean success) {
        this.setSuccess(success);
        return this;
    }

    public R message(String message) {
        this.setMessage(message);
        return this;
    }

    public R code(Integer code) {
        this.setCode(code);
        return this;
    }

    public R data(String key, Object value) {
        this.data.put(key, value);
        return this;
    }

    public R data(Map<String, Object> map) {
        this.setData(map);
        return this;
    }
}
