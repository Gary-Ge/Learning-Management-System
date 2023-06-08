package com.gogohd.ucenter.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.ucenter.entity.User;
import com.gogohd.ucenter.entity.vo.LoginVo;
import com.gogohd.ucenter.entity.vo.RegisterVo;
import com.gogohd.ucenter.entity.vo.UserInfoVo;

import javax.servlet.http.HttpServletRequest;

public interface UserService extends IService<User> {
    String register(RegisterVo registerVo);

    String login(LoginVo loginVo);

    UserInfoVo getUserById(String userId);
}
