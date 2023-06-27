import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Modal, Image, Form, Collapse, Divider } from 'antd';
import './StaffDashboardContent.less';
import Navbar from "../../component/navbar"
import {getToken} from '../utils/utils'
import {
  PlusCircleOutlined,
  HeartFilled,
  PlusCircleFilled,
  TrophyOutlined,
  CloseOutlined,
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  DesktopOutlined,
  QuestionCircleOutlined,
  FilePdfOutlined,
  EditOutlined
} from '@ant-design/icons';
import CourseLayout from './CourseLayout';
import TextLesson from './TextLesson';
import VideoLesson from './VideoLesson';
import StreamLesson from './StreamLesson';
import Assignment from './Assignment';
import Quiz from './Quiz';
import TextButton from './TextButton';
import AssignmentButton from './AssignmentButton';
import TextLessonEdit from './TextLessonEdit';
import CourseLayoutEdit from './CourseLayoutEdit';
import AssignmentEdit from './AssignmentEdit';

const { Footer, Sider } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const StaffDashboardContent: React.FC = () => {
  const token = getToken();
  const [isSiderVisible, setIsSiderVisible] = useState(true);
  const [contentMarginLeft, setContentMarginLeft] = useState(isSiderVisible ? 200 : 0);
  useEffect(() => {
    setContentMarginLeft(isSiderVisible ? 200 : 0);
  }, [isSiderVisible]);
  
  const [courseSubmitted, setCourseSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState('close');

  const [textChangeFlag, setTextChangeFlag] = useState(false);
  const [assignmentChangeFlag, setAssignmentChangeFlag] = useState(false);
  
  const handleAddCourses = () => {
    setSelectedOption('course');
  };
  const handleCancel = () => {
    setSelectedOption('close');
  };
  const handleSubmitCourse = (courseId: string) => {
    fetchCourses();
    setSelectedOption('close');
    setCourseSubmitted(true);
    // console.log('courseSubmitted', courseId);
  };
  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://175.45.180.201:10900/service-edu/edu-staff/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const fetchedCourses = data.data.courses;
      setCourses(fetchedCourses);
    } catch (error:any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCourses(); // 初始加载章节数据
    if (courses !== null) {
      setCourseSubmitted(true);
    }
  }, []);

  // useEffect(() => {
  //   console.log('courseIds:', courseIds);
  // }, [courseIds]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const handleShowModal = (courseId: string, courseTitle: string) => {
    setShowModal(true);
    setSelectedCourseId(courseId);
    setSelectedCourseTitle(courseTitle);
  };
  const [singleCourse, setSingleCourse] = useState<Array<any>>([{cover: '',title:'',category:'',description:'',hasForum:false}]);
  const handleEditCourse = (courseId: string) => {
    // console.log(courseId);
    setSelectedCourseId(courseId);
    setSelectedOption('courseEdit');
    // Send request to get course information
    fetch(`http://175.45.180.201:10900/service-edu/edu-course/course/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      // Assuming the course title is returned in the 'title' field of the response
      const fetchedCourse = data.data.course;
      setSingleCourse(fetchedCourse);
      // console.log('data', fetchedCourse);
      // console.log('data_courseId', data.data.course.courseId);
      // console.log('data_title', data.data.course.title);
    })
    .catch((error) => {
      console.log(error.message);
    });
  };
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const handleSubmitText = (sectionId: string) => {
    setTextChangeFlag(!textChangeFlag);
    setSelectedOption('close');
    console.log('Submitted sectionId:', sectionId);
  };

  const handleSubmitAssignment = () => {
    setAssignmentChangeFlag(!assignmentChangeFlag);
    setSelectedOption('close');
  };

  const handleSubmitQuiz = () => {
    setSelectedOption('close');
  };

  const handleSubmitVideo = () => {
    setSelectedOption('close');
  };
  const [singleSection, setSingleSection] = useState(null);
  const handleSingleSectionChange = (sectionData: any) => {
    // 在这里处理 singleSection 参数
    // console.log('sectionData', sectionData);
    setSingleSection(sectionData);
    setSelectedOption('editTextLesson');
    // 执行其他操作
  };
  const [singleAssignment, setSingleAssignment] = useState(null);
  const handleSingleAssignmentChange = (assignmentData: any) => {
    // 在这里处理 singleAssignment 参数
    console.log('assignmentData', assignmentData);
    setSingleAssignment(assignmentData);
    setSelectedOption('editAssignmentLesson');
    // 执行其他操作
  };
  const renderAdditionalButton = (courseId: string, courseTitle: string) => {
    return (
      <div style={{ textAlign: 'center', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center' }}
      >
        <TextButton courseId={courseId} onSingleSectionChange={handleSingleSectionChange} changeFlag={textChangeFlag} />
        <AssignmentButton courseId={courseId} onSingleAssignmentChange={handleSingleAssignmentChange} changeFlag={assignmentChangeFlag} />
        <Divider dashed style={{ margin: '10px 0', border: '0.9px dashed #10739E' }} />
        {/* add course materials button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto' }}>
          <Button 
            // key={courseId}
            type="primary" 
            ghost
            icon={<PlusCircleFilled />}
            style={{ marginRight: '5%' }}
            onClick={() => handleShowModal(courseId, courseTitle)}
          ></Button>
          <Button 
            type="primary" 
            ghost
            style={{ marginRight: '5%' }}
            icon={<TrophyOutlined />}
          ></Button>
          <Button 
            // key={courseId}
            type="primary" 
            ghost
            icon={<EditOutlined />}
            onClick={() => handleEditCourse(courseId)}
          ></Button>
        </div>
        {/* add course materials */}
        <Modal
          title={
            <>
              <Title level={4} style={{ textAlign: 'center', fontFamily: 'Comic Sans MS' }}>
                Course Title: {selectedCourseTitle}
              </Title>
              <div style={{ textAlign: 'center', fontFamily: 'Comic Sans MS' }}>
                <Text>Select Materials Type</Text>
              </div>
            </>
          }
          visible={showModal}
          onCancel={() => setShowModal(false)}
          closeIcon={<CloseOutlined />}
          footer={null}
          style={{ fontFamily: 'Comic Sans MS' }} 
          // key={selectedCourseId}
        >
          Learning Content
          <Form style={{ margin: '2%' }}>
           <Form.Item style={{ textAlign: 'center' }}>
              <Button 
                // key={selectedCourseId}
                type="primary" 
                ghost 
                style={{ width: '110px', height: '90px', border: '1px solid #999999', margin: '3%', color: 'black' }}
                onClick={() => {
                  setShowModal(false); // 关闭表单的 Modal
                  setSelectedOption('text');
                  setSelectedCourseId(selectedCourseId);
                }}
              >
                <div>
                  <FileTextOutlined style={{ fontSize: '40px', color: '#487AFF', margin: '5px' }} />
                </div>
                <span style={{ fontSize: '8px', fontFamily: 'Comic Sans MS', fontWeight: 'normal' }} >
                  Text Lesson
                </span>
              </Button>
              <Button 
                // key={selectedCourseId}
                type="primary" 
                ghost 
                style={{ width: '110px', height: '90px', border: '1px solid #999999', margin: '3%', color: 'black' }}
                onClick={() => {
                  setShowModal(false); // 关闭表单的 Modal
                  setSelectedOption('video');
                  setSelectedCourseId(selectedCourseId);
                }}
              >
                <div>
                  <VideoCameraOutlined style={{ fontSize: '40px', color: '#487AFF', margin: '5px' }} />
                </div>
                <span style={{ fontSize: '8px', fontFamily: 'Comic Sans MS', fontWeight: 'normal' }} >
                  Video Lesson
                </span>
              </Button>
              <Button 
                // key={selectedCourseId}
                type="primary" 
                ghost 
                style={{ width: '110px', height: '90px', border: '1px solid #999999', margin: '3%', color: 'black' }}
                onClick={() => {
                  setShowModal(false); // 关闭表单的 Modal
                  setSelectedOption('stream');
                  setSelectedCourseId(selectedCourseId);
                }}
              >
                <div>
                  <DesktopOutlined style={{ fontSize: '40px', color: '#487AFF', margin: '5px' }} />
                </div>
                <span style={{ fontSize: '8px', fontFamily: 'Comic Sans MS', fontWeight: 'normal' }} >Stream Lesson</span>
              </Button>
            </Form.Item>
          </Form>
          Examination
          <Form style={{ margin: '2%' }}>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button 
                // key={selectedCourseId}
                type="primary" 
                ghost 
                style={{ width: '110px', height: '90px', border: '1px solid #999999', margin: '3%', color: 'black' }}
                onClick={() => {
                  setShowModal(false); // 关闭表单的 Modal
                  setSelectedOption('quiz');
                  setSelectedCourseId(selectedCourseId);
                }}
              >
                <div>
                  <QuestionCircleOutlined style={{ fontSize: '40px', color: '#487AFF', margin: '5px' }} />
                </div>
                <span style={{ fontSize: '8px', fontFamily: 'Comic Sans MS', fontWeight: 'normal' }} >Quiz</span>
              </Button>
              <Button 
                // key={selectedCourseId}
                type="primary" 
                ghost 
                style={{ width: '110px', height: '90px', border: '1px solid #999999', margin: '3%', color: 'black' }}
                onClick={() => {
                  setShowModal(false); // 关闭表单的 Modal
                  setSelectedOption('assignment');
                  setSelectedCourseId(selectedCourseId);
                }}
              >
                <div>
                  <FilePdfOutlined style={{ fontSize: '40px', color: '#487AFF', margin: '5px' }} />
                </div>
                <span style={{ fontSize: '8px', fontFamily: 'Comic Sans MS', fontWeight: 'normal' }} >Assignment</span>
              </Button>
            </Form.Item>               
          </Form>
        </Modal>
      </div>
    );
  };
  
  return (
    <>
    <Navbar />
    <Layout className='staff-dashboard' style={{ backgroundColor: '#EFF1F6' }}>
      <Sider
        className='left-sider'
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: isSiderVisible ? 0 : -200,
          top: 63,
          backgroundColor: '#EFF1F6',
          borderRight: '1px solid grey',
          transition: 'left 0.3s',
        }}
      >
        {courseSubmitted ? (
          <>
            <div style={{ height: 'calc(100% - 27%)', overflow: 'auto', marginBottom: '15px' }}>
              <div style={{ textAlign: 'center', marginTop: '5%', marginBottom: '5%' }}>
                <Collapse className="custom-collapse">
                  {courses.map((course) => (
                    <Panel 
                      header={course.title} 
                      key={course.courseId} 
                      style={{ border: '1px solid #008CFF',
                               backgroundColor: 'white', 
                               fontFamily: 'Comic Sans MS', 
                               borderRadius: '10px',
                               marginBottom: '10px'
                              }}
                    >
                      {/* Additional content for each collapsed menu */}
                      {/* Place your additional content here */}
                      {renderAdditionalButton(course.courseId, course.title)}
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </div>
            {/* 最下面的两个按钮 */}
            <div style={{ textAlign: 'center', marginBottom: '5%' }}>
              <Button 
                type="primary" 
                style={{ width: '70%',  
                        fontFamily: 'Comic Sans MS' 
                      }}
              >
                Forum
              </Button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button 
                onClick={handleAddCourses} 
                icon={<PlusCircleOutlined />} 
                type="primary" 
                ghost
                style={{ fontFamily: 'Comic Sans MS', width: '80%' }} 
              >
                Add Courses
              </Button>
            </div>
          </>
        ) : (
          <>
            <Title className='left-title' level={5} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'normal' }}>
              Create your courses
            </Title>
            <div className='button-div' style={{ textAlign: 'center' }}>
              <Button
                type="link"
                onClick={handleAddCourses}
                icon={<PlusCircleOutlined />}
                style={{ color: '#0085FC', border: '1px solid #0085FC', textAlign: 'center', fontFamily: 'Comic Sans MS' }}
              >
                Add Courses
              </Button>
            </div>
          </>
        )}
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: contentMarginLeft, overflow: 'auto', backgroundColor: '#EFF1F6' }}>
        {selectedOption === 'course' && (
          <CourseLayout onCancel={handleCancel} onSubmit={handleSubmitCourse} />
        )}
        {selectedOption === 'text' && (
          <TextLesson courseId={selectedCourseId} onCancel={handleCancel} onSubmit={handleSubmitText} />
        )}
        {selectedOption === 'video' && (
          <VideoLesson courseId={selectedCourseId} onCancel={handleCancel} onSubmit={handleSubmitVideo} />
        )}
        {selectedOption === 'stream' && (
          <StreamLesson onCancel={handleCancel} onSubmit={handleSubmitVideo} />
        )}
        {selectedOption === 'quiz' && (
          <Quiz courseId={selectedCourseId} onCancel={handleCancel} onSubmit={handleSubmitQuiz} />
        )}
        {selectedOption === 'assignment' && (
          <Assignment courseId={selectedCourseId} onCancel={handleCancel} onSubmit={handleSubmitAssignment} />
        )}
        {selectedOption === 'courseEdit' && (
          <CourseLayoutEdit course={singleCourse} onCancel={handleCancel} onSubmit={handleSubmitCourse} />
        )}
        {selectedOption === 'editTextLesson' && (
          <TextLessonEdit section={singleSection} onCancel={handleCancel} onSubmit={handleSubmitText} />
        )}
        {selectedOption === 'editAssignmentLesson' && (
          <AssignmentEdit assignment={singleAssignment} onCancel={handleCancel} onSubmit={handleSubmitAssignment} />
        )}
        {selectedOption === 'close' && (
          // 没有选择时的内容
          <>
            <Layout style={{ minHeight: '100vh', backgroundColor: '#EFF1F6', textAlign: 'center' }}>
              <div style={{ textAlign: 'center', paddingTop: '7%', }}>
                {/* <img 
                  src={"../../../images/teacher.png"} 
                  // style={{ width: '20%', height: 'auto', }} 
                /> */}
                <Image src={require("../../../images/teacher.png")} />
              </div>
              <Title className='nocourse-title' level={3} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', paddingTop: '5%' }}>
                Let's build your course
              </Title>
            </Layout>
            <Footer className='no-course-footer' style={{ marginLeft: '35%', backgroundColor: '#EFF1F6', fontFamily: 'Comic Sans MS' }}>
              Copyright ©2023 All rights reserved  
              <HeartFilled style={{ color: 'red', marginLeft: '5px' }} />
            </Footer>
          </>
        )}
      </Layout>
    </Layout>
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      {/* 隐藏按钮 */}
      <Button
        type="primary"
        icon={isSiderVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={() => setIsSiderVisible(!isSiderVisible)}
      />
    </div>
    </>
  );
};

export default StaffDashboardContent;