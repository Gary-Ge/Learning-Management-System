package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Section;
import com.gogohd.edu.entity.vo.CreateTextSectionVo;
import com.gogohd.edu.entity.vo.UpdateTextSectionVo;

import java.util.Map;

public interface SectionService extends IService<Section> {
    String createTextSection(String userId, String courseId, CreateTextSectionVo createTextSectionVo);

    void updateTextSectionById(String userId, String sectionId, UpdateTextSectionVo updateTextSectionVo);

    void deleteSection(String userId, String sectionId);

    Map<String, Object> getTextSectionById(String userId, String sectionId);
}
