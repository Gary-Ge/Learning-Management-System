package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Resource;
import com.gogohd.edu.entity.Section;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.entity.vo.CreateTextSectionVo;
import com.gogohd.edu.entity.vo.UpdateTextSectionVo;
import com.gogohd.edu.mapper.ResourceMapper;
import com.gogohd.edu.mapper.SectionMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.SectionService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SectionServiceImpl extends ServiceImpl<SectionMapper, Section> implements SectionService {

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private ResourceMapper resourceMapper;
    @Override
    public String createTextSection(String userId, String courseId, CreateTextSectionVo createTextSectionVo) {
        // Check if this user has the authority to create section for this course
        LambdaQueryWrapper<Staff> staffWrapper = new LambdaQueryWrapper<>();
        staffWrapper.eq(Staff::getUserId, userId);
        staffWrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(staffWrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to create lesson for this course");
        }

        String title = createTextSectionVo.getTitle();
        String description = createTextSectionVo.getDescription();
        if (ObjectUtils.isEmpty(title)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Lesson title cannot be empty");
        }
        if (ObjectUtils.isEmpty(description)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Lesson content cannot be empty");
        }

        // Construct a new section
        Section section = new Section();
        BeanUtils.copyProperties(createTextSectionVo, section);
        section.setType(0);
        section.setCourseId(courseId);
        section.setCreatedBy(userId);
        section.setUpdatedBy(userId);

        if (!save(section)) {
            throw new BrainException(ResultCode.ERROR, "Create text lesson failed");
        }
        return section.getSectionId();
    }

    @Override
    public void updateTextSectionById(String userId, String sectionId, UpdateTextSectionVo updateTextSectionVo) {
        checkSectionValidity(userId, sectionId, "You have no authority to update this section");

        // Update the section
        Section section = new Section();
        BeanUtils.copyProperties(updateTextSectionVo, sectionId);
        section.setSectionId(sectionId);
        section.setUpdatedBy(userId);
        if (baseMapper.updateById(section) != 1) {
            throw new BrainException(ResultCode.ERROR, "Update section failed");
        }
    }

    @Override
    @Transactional
    public void deleteSection(String userId, String sectionId) {
        checkSectionValidity(userId, sectionId, "You have no authority to delete this section");

        // Delete all the resources related to this section
        LambdaQueryWrapper<Resource> resourceWrapper = new LambdaQueryWrapper<>();
        resourceWrapper.eq(Resource::getSectionId, sectionId);
        resourceMapper.delete(resourceWrapper);

        // Delete this section
        if (baseMapper.deleteById(sectionId) != 1) {
            throw new BrainException(ResultCode.ERROR, "Delete section failed");
        }
    }

    @Override
    public Map<String, Object> getTextSectionById(String userId, String sectionId) {
        // Check if this section exists
        Section section = baseMapper.selectById(sectionId);
        if (section == null) {
            throw new BrainException(ResultCode.ERROR, "Section not exist");
        }

        // Check if this user has authority to delete this section
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, section.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to get this section's information");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("sectionId", section.getSectionId());
        result.put("title", section.getTitle());
        result.put("description", section.getDescription());
        result.put("createdAt", section.getCreatedAt());
        result.put("updatedAt", section.getUpdatedAt());

        // Get the resources of this section, if any
        LambdaQueryWrapper<Resource> resourceWrapper = new LambdaQueryWrapper<>();
        resourceWrapper.eq(Resource::getSectionId, sectionId);
        List<Map<String, String>> resources = resourceMapper.selectList(resourceWrapper).stream()
                .map(resource -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("resourceId", resource.getResourceId());
                    map.put("title", resource.getTitle());

                    return map;
                }).collect(Collectors.toList());

        result.put("resources", resources);

        return result;
    }

    private void checkSectionValidity(String userId, String sectionId, String noAuthority) {
        // Check if this section exists
        Section section = baseMapper.selectById(sectionId);
        if (section == null) {
            throw new BrainException(ResultCode.ERROR, "Section not exist");
        }

        // Check if this user has authority to delete this section
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, section.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, noAuthority);
        }
    }
}
