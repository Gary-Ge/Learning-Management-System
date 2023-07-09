package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Staff;

import java.util.List;

public interface StaffService extends IService<Staff> {
    void createStaff(String userId, String courseId);

    Object getStaffedCourseListByUserId(String userId);

    Object getStaffedStreamListDateByUserId(String userId);
}
