package com.gogohd.edu.client;

import com.gogohd.base.utils.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient("service-ucenter")
public interface OpenFeignClient {
    @GetMapping("/ucenter/user/{userId}")
    R getUser(@PathVariable String userId, @RequestHeader("Authorization") String token);

    @GetMapping("/ucenter/users/{userIds}")
    R getUsers(@PathVariable String userIds, @RequestHeader("Authorization") String token);
}
