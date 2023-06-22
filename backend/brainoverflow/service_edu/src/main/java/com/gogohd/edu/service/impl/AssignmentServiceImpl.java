package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.DateTimeUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Assignment;
import com.gogohd.edu.entity.Course;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.entity.vo.CreateAssignmentVo;
import com.gogohd.edu.mapper.AssignmentMapper;
import com.gogohd.edu.mapper.CategoryMapper;
import com.gogohd.edu.mapper.CourseMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.Date;

@Service
public class AssignmentServiceImpl extends ServiceImpl<AssignmentMapper, Assignment> implements AssignmentService {
    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Override
    public String createAssignment(String userId, String courseId, CreateAssignmentVo createAssignmentVo) {
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.ERROR, "Course not exist");
        }

        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getUserId, userId);
        wrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to create the assignment");
        }

        if (ObjectUtils.isEmpty(createAssignmentVo.getTitle())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment title cannot be empty");
        }
        if (ObjectUtils.isEmpty(createAssignmentVo.getDescription())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment description cannot be empty");
        }
        if (ObjectUtils.isEmpty(createAssignmentVo.getStart())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment start time cannot be empty");
        }
        if (ObjectUtils.isEmpty(createAssignmentVo.getEnd())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment end time cannot be empty");
        }

        Assignment assignment = new Assignment();
        assignment.setTitle(createAssignmentVo.getTitle());
        assignment.setDescription(createAssignmentVo.getDescription());

        assignment.setStart(DateTimeUtils.stringToDateTime(createAssignmentVo.getStart()));
        assignment.setEnd(DateTimeUtils.stringToDateTime(createAssignmentVo.getEnd()));

        assignment.setCourseId(courseId);

        baseMapper.insert(assignment);

        return assignment.getAssignmentId();
    }
}
