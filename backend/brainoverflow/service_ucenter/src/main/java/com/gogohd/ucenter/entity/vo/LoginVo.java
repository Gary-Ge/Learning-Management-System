package com.gogohd.ucenter.entity.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class LoginVo {
    @ApiModelProperty(value = "Email address of user")
    private String email;

    @ApiModelProperty(value = "Password of user")
    private String password;
}
