package com.gogohd.base.interceptor;

import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.JwtUtils;
import com.gogohd.base.utils.ResultCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtils jwtUtils;

    private static final String AUTH_HEADER = "Authorization";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader(AUTH_HEADER);
        if (ObjectUtils.isEmpty(token)) {
            throw new BrainException(ResultCode.NO_TOKEN, "No token");
        }

        if (!token.startsWith("Bearer")) {
            throw new BrainException(ResultCode.INVALID_OR_EXPIRED_TOKEN, "Token should start with \"Bearer\"");
        }

        token = token.substring(7);

        String id = jwtUtils.getUserIdFromToken(token);
        request.setAttribute("userId", id);
        return true;
    }
}
