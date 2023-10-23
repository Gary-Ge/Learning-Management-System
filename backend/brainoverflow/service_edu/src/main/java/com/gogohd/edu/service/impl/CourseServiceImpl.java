package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.OssUtils;
import com.gogohd.base.utils.R;
import com.gogohd.base.utils.RandomUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.client.OpenFeignClient;
import com.gogohd.edu.entity.*;
import com.gogohd.edu.entity.vo.CreateCourseVo;
import com.gogohd.edu.entity.vo.UpdateCourseVo;
import com.gogohd.edu.mapper.*;
import com.gogohd.edu.service.CourseService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CourseServiceImpl extends ServiceImpl<CourseMapper, Course> implements CourseService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private OpenFeignClient openFeignClient;

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private SectionMapper sectionMapper;

    @Autowired
    private ResourceMapper resourceMapper;

    private final String TITLE_EXISTS = "Course title has been used, please change the course title";

    @Override
    @Transactional
    public String createCourse(String userId, CreateCourseVo createCourseVo) {
        String title = createCourseVo.getTitle();
        String category = createCourseVo.getCategory();
        String description = createCourseVo.getDescription();
        String cover = createCourseVo.getCover();

        // Check if the required parameters are null
        if (ObjectUtils.isEmpty(title)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Course title cannot be empty");
        }
        if (ObjectUtils.isEmpty(category)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Course category cannot be empty");
        }
        if (ObjectUtils.isEmpty(description)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Course description cannot be empty");
        }

        // Check if there is a course with same name
        LambdaQueryWrapper<Course> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Course::getTitle, title);
        if (baseMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.ERROR, TITLE_EXISTS);
        }

        // Check if this category exists
        LambdaQueryWrapper<Category> categoryWrapper = new LambdaQueryWrapper<>();
        categoryWrapper.eq(Category::getCategoryName, category);
        Category cate = categoryMapper.selectOne(categoryWrapper);

        if (cate == null) {
            // If there is no such category, create a new one
            cate = new Category();
            cate.setCategoryName(category);
            cate.setCreatedBy(userId);

            if (categoryMapper.insert(cate) != 1) {
                throw new BrainException(ResultCode.ERROR, "Create category failed");
            }
        }

        String categoryId = cate.getCategoryId();

        // Create the new course
        Course course = new Course();
        BeanUtils.copyProperties(createCourseVo, course);

        // Set the category id
        course.setCategoryId(categoryId);
        // Set creator and updater
        course.setCreatedBy(userId);
        course.setUpdatedBy(userId);
        // If the cover is not provided, use the default one
        if (ObjectUtils.isEmpty(cover)) {
            course.setCover("https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/cover/default/default-cover.jpg");
        }

        // Insert to data table
        if (!save(course)) {
            throw new BrainException(ResultCode.ERROR, "Create course failed");
        }

        // Get the courseId of the newly created course
        String courseId = course.getCourseId();
        // Add this user as the first staff of this course
        Staff staff = new Staff();
        staff.setCourseId(courseId);
        staff.setUserId(userId);
        if (staffMapper.insert(staff) != 1) {
            throw new BrainException(ResultCode.ERROR, "Add staff failed");
        }

        return courseId;
    }

    @Override
    public Map<String, Object> getCourseById(String courseId, String token) {
        Course course = baseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course not exist");
        }

        // Construct the result
        Map<String, Object> result = new HashMap<>();
        result.put("courseId", course.getCourseId());
        result.put("title", course.getTitle());
        result.put("description", course.getDescription());
        result.put("cover", course.getCover());
        result.put("hasForum", course.isHasForum());
        result.put("createdAt", course.getCreatedAt());
        result.put("updatedAt", course.getUpdatedAt());

        // Fetch the information of course category
        Category category = categoryMapper.selectById(course.getCategoryId());
        result.put("category", category.getCategoryName());

        // Fetch the information of course creator
        R creatorResponse;
        try {
            creatorResponse = openFeignClient.getUser(course.getCreatedBy(), token);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BrainException(ResultCode.ERROR, "Fetch creator information failed");
        }
        Object creator = creatorResponse.getData().get("user");
        result.put("creator", creator);

        return result;
    }

    @Override
    public Object getStaffListByCourseId(String courseId, String token) {
        Course course = baseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course not exist");
        }

        // Get the staff Ids
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, courseId);
        List<String> userIdsList = staffMapper.selectList(wrapper).stream()
                .map(Staff::getUserId)
                .collect(Collectors.toList());

        // Fetch user information of these staffs
        String userIds = String.join(",", userIdsList);
        R staffsResponse;
        try {
            staffsResponse = openFeignClient.getUsers(userIds, token);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BrainException(ResultCode.ERROR, "Fetch staffs information failed");
        }
        return staffsResponse.getData().get("users");
    }

    @Override
    @Transactional
    public void updateCourseById(String userId, String courseId, UpdateCourseVo updateCourseVo) {
        // Check if this user has the authority to update the course information
        LambdaQueryWrapper<Staff> staffWrapper = new LambdaQueryWrapper<>();
        staffWrapper.eq(Staff::getUserId, userId);
        staffWrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(staffWrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to update this course");
        }

        String title = updateCourseVo.getTitle();
        if (!ObjectUtils.isEmpty(title)) {
            // Check if the new title has been used by other courses
            LambdaQueryWrapper<Course> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Course::getTitle, title);
            wrapper.ne(Course::getCourseId, courseId);
            if (baseMapper.exists(wrapper)) {
                throw new BrainException(ResultCode.ERROR, TITLE_EXISTS);
            }
        }

        Course course = new Course();
        BeanUtils.copyProperties(updateCourseVo, course);
        course.setCourseId(courseId);
        course.setUpdatedBy(userId);

        String category = updateCourseVo.getCategory();
        if (!ObjectUtils.isEmpty(category)) {
            // If category is not empty, check if the category provided exists
            LambdaQueryWrapper<Category> categoryWrapper = new LambdaQueryWrapper<>();
            categoryWrapper.eq(Category::getCategoryName, category);
            Category cate = categoryMapper.selectOne(categoryWrapper);

            if (cate == null) {
                // If there is no such category, create a new one
                cate = new Category();
                cate.setCategoryName(category);
                cate.setCreatedBy(userId);

                if (categoryMapper.insert(cate) != 1) {
                    throw new BrainException(ResultCode.ERROR, "Create category failed");
                }
            }

            course.setCategoryId(cate.getCategoryId());
        }

        // Update course
        if (!updateById(course)) {
            throw new BrainException(ResultCode.ERROR, "Update course information failed");
        }
    }

    @Override
    public String uploadCover(String userId, MultipartFile file) {
        if (file == null) {
            throw new BrainException(ResultCode.ERROR, "No file");
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be null");
        }
        String filenameLower = filename.toLowerCase();
        if (filenameLower.endsWith(".bmp") || filenameLower.endsWith(".jpg") || filenameLower.endsWith(".jpeg") ||
                filenameLower.endsWith("png")) {
            // Generate a UUID for each cover and use the UUID as filename, pretending file overwriting
            String extension = filename.substring(filename.lastIndexOf("."));
            String objectName = "cover/" + userId + "/" + RandomUtils.generateUUID() + extension;
            // Upload the avatar
            OssUtils.uploadFile(file, objectName, filename, true);
            // Return the avatar URL
            return "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/" + objectName;
        } else {
            throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "Unsupported file format. The cover " +
                    "should be jpg, jpeg, bmp or png");
        }
    }

    @Override
    public Object getStudentListByCourseId(String courseId, String token) {
        Course course = baseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course not exist");
        }
        // Get the student ids
        LambdaQueryWrapper<Student> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Student::getCourseId, courseId);
        List<String> userIdsList = studentMapper.selectList(wrapper).stream()
                .map(Student::getUserId)
                .collect(Collectors.toList());

        // Fetch user information of these students
        String userIds = String.join(",", userIdsList);
        R staffsResponse;
        try {
            staffsResponse = openFeignClient.getUsers(userIds, token);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BrainException(ResultCode.ERROR, "Fetch students information failed");
        }
        return staffsResponse.getData().get("users");
    }

    @Override
    public List<Map<String, Object>> getAllCourses(String userId) {
        return baseMapper.selectAllCourses(userId).stream()
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

    @Override
    public Object searchCourses(String userId, String keyword) {
        return baseMapper.searchCoursesByName(userId, keyword).stream()
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

    @Override
    public List<Map<String, Object>> selectCourseWithMaterials(String courseId, String keyword) {
        // Retrieve the course by courseId
        Course course = baseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course not found");
        }

        LambdaQueryWrapper<Section> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Section::getCourseId, courseId);
        wrapper.orderByAsc(Section::getCreatedAt);

        return sectionMapper.selectList(wrapper).stream()
                .filter(section -> {
                    String title = section.getTitle();
                    return title.toUpperCase().contains(keyword.toUpperCase());
                })
                .map(section -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("sectionId", section.getSectionId());
                    result.put("title", section.getTitle());
                    result.put("description", section.getDescription());
                    result.put("createdAt", section.getCreatedAt());
                    result.put("updatedAt", section.getUpdatedAt());

                    // Get the resources of this section, if any
                    LambdaQueryWrapper<Resource> resourceWrapper = new LambdaQueryWrapper<>();
                    resourceWrapper.eq(Resource::getSectionId, section.getSectionId());
                    result.put("resources", resourceMapper.selectList(resourceWrapper).stream()
                            .map(resource -> {
                                Map<String, String> map = new HashMap<>();
                                map.put("resourceId", resource.getResourceId());
                                map.put("title", resource.getTitle());
                                map.put("type", resource.getType() == 0 ? "File" : "Video");

                                return map;
                            }).collect(Collectors.toList()));

                    switch (section.getType()) {
                        case 0:
                            result.put("type", "Text Section");
                            result.put("cover", null);
                            result.put("youtubeLink", null);
                            break;
                        case 1:
                            result.put("type", "YouTube Video Section");
                            result.put("cover", null);
                            result.put("youtubeLink", section.getYoutubeLink());
                            break;
                        case 2:
                            result.put("type", "Custom Video Section");
                            result.put("cover", section.getCover());
                            result.put("youtubeLink", null);
                            break;
                        default:
                            break;
                    }

                    return result;
                }).collect(Collectors.toList());
    }

}
