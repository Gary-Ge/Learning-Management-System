package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
