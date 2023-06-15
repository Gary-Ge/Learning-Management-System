package com.gogohd.ucenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.*;
import com.gogohd.ucenter.entity.User;
import com.gogohd.ucenter.entity.vo.LoginVo;
import com.gogohd.ucenter.entity.vo.RegisterVo;
import com.gogohd.ucenter.entity.vo.UpdateVo;
import com.gogohd.ucenter.mapper.UserMapper;
import com.gogohd.ucenter.service.UserService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.HashMap;
import java.util.concurrent.TimeUnit;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

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
    public HashMap<String, String> getUserById(String userId) {
        // Check the validity of userId
        User user = baseMapper.selectById(userId);

        if (user == null) {
            throw new BrainException(ResultCode.ERROR, "User not exist");
        }

        HashMap<String, String> result = new HashMap<>();
        result.put("username", user.getUsername());
        result.put("email", user.getEmail());
        result.put("avatar", user.getAvatar());

        return result;
    }

    @Override
    public void updateUserById(UpdateVo updateVo, String userId) {
        String email = updateVo.getEmail();
        String password = updateVo.getPassword();

        // Check the validity of userId
        User user = baseMapper.selectById(userId);
        if (user == null) {
            throw new BrainException(ResultCode.ERROR, "User not exist");
        }

        // Check the validity of not null value
        if (!ObjectUtils.isEmpty(email)) {
            if (!ArgsValidator.isValidEmail(email)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Invalid email address");
            }
            // If the new email address is not equal to the old one, check if the new email address is exist
            if (!email.equals(user.getEmail())) {
                LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
                wrapper.eq(User::getEmail, email);
                if (baseMapper.selectCount(wrapper) > 0) {
                    throw new BrainException(ResultCode.ERROR, "Email address already registered");
                }
            }
        }

        String encrypt = null;
        if (!ObjectUtils.isEmpty(password)) {
            if (!ArgsValidator.isValidPassword(password)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Password should be at least 8 characters long, " +
                        "with 1 uppercase letter, 1 lowercase letter and 1 number");
            }
            encrypt = DigestUtils.sha256Hex(password);
            if (encrypt.equals(user.getPassword())) {
                throw new BrainException(ResultCode.ERROR, "The new password cannot be same as the old one");
            }
        }

        user = new User();
        BeanUtils.copyProperties(updateVo, user);
        user.setUserId(userId);
        if (encrypt != null) {
            user.setPassword(encrypt);
        }
        baseMapper.updateById(user);
    }

    @Override
    public void checkEmailAddress(String email) {
        // Check if the email address is empty
        if (ObjectUtils.isEmpty(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Please input an email address");
        }

        // Check if the email address has a bad format
        if (!ArgsValidator.isValidEmail(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Invalid email address");
        }

        // Check if the email address exists
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, email);
        if (baseMapper.selectCount(wrapper) == 0) {
            throw new BrainException(ResultCode.ERROR, "Email address not exist");
        }

        // If there is an active verification code, do not send again
        if (stringRedisTemplate.opsForValue().get(email) != null) {
            throw new BrainException(ResultCode.TOO_MANY_REQUESTS, "Your requests are too frequent. " +
                    "Please wait for 60 seconds before trying again.");
        }

        // Generate a verification code
        String code = VerificationCodeUtils.generate();
        System.out.println(code);
        // Save the code to redis
        stringRedisTemplate.opsForValue().set(email, code, 60, TimeUnit.SECONDS);
        // Send verification code
        SendEmailUtils.sendVerificationCode(email, code);
    }
}
