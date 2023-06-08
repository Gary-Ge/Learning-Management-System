package com.gogohd.ucenter.controller;

import com.gogohd.base.utils.R;
import com.gogohd.ucenter.entity.vo.LoginVo;
import com.gogohd.ucenter.entity.vo.RegisterVo;
import com.gogohd.ucenter.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/ucenter")
@CrossOrigin
@Api(tags = "User Center")
public class UserController {

    @Autowired
    private UserService userService;

    @ApiOperation("Register new users")
    @PostMapping("register")
    public R register(@RequestBody RegisterVo registerVo) {
        return R.success().message("Register success").data("token", userService.register(registerVo));
    }

    @ApiOperation("Login for current users")
    @PostMapping("login")
    public R login(@RequestBody LoginVo loginVo) {
        return R.success().message("Login success").data("token", userService.login(loginVo));
    }

    @ApiOperation("Get user information")
    @GetMapping()
    public R user(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get user info success").data("user", userService.getUserById(userId));
    }

}
