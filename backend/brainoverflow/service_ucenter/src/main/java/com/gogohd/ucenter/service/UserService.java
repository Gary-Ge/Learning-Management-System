package com.gogohd.ucenter.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.ucenter.entity.User;
import com.gogohd.ucenter.entity.vo.LoginVo;
import com.gogohd.ucenter.entity.vo.RegisterVo;
import com.gogohd.ucenter.entity.vo.UpdateVo;

import java.util.HashMap;

public interface UserService extends IService<User> {
    String register(RegisterVo registerVo);

    String login(LoginVo loginVo);

    HashMap<String, String> getUserById(String userId);

    void updateUserById(UpdateVo updateVo, String userId);
}
