package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Question;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QuestionMapper extends BaseMapper<Question> {
}
