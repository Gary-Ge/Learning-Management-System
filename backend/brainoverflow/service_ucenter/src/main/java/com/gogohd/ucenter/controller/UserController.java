package com.gogohd.ucenter.controller;

import com.gogohd.base.utils.R;
import com.gogohd.ucenter.entity.vo.LoginVo;
import com.gogohd.ucenter.entity.vo.RegisterVo;
import com.gogohd.ucenter.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("ucenter")
@CrossOrigin
@Tag(name = "User Center")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Register new users")
    @PostMapping("register")
    public R register(@RequestBody RegisterVo registerVo) {
        return R.success().message("Register success").data("token", userService.register(registerVo));
    }

    @Operation(summary = "Login for current users")
    @PostMapping("login")
    public R login(@RequestBody LoginVo loginVo) {
        return R.success().message("Login success").data("token", userService.login(loginVo));
    }

    @Operation(summary = "Get user information, including username, email address and avatar link")
    @GetMapping("getUser")
    public R user(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get user info success").data("user", userService.getUserById(userId));
    }

}
