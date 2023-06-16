package com.gogohd.ucenter.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.ucenter.entity.User;
import com.gogohd.ucenter.entity.vo.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface UserService extends IService<User> {
    String register(RegisterVo registerVo);

    String login(LoginVo loginVo);

    HashMap<String, String> getUserById(String userId);

    void updateUserById(UpdateVo updateVo, String userId);

    void checkEmailAddress(String email);

    void updatePassword(UpdatePasswordVo updatePasswordVo);

    void verifyCode(VerifyCodeVo verifyCodeVo);

    String uploadAvatar(String userId, MultipartFile file);

    List<Map<String, String>> getUserListByIds(List<String> ids);
}
