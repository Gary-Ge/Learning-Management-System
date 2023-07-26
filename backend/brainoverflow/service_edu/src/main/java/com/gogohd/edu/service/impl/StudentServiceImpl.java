package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.OssUtils;
import com.gogohd.base.utils.RandomUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.*;
import com.gogohd.edu.mapper.*;
import com.gogohd.edu.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl extends ServiceImpl<StudentMapper, Student> implements StudentService {
    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private AssignmentMapper assignmentMapper;

    @Autowired
    private AssFileMapper assFileMapper;

    @Autowired
    private SubmitMapper submitMapper;

    @Autowired
    private QuizMapper quizMapper;

    @Autowired
    private AnswerMapper answerMapper;

    @Autowired
    private QuestionMapper questionMapper;

    @Override
    public void enrollCourse(String userId, String courseId) {
        // Check if this course exists
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course not exist");
        }

        // Check if this user has already enrolled in this course
        LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
        studentWrapper.eq(Student::getUserId, userId);
        studentWrapper.eq(Student::getCourseId, courseId);
        if (baseMapper.exists(studentWrapper)) {
            throw new BrainException(ResultCode.ERROR, "You have already enrolled in this course");
        }

        // Check if this user is a staff of this course
        LambdaQueryWrapper<Staff> staffWrapper = new LambdaQueryWrapper<>();
        staffWrapper.eq(Staff::getUserId, userId);
        staffWrapper.eq(Staff::getCourseId, courseId);
        if (staffMapper.exists(staffWrapper)) {
            throw new BrainException(ResultCode.ERROR, "You cannot enroll in a course that you are a staff of");
        }

        // Enroll this user in this course
        Student student = new Student();
        student.setUserId(userId);
        student.setCourseId(courseId);
        if (!save(student)) {
            throw new BrainException(ResultCode.ERROR, "Enroll course failed");
        }
    }

    @Override
    public void dropCourse(String userId, String courseId) {
        // Check if this course exists
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course not exist");
        }

        // Check if this user has already enrolled in this course
        LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
        studentWrapper.eq(Student::getUserId, userId);
        studentWrapper.eq(Student::getCourseId, courseId);
        if (!baseMapper.exists(studentWrapper)) {
            throw new BrainException(ResultCode.ERROR, "You cannot drop from a course you have not enrolled in");
        }

        // Delete this student
        if (baseMapper.delete(studentWrapper) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete course failed");
        }
    }

    @Override
    public List<Map<String, Object>> getEnrolledCoursesByUserId(String userId) {
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

    public boolean isStudentEnrolledInCourse(String userId, String courseId) {
        // Return true if there is a record matching the userId and courseId, otherwise return false
        return baseMapper.countByUserIdAndCourseId(userId, courseId) > 0;
    }

    @Override
    @Transactional
    public void submitAssignment(String userId, String assignmentId, MultipartFile[] files) {
        if (files == null) {
            throw new BrainException(ResultCode.ERROR, "No files");
        }

        // Check if this assignment exists
        Assignment assignment = assignmentMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment not exist");
        }

        // Assuming we have a function to check if a user is enrolled in the course of the assignment
        if (!isStudentEnrolledInCourse(userId, assignment.getCourseId())) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You are not enrolled in this course");
        }

        // Delete previous submissions, if any
        LambdaQueryWrapper<Submit> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Submit::getSubmittedBy, userId);
        wrapper.eq(Submit::getAssignmentId, assignmentId);
        submitMapper.delete(wrapper);

        // Upload files
        for (MultipartFile file: files) {

            String filename = file.getOriginalFilename();
            if (filename == null) {
                throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be null");
            }

            if (filename.length() > 255) {
                throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be longer than 255 characters");
            }

            // Generate a UUID for each file and use the UUID as filename, preventing file overwriting
            String extension = filename.substring(filename.lastIndexOf("."));
            String objectName = "submit/" + assignmentId + "/" + RandomUtils.generateUUID() + extension;

            // Upload the file
            OssUtils.uploadFile(file, objectName, filename, false);

            // Create new submission record
            Submit submit = new Submit();
            submit.setAssignmentId(assignmentId);
            submit.setName(filename);
            submit.setSource("oss://" + objectName);
            submit.setSubmittedBy(userId);

            // Insert submission record
            try {
                if (submitMapper.insert(submit) < 1) {
                    throw new BrainException(ResultCode.ERROR, "Submit assignment failed");
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new BrainException(ResultCode.ERROR, "Database operation failed");
            }
        }
    }

    @Override
    public Map<String, Object> getAssignmentById(String userId, String assignmentId) {
        Assignment assignment = assignmentMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment not exist");
        }

        // Check if this user is a student
        LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
        studentWrapper.eq(Student::getUserId, userId);
        studentWrapper.eq(Student::getCourseId, assignment.getCourseId());
        if (!baseMapper.exists(studentWrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You are not a student of this course");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("assignmentId", assignment.getAssignmentId());
        result.put("title", assignment.getTitle());
        result.put("description", assignment.getDescription());
        result.put("start", assignment.getStart());
        result.put("end", assignment.getEnd());
        result.put("mark", assignment.getMark());

        // Fetch the information of ass files
        LambdaQueryWrapper<AssFile> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AssFile::getAssignmentId, assignmentId);
        List<Map<String, String>> list = assFileMapper.selectList(wrapper).stream()
                .map(assFile -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("assFileId", assFile.getFileId());
                    map.put("title", assFile.getTitle());

                    return map;
                }).collect(Collectors.toList());

        // Fetch the information of submit files
        LambdaQueryWrapper<Submit> submitWrapper = new LambdaQueryWrapper<>();
        submitWrapper.eq(Submit::getSubmittedBy, userId);
        submitWrapper.eq(Submit::getAssignmentId, assignmentId);
        List<Map<String, String>> submitList = submitMapper.selectList(submitWrapper).stream()
                        .map(submit -> {
                            Map<String, String> map = new HashMap<>();
                            map.put("submitId", submit.getSubmitId());
                            map.put("title", submit.getName());

                            return map;
                        }).collect(Collectors.toList());

        result.put("assFiles", list);
        result.put("submits", submitList);

        return result;
    }

    @Override
    public List<Map<String, Object>> getAssignmentListByCourseId(String userId, String courseId) {
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course not exist");
        }

        // Check if this user is a student
        LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
        studentWrapper.eq(Student::getUserId, userId);
        studentWrapper.eq(Student::getCourseId, courseId);
        if (!baseMapper.exists(studentWrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You are not a student of this course");
        }

        LambdaQueryWrapper<Assignment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Assignment::getCourseId, courseId);
        wrapper.orderByAsc(Assignment::getCreatedAt);

        return assignmentMapper.selectList(wrapper).stream()
                .map(assignment -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("assignmentId", assignment.getAssignmentId());
                    result.put("title", assignment.getTitle());
                    result.put("description", assignment.getDescription());
                    result.put("start", assignment.getStart());
                    result.put("end", assignment.getEnd());
                    result.put("mark", assignment.getMark());

                    // Get the ass files information, if any
                    LambdaQueryWrapper<AssFile> assFileWrapper = new LambdaQueryWrapper<>();
                    assFileWrapper.eq(AssFile::getAssignmentId, assignment.getAssignmentId());
                    List<Map<String, String>> list = assFileMapper.selectList(assFileWrapper).stream()
                            .map(assFile -> {
                                Map<String, String> map = new HashMap<>();

                                map.put("assFileId", assFile.getFileId());
                                map.put("title", assFile.getTitle());

                                return map;
                            }).collect(Collectors.toList());

                    result.put("assFiles", list);

                    // Fetch the information of submit files, if any
                    LambdaQueryWrapper<Submit> submitWrapper = new LambdaQueryWrapper<>();
                    submitWrapper.eq(Submit::getSubmittedBy, userId);
                    submitWrapper.eq(Submit::getAssignmentId, assignment.getAssignmentId());
                    List<Map<String, String>> submitList = submitMapper.selectList(submitWrapper).stream()
                            .map(submit -> {
                                Map<String, String> map = new HashMap<>();
                                map.put("submitId", submit.getSubmitId());
                                map.put("title", submit.getName());

                                return map;
                            }).collect(Collectors.toList());

                    result.put("submits", submitList);

                    return result;
                }).collect(Collectors.toList());
    }

    @Override
    public Object downloadSubmitBySubmitId(String userId, String submitId) {
        Submit submit = submitMapper.selectById(submitId);
        if (submit == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Submit not exist");
        }
        if (!submit.getSubmittedBy().equals(userId)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You can only download submissions submitted by yourself");
        }

        // Download submits
        return OssUtils.downloadFile(submit.getSource().substring(6));
    }

