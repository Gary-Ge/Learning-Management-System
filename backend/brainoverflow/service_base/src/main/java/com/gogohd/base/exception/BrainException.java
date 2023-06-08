package com.gogohd.base.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrainException extends RuntimeException {
    private Integer code;

    private String message;
}
