package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.StaffService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StaffServiceImpl extends ServiceImpl<StaffMapper, Staff> implements StaffService {
    @Override
    public void createStaff(String userId, String courseId) {
        // Create new staff
        Staff staff = new Staff();
        staff.setUserId(userId);
        staff.setCourseId(courseId);

        // Insert to data table
        if (!save(staff)) {
            throw new BrainException(ResultCode.ERROR, "Add staff failed");
        }
    }

    @Override
    public Object getStaffedCourseListByUserId(String userId) {
        return baseMapper.selectCoursesWithCreators(userId).stream()
                .map(record -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("courseId", record.get("course_id"));
                    map.put("title", record.get("title"));
                    map.put("description", record.get("description"));
                    map.put("cover", record.get("cover"));
                    map.put("hasForum", record.get("has_forum"));
                    map.put("category", record.get("category_name"));
                    map.put("createdAt", record.get("created_at"));
                    map.put("updatedAt", record.get("updated_at"));

                    Map<String, Object> creator = new HashMap<>();
                    creator.put("userId", record.get("user_id"));
                    creator.put("email", record.get("email"));
                    creator.put("avatar", record.get("avatar"));
                    creator.put("username", record.get("username"));

                    map.put("creator", creator);
                    return map;
                }).collect(Collectors.toList());
    }
}
