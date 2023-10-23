package com.gogohd.stream.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.stream.entity.Question;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QuestionMapper extends BaseMapper<Question> {
}
