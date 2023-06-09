package com.gogohd.ucenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ArgsValidator;
import com.gogohd.base.utils.JwtUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.ucenter.entity.User;
import com.gogohd.ucenter.entity.vo.LoginVo;
import com.gogohd.ucenter.entity.vo.RegisterVo;
import com.gogohd.ucenter.entity.vo.UserInfoVo;
import com.gogohd.ucenter.mapper.UserMapper;
import com.gogohd.ucenter.service.UserService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.servlet.http.HttpServletRequest;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public String register(RegisterVo registerVo) {
        String username = registerVo.getUsername();
        String password = registerVo.getPassword();
        String email = registerVo.getEmail();

        // Check if some value is empty
        if (ObjectUtils.isEmpty(username)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Username cannot be empty");
        }
        if (ObjectUtils.isEmpty(password)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Password cannot be empty");
        }
        if (ObjectUtils.isEmpty(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Email address cannot be empty");
        }

        // Check the validity of password
        if (!ArgsValidator.isValidPassword(password)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Password should be at least 8 characters long, " +
                    "with 1 uppercase letter, 1 lowercase letter and 1 number");
        }

        // Check the validity of email address
        if (!ArgsValidator.isValidEmail(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Invalid email address");
        }

        // Check if the email address is already registered
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, email);
        if (baseMapper.selectCount(wrapper) > 0) {
            throw new BrainException(ResultCode.ERROR, "Email address already registered");
        }

        // Add new user to database
        User user = new User();
        user.setUsername(username);

        // Encrypt the password using SHA256
        user.setPassword(DigestUtils.sha256Hex(password));

        user.setEmail(email);
        user.setAvatar("default");

        if (baseMapper.insert(user) > 0) {
            return jwtUtils.generateJwtToken(user.getUserId());
        } else {
            throw new BrainException(ResultCode.ERROR, "Register failed");
        }
    }

    @Override
    public String login(LoginVo loginVo) {
        String email = loginVo.getEmail();
        String password = loginVo.getPassword();

        // Check if some value is empty
        if (ObjectUtils.isEmpty(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Email address cannot be empty");
        }
        if (ObjectUtils.isEmpty(password)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Password cannot be empty");
        }


        if (!ArgsValidator.isValidEmail(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Invalid email address");
        }

        // Encrypt the password using SHA256
        String encrypted = DigestUtils.sha256Hex(password);

        // Check if the user with given email address and password is existed
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, email);
        wrapper.eq(User::getPassword, encrypted);

        User user = baseMapper.selectOne(wrapper);
        if (user == null) {
            throw new BrainException(ResultCode.ERROR, "Incorrect email address or incorrect password");
        }

        return jwtUtils.getTokenFromUserId(user.getUserId());
    }

    @Override
    public UserInfoVo getUserById(String userId) {
        User user = baseMapper.selectById(userId);

        UserInfoVo userInfoVo = new UserInfoVo();
        userInfoVo.setUsername(user.getUsername());
        userInfoVo.setEmail(user.getEmail());
        userInfoVo.setAvatar(user.getAvatar());

        return userInfoVo;
    }
}
