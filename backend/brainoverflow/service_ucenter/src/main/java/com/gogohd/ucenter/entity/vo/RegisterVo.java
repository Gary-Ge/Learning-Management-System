package com.gogohd.ucenter.entity.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class RegisterVo {
    @ApiModelProperty(value = "The username of new user")
    private String username;

    @ApiModelProperty(value = "The password of new user")
    private String password;

    @ApiModelProperty(value = "The email address of new user")
    private String email;
}