//    @Override
//    @Transactional
//    public void submitQuiz(String userId, String quizId, Map<String, String> answers) {
//        // Check if the quiz exists
//        Quiz quiz = quizMapper.selectById(quizId);
//        if (quiz == null) {
//            throw new BrainException(ResultCode.NOT_FOUND, "Quiz not exist");
//        }
//
//        // Assuming we have a function to check if a user is enrolled in the course of the quiz
//        if (!isStudentEnrolledInCourse(userId, quiz.getCourseId())) {
//            throw new BrainException(ResultCode.NO_AUTHORITY, "You are not enrolled in this course");
//        }
//
//        // Delete previous quiz submissions, if any
//        LambdaQueryWrapper<SubmitQuiz> wrapper = new LambdaQueryWrapper<>();
//        wrapper.eq(SubmitQuiz::getSubmittedBy, userId);
//        wrapper.eq(SubmitQuiz::getQuizId, quizId);
//        submitQuizMapper.delete(wrapper);
//
//        // Submit quiz and save answers
//        for (Map.Entry<String, String> entry : answers.entrySet()) {
//            String questionId = entry.getKey();
//            String answer = entry.getValue();
//
//            // Assuming we have a function to check if the question belongs to the quiz
//            if (!isQuestionBelongsToQuiz(questionId, quizId)) {
//                throw new BrainException(ResultCode.NO_AUTHORITY, "The question does not belong to this quiz");
//            }
//
//            // Create new quiz submission record
//            SubmitQuiz submitQuiz = new SubmitQuiz();
//            submitQuiz.setQuizId(quizId);
//            submitQuiz.setQuestionId(questionId);
//            submitQuiz.setAnswer(answer);
//            submitQuiz.setSubmittedBy(userId);
//
//            // Insert quiz submission record
//            try {
//                if (submitQuizMapper.insert(submitQuiz) < 1) {
//                    throw new BrainException(ResultCode.ERROR, "Submit quiz failed");
//                }
//            } catch (Exception e) {
//                e.printStackTrace();
//                throw new BrainException(ResultCode.ERROR, "Database operation failed");
//            }
//        }
//    }

    private float calculateMark(Question question, String optionIds) {
        List<String> list = Arrays.asList(optionIds.split(","));
        Collections.sort(list);
        optionIds = String.join(",", list);

        StringBuilder sb = new StringBuilder();

        int[] correctAnswers = new int[] {question.getACorrect(), question.getBCorrect(), question.getCCorrect(),
                question.getDCorrect(), question.getECorrect(), question.getFCorrect()};

        for (int i = 0; i < 6; i++) {
            char correct = (char) ('a' + i);
            if (correctAnswers[i] == 1) {
                if (sb.length() == 0) sb.append(correct);
                else sb.append(',').append(correct);
            }
        }

        return optionIds.contentEquals(sb) ? question.getMark() : 0;
    }

    @Override
    @Transactional
    public void submitQuestion(String userId, String questionId, String optionIds, String content) {
        // Check if the question exists
        Question question = questionMapper.selectById(questionId);
        if (question == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Question not exist");
        }

        Quiz quiz = quizMapper.selectById(question.getQuizId());
        if (quiz == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Quiz not exist");
        }

        // Assuming we have a function to check if a user is enrolled in the course of the quiz
        if (!isStudentEnrolledInCourse(userId, quiz.getCourseId())) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You are not enrolled in this course");
        }

        // Delete previous question submissions
        LambdaQueryWrapper<Answer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Answer::getUserId, userId);
        wrapper.eq(Answer::getQuestionId, questionId);

        if (answerMapper.selectOne(wrapper) != null) {
            answerMapper.delete(wrapper);
        }

        // Create a new answer record
        Answer answer = new Answer();
        answer.setUserId(userId);
        answer.setQuestionId(questionId);

        // Based on the question type, set the appropriate data
        if (question.getType() == 0 || question.getType() == 1) {
            if (!Objects.equals(optionIds, "")) {
                answer.setOptionIds(optionIds);
            } else {
                throw new BrainException(ResultCode.ERROR, "Input answer in incorrect question type");
            }
            answer.setContent(null); // Clear content
        } else if (question.getType() == 2) {
            answer.setOptionIds(null); // Clear optionIds
            if (!Objects.equals(content, "")){
                answer.setContent(content);
            } else {
                throw new BrainException(ResultCode.ERROR, "Input answer in incorrect question type");
            }
        } else {
            throw new BrainException(ResultCode.ERROR, "Invalid question type");
        }

        // Calculate the mark for the answer if the question type is multiple-choice
        if (question.getType() == 0 || question.getType() == 1) {
            answer.setMark(calculateMark(question, optionIds));
        }

        // Insert the answer record
        int result = answerMapper.insert(answer);
        if (result <= 0) {
            throw new BrainException(ResultCode.ERROR, "Failed to submit the question");
        }
    }

    @Override
    public Object getEnrolledStreamListDateByUserId(String userId) {
        return baseMapper.selectStreamDateByStudent(userId).stream()
                .map(record -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("course_title", record.get("course_title"));
                    map.put("stream_title", record.get("stream_title"));
                    map.put("start", record.get("start"));
                    return map;
                }).collect(Collectors.toList());
    }

    @Override
    public Object getEnrolledCourseListWithForum(String userId) {
        return baseMapper.selectCoursesWithForumAndCreators(userId).stream()
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

    public Object getDueDateListByUserId(String userId) {
        LocalDateTime currentTime = LocalDateTime.now();
        List<Map<String, Object>> enrolledCourses = getEnrolledCoursesByUserId(userId);

        Map<String, Object> dueDateList = new HashMap<>();
        List<Object> assignmentList = new ArrayList<>();
        List<Object> quizList = new ArrayList<>();
        List<Object> streamList = new ArrayList<>();

        for (Map<String, Object> enrolledCourse : enrolledCourses) {
            String courseId = (String) enrolledCourse.get("courseId");

            List<Map<String, Object>> assDueList = assignmentMapper.selectAssignmentDueByCourseId(courseId, currentTime);
            if (!assDueList.isEmpty()) {
                assignmentList.add(assDueList);
            }

            List<Map<String, Object>> quizDueList = quizMapper.selectQuizDueByCourseId(courseId, currentTime);
            if (!quizDueList.isEmpty()) {
                quizList.add(quizDueList);
            }

            List<Map<String, Object>> streamDueList = courseMapper.selectStreamDueByCourseId(courseId, currentTime);
            if (!streamDueList.isEmpty()) {
                streamList.add(streamDueList);
            }
        }

        dueDateList.put("AssignmentList", assignmentList);
        dueDateList.put("QuizList", quizList);
        dueDateList.put("StreamList", streamList);

        return dueDateList;
    }

    @Override
    public Object getMedalsByCourseId(String userId, String courseId) {
        Map<String, Float> allMarks = new HashMap<>();

        List<String> assMedals = new ArrayList<>();
        List<String> assNames = new ArrayList<>();

        AtomicReference<Float> totalMark = new AtomicReference<>(0f);

        LambdaQueryWrapper<Assignment> assignmentWrapper = new LambdaQueryWrapper<>();
        assignmentWrapper.eq(Assignment::getCourseId, courseId);
        assignmentMapper.selectList(assignmentWrapper)
                .forEach(assignment -> {
                    Set<String> visited = new HashSet<>();
                    Set<Float> marks = new HashSet<>();

                    AtomicReference<Float> currentUserMark = new AtomicReference<>(0f);

                    // Select all the submits of this assignment
                    LambdaQueryWrapper<Submit> submitWrapper = new LambdaQueryWrapper<>();
                    submitWrapper.eq(Submit::getAssignmentId, assignment.getAssignmentId());
                    submitMapper.selectList(submitWrapper).stream()
                            .filter(submit -> !visited.contains(submit.getSubmittedBy()))
                            .forEach(submit -> {
                                Float mark = submit.getMark() == null ? 0 : submit.getMark();
                                String submittedBy = submit.getSubmittedBy();

                                if (submittedBy.equals(userId)) {
                                    currentUserMark.set(mark);
                                }

                                marks.add(mark);
                                allMarks.put(submittedBy, allMarks.getOrDefault(submittedBy, 0f) + mark);

                                visited.add(submittedBy);
                            });

                    List<Float> markList = new ArrayList<>(marks);
                    markList.sort(Collections.reverseOrder());
                    int rank = findRankInDescendingOrderList(markList, currentUserMark.get());
                    totalMark.set(totalMark.get() + currentUserMark.get());

                    if (rank == 1) {
                        assMedals.add("gold");
                        assNames.add(assignment.getTitle());
                    } else if (rank == 2) {
                        assMedals.add("silver");
                        assNames.add(assignment.getTitle());
                    } else if (rank == 3) {
                        assMedals.add("copper");
                        assNames.add(assignment.getTitle());
                    }
                });

        List<String> quizMedals = new ArrayList<>();
        List<String> quizNames = new ArrayList<>();

        LambdaQueryWrapper<Quiz> quizWrapper = new LambdaQueryWrapper<>();
        quizWrapper.eq(Quiz::getCourseId, courseId);
        quizMapper.selectList(quizWrapper)
                .forEach(quiz -> {
                    Set<Float> marks = new HashSet<>();

                    AtomicReference<Float> currentUserMark = new AtomicReference<>(0f);

                    getMarkByQuizId(quiz.getQuizId()).forEach(map -> {
                        Float mark = (Float) map.get("totalScore");
                        String submittedBy = (String) map.get("userId");

                        if (submittedBy.equals(userId)) {
                            currentUserMark.set(mark);
                        }

                        marks.add(mark);
                        allMarks.put(submittedBy, allMarks.getOrDefault(submittedBy, 0f) + mark);
                    });

                    List<Float> markList = new ArrayList<>(marks);
                    markList.sort(Collections.reverseOrder());
                    int rank = findRankInDescendingOrderList(markList, currentUserMark.get());
                    totalMark.set(totalMark.get() + currentUserMark.get());

                    if (rank == 1) {
                        quizMedals.add("gold");
                        quizNames.add(quiz.getTitle());
                    } else if (rank == 2) {
                        quizMedals.add("silver");
                        quizNames.add(quiz.getTitle());
                    } else if (rank == 3) {
                        quizMedals.add("copper");
                        quizNames.add(quiz.getTitle());
                    }
                });

        Set<Float> totalMarkSet = new HashSet<>(allMarks.values());
        List<Float> totalMarkList = new ArrayList<>(totalMarkSet);
        totalMarkList.sort(Collections.reverseOrder());
        int rank = findRankInDescendingOrderList(totalMarkList, totalMark.get());
        List<String> totalMedals = new ArrayList<>();

        Map<String, Object> totalResult = new HashMap<>();
        totalResult.put("title", "All Grades");
        if (rank == 1) {
            totalMedals.add("gold");
        } else if (rank == 2) {
            totalMedals.add("silver");
        } else if (rank == 3) {
            totalMedals.add("copper");
        }
        totalResult.put("medals", totalMedals);

        List<Map<String, Object>> result = new ArrayList<>();

        result.add(totalResult);

        Map<String, Object> assResult = new HashMap<>();
        assResult.put("title", "Assignment");
        assResult.put("medals", assMedals);
        assResult.put("description", assNames);
        result.add(assResult);

        Map<String, Object> quizResult = new HashMap<>();
        quizResult.put("title", "Quiz");
        quizResult.put("medals", quizMedals);
        quizResult.put("description", quizNames);
        result.add(quizResult);

        return result;
    }

    private int findRankInDescendingOrderList(List<Float> list, float target) {
        int left = 0;
        int right = list.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (list.get(mid) < target) {
                right = mid - 1;
            } else if (list.get(mid) > target) {
                left = mid + 1;
            } else {
                return mid + 1;
            }
        }
        return right + 2;
    }

    private List<Map<String, Object>> getMarkByQuizId(String quizId) {
        LambdaQueryWrapper<Question> questionWrapper = new LambdaQueryWrapper<>();
        questionWrapper.eq(Question::getQuizId, quizId);
        List<Question> questions = questionMapper.selectList(questionWrapper);

        LambdaQueryWrapper<Answer> answerWrapper = new LambdaQueryWrapper<>();
        answerWrapper.in(Answer::getQuestionId, questions.stream().map(Question::getQuestionId).collect(Collectors.toList()));
        List<Answer> answers = answerMapper.selectList(answerWrapper);

        Map<String, Float> studentScores = new HashMap<>();
        for (Answer answer: answers) {
            String studentId = answer.getUserId();
            float studentScore = studentScores.getOrDefault(studentId, 0f);
            studentScores.put(studentId, studentScore + (answer.getMark() == null ? 0 : answer.getMark()));
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Float> entry : studentScores.entrySet()) {
            String studentId = entry.getKey();
            float totalScore = entry.getValue();

            Map<String, Object> studentResult = new HashMap<>();
            studentResult.put("userId", studentId);
            studentResult.put("totalScore", totalScore);

            result.add(studentResult);
        }

        return result;
    }

}
