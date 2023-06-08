package com.gogohd.ucenter.entity.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserInfoVo {
    @ApiModelProperty(value = "The username of user")
    private String username;

    @ApiModelProperty(value = "The email address of user")
    private String email;
}
