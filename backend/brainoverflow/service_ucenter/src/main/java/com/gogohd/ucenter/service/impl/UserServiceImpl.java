package com.gogohd.ucenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.*;
import com.gogohd.ucenter.entity.User;
import com.gogohd.ucenter.entity.vo.*;
import com.gogohd.ucenter.mapper.UserMapper;
import com.gogohd.ucenter.service.UserService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    private final String EMPTY_USERNAME = "Username cannot be empty";
    private final String EMPTY_PASSWORD = "Password cannot be empty";
    private final String EMPTY_EMAIL = "Email address cannot be empty";
    private final String ILLEGAL_PASSWORD = "Password should be at least 8 characters long, " +
            "with 1 uppercase letter, 1 lowercase letter and 1 number";
    private final String ILLEGAL_EMAIL = "Incorrect email address format";
    private final String EMAIL_EXISTS = "Email address already registered";
    private final String USER_NOT_EXISTS = "User not exist";
    private final String EMAIL_NOT_EXISTS = "Email address not exist";

    @Override
    public String register(RegisterVo registerVo) {
        String username = registerVo.getUsername();
        String password = registerVo.getPassword();
        String email = registerVo.getEmail();

        // Check if some value is empty
        if (ObjectUtils.isEmpty(username)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_USERNAME);
        }
        if (ObjectUtils.isEmpty(password)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_PASSWORD);
        }
        if (ObjectUtils.isEmpty(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_EMAIL);
        }

        // Check the validity of password
        if (!ArgsValidator.isValidPassword(password)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_PASSWORD);
        }

        // Check the validity of email address
        if (!ArgsValidator.isValidEmail(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_EMAIL);
        }

        // Check if the email address is already registered
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, email);
        if (baseMapper.selectCount(wrapper) > 0) {
            throw new BrainException(ResultCode.ERROR, EMAIL_EXISTS);
        }

        // Add new user to database
        User user = new User();
        user.setUsername(username);

        // Encrypt the password using SHA256
        user.setPassword(DigestUtils.sha256Hex(password));

        user.setEmail(email);
        user.setAvatar("https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/default/default-avatar.svg");

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
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_EMAIL);
        }
        if (ObjectUtils.isEmpty(password)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_PASSWORD);
        }


        if (!ArgsValidator.isValidEmail(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_EMAIL);
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

        return jwtUtils.generateJwtToken(user.getUserId());
    }

    @Override
    public HashMap<String, String> getUserById(String userId) {
        // Check the validity of userId
        User user = baseMapper.selectById(userId);

        if (user == null) {
            throw new BrainException(ResultCode.ERROR, USER_NOT_EXISTS);
        }

        HashMap<String, String> result = new HashMap<>();
        result.put("userId", user.getUserId());
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
            throw new BrainException(ResultCode.ERROR, USER_NOT_EXISTS);
        }

        // Check the validity of not null value
        if (!ObjectUtils.isEmpty(email)) {
            if (!ArgsValidator.isValidEmail(email)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_EMAIL);
            }
            // If the new email address is not equal to the old one, check if the new email address is exist
            if (!email.equals(user.getEmail())) {
                LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
                wrapper.eq(User::getEmail, email);
                if (baseMapper.selectCount(wrapper) > 0) {
                    throw new BrainException(ResultCode.ERROR, EMAIL_EXISTS);
                }
            }
        }

        String encrypt = null;
        if (!ObjectUtils.isEmpty(password)) {
            if (!ArgsValidator.isValidPassword(password)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_PASSWORD);
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
        if (baseMapper.updateById(user) == 0) {
            throw new BrainException(ResultCode.ERROR, "Update user information failed");
        }
    }

    @Override
    public void checkEmailAddress(String email) {
        // Check if the email address is empty
        if (ObjectUtils.isEmpty(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_EMAIL);
        }

        // Check if the email address has a bad format
        if (!ArgsValidator.isValidEmail(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_EMAIL);
        }

        // Check if the email address exists
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, email);
        if (baseMapper.selectCount(wrapper) == 0) {
            throw new BrainException(ResultCode.ERROR, EMAIL_NOT_EXISTS);
        }

        // If there is an active verification code, do not send again
        if (stringRedisTemplate.opsForValue().get(email) != null) {
            throw new BrainException(ResultCode.TOO_MANY_REQUESTS, "Your requests are too frequent. " +
                    "Please wait for 60 seconds before trying again.");
        }

        // Generate a verification code
        String code = RandomUtils.generateVerificationCode();
        System.out.println(code);
        // Save the code to redis
        stringRedisTemplate.opsForValue().set(email, code, 60, TimeUnit.SECONDS);
        // Send verification code
        SendEmailUtils.sendVerificationCode(email, code);
    }

    @Override
    public void verifyCode(VerifyCodeVo verifyCodeVo) {
        String email = verifyCodeVo.getEmail();
        String code = verifyCodeVo.getCode();

        // Check if the email address and code are null
        if (ObjectUtils.isEmpty(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_EMAIL);
        }
        if (ObjectUtils.isEmpty(code)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Verification code cannot be empty");
        }

        // Check if the email address has a bad format
        if (!ArgsValidator.isValidEmail(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_EMAIL);
        }

        // Check if the code input by user is correct
        if (!code.equals(stringRedisTemplate.opsForValue().get(email))) {
            throw new BrainException(ResultCode.ERROR, "Incorrect verification code");
        }
    }

    @Override
    public void updatePassword(UpdatePasswordVo updatePasswordVo) {
        String email = updatePasswordVo.getEmail();
        String password = updatePasswordVo.getPassword();

        // Check if the email address and password are null
        if (ObjectUtils.isEmpty(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_EMAIL);
        }
        if (ObjectUtils.isEmpty(password)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_PASSWORD);
        }

        // Check if the email address has a bad format
        if (!ArgsValidator.isValidEmail(email)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_EMAIL);
        }
        // Check the validity of password
        if (!ArgsValidator.isValidPassword(password)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_PASSWORD);
        }

        // Check if the email address exists
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, email);
        User user = baseMapper.selectOne(wrapper);
        if (user == null) {
            throw new BrainException(ResultCode.ERROR, EMAIL_NOT_EXISTS);
        }

        // Update the password
        User userUpdate = new User();
        userUpdate.setUserId(user.getUserId());
        userUpdate.setPassword(DigestUtils.sha256Hex(password));

        if (baseMapper.updateById(userUpdate) == 0) {
            throw new BrainException(ResultCode.ERROR, "Update user password failed");
        }
    }

    @Override
    public String uploadAvatar(String userId, MultipartFile file) {
        if (file == null) {
            throw new BrainException(ResultCode.ERROR, "No file");
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be null");
        }
        String filenameLower = filename.toLowerCase();
        if (filenameLower.endsWith(".bmp") || filenameLower.endsWith(".jpg") || filenameLower.endsWith(".jpeg") ||
                filenameLower.endsWith("png")) {
            // Generate a UUID for each avatar and use the UUID as filename, pretending file overwriting
            String extension = filename.substring(filename.lastIndexOf("."));
            String objectName = "avatar/" + userId + "/" + RandomUtils.generateUUID() + extension;
            // Upload the avatar
            OssUtils.uploadFile(file, objectName, filename, true);
            // Return the avatar URL
            return "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/" + objectName;
        } else {
            throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "Unsupported file format. The avatar " +
                    "should be jpg, jpeg, png or bmp");
        }
    }

    @Override
    public List<Map<String, String>> getUserListByIds(List<String> userIds) {
        return baseMapper.selectBatchIds(userIds).stream()
                .map(user -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("userId", user.getUserId());
                    map.put("username", user.getUsername());
                    map.put("email", user.getEmail());
                    map.put("avatar", user.getAvatar());
                    return map;
                }).collect(Collectors.toList());
    }
}
