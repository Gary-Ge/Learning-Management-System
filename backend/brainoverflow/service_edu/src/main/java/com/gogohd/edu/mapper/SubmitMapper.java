package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Course;
import com.gogohd.edu.entity.Submit;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SubmitMapper extends BaseMapper<Submit> {
}
