package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.StaffService;
import org.springframework.stereotype.Service;

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
}
