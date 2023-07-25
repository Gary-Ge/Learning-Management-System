import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Modal, Image, Form, Collapse, Divider, message } from 'antd';
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
  EditOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import './StaffDashboardContent.less';
import Navbar from "../../component/navbar"
import CourseLayout from '../../component/CourseLayout';
import TextLesson from '../../component/TextLesson';
import VideoLesson from '../../component/VideoLesson';
import StreamLesson from '../../component/StreamLesson';
import Assignment from '../../component/Assignment';
import Quiz from './Quiz';
import TextButton from '../../component/TextButton';
import VideoButton from '../../component/VideoButton';
import StreamButton from '../../component/StreamButton';
import QuizButton from './QuizButton';
import AssignmentButton from '../../component/AssignmentButton';
import TextLessonEdit from '../../component/TextLessonEdit';
import VideoLessonEdit from '../../component/VideoLessonEdit';
import StreamLessonEdit from '../../component/StreamLessonEdit';
import QuizEdit from './quizEdit';
import LinkBoard from '../../component/LinkBoard';
import CourseLayoutEdit from '../../component/CourseLayoutEdit';
import AssignmentEdit from '../../component/AssignmentEdit';
import ShowMark from '../../component/ShowMark';
import Newcalendar from './Calendar';
import { useHistory } from 'umi';
import { getToken, HOST_STAFF, HOST_COURSE, HOST_ASSIGNMENT, HOST_QUIZ } from '../utils/utils'

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
  const [streamChangeFlag, setStreamChangeFlag] = useState(false);
  const [assignmentChangeFlag, setAssignmentChangeFlag] = useState(false);
  const [videoChangeFlag, setVideoChangeFlag] = useState(false);
  const [quizChangeFlag, setQuizChangeFlag] = useState(false);
  
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
  };
  const [courses, setCourses] = useState<any[]>([]);
  const handleAddCalendar = () => {
    setSelectedOption('calendar');
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${HOST_STAFF}/courses`, {
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
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourses(); // Initially load chapter data
    if (courses !== null) {
      setCourseSubmitted(true);
    }
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsSiderVisible(window.innerWidth > 768);
    };
    // Call the handleResize function when the component is mounted
    handleResize();
    // Subscribe to window resize events
    window.addEventListener('resize', handleResize);
    // Unsubscribe from window resize events when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const handleShowModal = (courseId: string, courseTitle: string) => {
    setShowModal(true);
    setSelectedCourseId(courseId);
    setSelectedCourseTitle(courseTitle);
  };
  const [singleCourse, setSingleCourse] = useState<Array<any>>([{cover: '',title:'',category:'',description:'',hasForum:false}]);
  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedOption('courseEdit');
    // Send request to get course information
    fetch(`${HOST_COURSE}/course/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.code !== 20000) {
        throw new Error(data.message)
      }
      // Assuming the course title is returned in the 'title' field of the response
      const fetchedCourse = data.data.course;
      setSingleCourse(fetchedCourse);
    })
    .catch((error) => {
      message.error(error.message);
    });
  };
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const handleSubmitText = (sectionId: string) => {
    setTextChangeFlag(!textChangeFlag);
    setSelectedOption('close');
  };

  const handleSubmitStream = () => {
    setStreamChangeFlag(!streamChangeFlag);
    setSelectedOption('close');
  }

  const handleSubmitAssignment = () => {
    setAssignmentChangeFlag(!assignmentChangeFlag);
    setSelectedOption('close');
  };

  const handleSubmitQuiz = () => {
    setQuizChangeFlag(!quizChangeFlag);
    setSelectedOption('close');
  };

  const handleSubmitVideo = () => {
    setVideoChangeFlag(!videoChangeFlag);
    setSelectedOption('close');
  };
  const [singleSection, setSingleSection] = useState(null);
  const handleSingleSectionChange = (sectionData: any) => {
    setSingleSection(sectionData);
    setSelectedOption('editTextLesson');
  };
  const [singleVideoSection, setVideoSection] = useState(null);
  const handleSingleVideoSectionChange = (sectionData: any) => {
    setVideoSection(sectionData);
    setSelectedOption('editVideoLesson');
  };
  const [singleQuizSection, setQuizSection] = useState(null);
  const handlesingleQuizSectionChange = (sectionData: any) => {
    setQuizSection(sectionData);
    setSelectedOption('editQuizLesson');
  };
  const [singleStreamSection, setStreamSection] = useState(null);
  const handleSingleStreamSectionChange = (sectionData: any) => {
    setStreamSection(sectionData);
    setSelectedOption('editStreamLesson');
  };
  const handleSingleStreamLinkSectionChange = (sectionData: any, courseId: string) => {
    setStreamSection(sectionData);
    setSelectedOption('streamLink');
    // Current course information
    fetch(`${HOST_COURSE}/course/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.code !== 20000) {
        throw new Error(data.message)
      }
      const fetchedCourse = data.data.course;
      setSingleCourse(fetchedCourse);
    })
    .catch((error) => {
      message.error(error.message);
    });
  };
  const streamCancel = (streamId: string) => {
    
  };
  const [singleAssignment, setSingleAssignment] = useState(null);
  const handleSingleAssignmentChange = (assignmentData: any) => {
    setSingleAssignment(assignmentData);
    setSelectedOption('editAssignmentLesson');
  };

  const [assOptions, setAssOptions] = useState<any[]>([]);
  const [quizes, setQuizes] = useState<any[]>([]);
  const fetchOptions = (courseId: string) => {
    // Current course information
    fetch(`${HOST_COURSE}/course/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.code !== 20000) {
        throw new Error(data.message)
      }
      // Assuming the course title is returned in the 'title' field of the response
      const fetchedCourse = data.data.course;
      setSingleCourse(fetchedCourse);
    })
    .catch((error) => {
      message.error(error.message);
    });
    // All assignments created by the current course
    fetch(`${HOST_ASSIGNMENT}/assignments/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.code !== 20000) {
        throw new Error(data.message)
      }
      // Assuming the course title is returned in the 'title' field of the response
      const fetchedAssignments = data.data.assignments;
      setAssOptions(fetchedAssignments);
    })
    .catch((error) => {
      message.error(error.message);
    });
    // All quizzes created for the current course
    fetch(`${HOST_QUIZ}/quiz/course/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.code !== 20000) {
        throw new Error(data.message)
      }
      // Assuming the course title is returned in the 'title' field of the response
      const fetchedQuizes = data.data.quizzes;
      setQuizes(fetchedQuizes);
    })
    .catch((error) => {
      message.error(error.message);
    });
  };
  
  const handleSubmitMark = () => {
    setSelectedOption('close');
  };
  const history = useHistory();
  const gotoforum = () => {
    history.push(`/teacherforums?courseid=`);
  }
  const renderAdditionalButton = (courseId: string, courseTitle: string) => {
    return (
      <div style={{ textAlign: 'center', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center' }}
      >
        <TextButton courseId={courseId} onSingleSectionChange={handleSingleSectionChange} changeFlag={textChangeFlag} />
        <VideoButton courseId={courseId} onSingleVideoSectionChange={handleSingleVideoSectionChange} changeFlag={videoChangeFlag} />
        <QuizButton courseId={courseId} onSingleQuizSectionChange={handlesingleQuizSectionChange} changeFlag={quizChangeFlag} />
        <StreamButton courseId={courseId} onSingleStreamChange={handleSingleStreamSectionChange} onSingleStreamLinkChange={handleSingleStreamLinkSectionChange} changeFlag={streamChangeFlag} />
        <AssignmentButton courseId={courseId} onSingleAssignmentChange={handleSingleAssignmentChange} changeFlag={assignmentChangeFlag} />
        <Divider dashed style={{ margin: '10px 0', border: '0.9px dashed #10739E' }} />
        {/* add course materials button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto' }}>
          <Button 
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
            onClick={() => {
              setSelectedOption('showMarks');
              setSelectedCourseId(courseId);
              fetchOptions(courseId);
            }}
          ></Button>
          <Button 
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
          open={showModal}
          onCancel={() => setShowModal(false)}
          closeIcon={<CloseOutlined />}
          footer={null}
          style={{ fontFamily: 'Comic Sans MS' }} 
        >
          Learning Content
          <Form style={{ margin: '2%' }}>
           <Form.Item style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                ghost 
                style={{ width: '110px', height: '90px', border: '1px solid #999999', margin: '3%', color: 'black' }}
                onClick={() => {
                  setShowModal(false);
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
                  setShowModal(false);
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
                type="primary" 
                ghost 
                style={{ width: '110px', height: '90px', border: '1px solid #999999', margin: '3%', color: 'black' }}
                onClick={() => {
                  setShowModal(false);
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
                type="primary" 
                ghost 
                style={{ width: '110px', height: '90px', border: '1px solid #999999', margin: '3%', color: 'black' }}
                onClick={() => {
                  setShowModal(false);
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
                type="primary" 
                ghost 
                style={{ width: '110px', height: '90px', border: '1px solid #999999', margin: '3%', color: 'black' }}
                onClick={() => {
                  setShowModal(false);
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
            <div style={{ height: 'calc(100% - 31%)', overflow: 'auto', marginBottom: '15px' }}>
              <div style={{ textAlign: 'center', marginTop: '5%', marginBottom: '5%' }}>
                <Collapse className="custom-collapse">
                  {(courses || []).map((course) => (
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
                      {renderAdditionalButton(course.courseId, course.title)}
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </div>
            {/* The bottom two buttons */}
            <div style={{ textAlign: 'center', marginBottom: '5%' }}>
              <Button 
                type="primary" 
                style={{ width: '70%',  
                        fontFamily: 'Comic Sans MS' 
                      }}
                onClick={gotoforum}
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
            <div style={{ textAlign: 'center',marginTop:'10px' }}>
              <Button 
                onClick={handleAddCalendar} 
                icon={<CalendarOutlined />} 
                type="primary" 
                ghost
                style={{ fontFamily: 'Comic Sans MS', width: '80%' }} 
              >
               Calendar
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
            <div style={{ textAlign: 'center',marginTop:'10px' }}>
              <Button 
                onClick={handleAddCalendar} 
                icon={<CalendarOutlined />} 
                type="primary" 
                ghost
                style={{ fontFamily: 'Comic Sans MS', width: '80%' }} 
              >
               Calendar
              </Button>
            </div>
          </>
        )}
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: contentMarginLeft, overflow: 'auto', backgroundColor: '#EFF1F6', marginTop: '100px' }}>
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
          <StreamLesson courseId={selectedCourseId} onCancel={handleCancel} onSubmit={handleSubmitStream} />
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
        {selectedOption === 'editVideoLesson' && (
          <VideoLessonEdit video={singleVideoSection} onCancel={handleCancel} onSubmit={handleSubmitVideo} />
        )}
        {selectedOption === 'editQuizLesson' && (
          <QuizEdit quiz={singleQuizSection} onCancel={handleCancel} onSubmit={handleSubmitQuiz}/>
        )}
        {selectedOption === 'editStreamLesson' && (
          <StreamLessonEdit stream={singleStreamSection} onCancel={handleCancel} onSubmit={handleSubmitStream} />
        )}
        {selectedOption === 'streamLink' && (
          <LinkBoard course={singleCourse} stream={singleStreamSection} onClick={streamCancel} />
        )}
        {selectedOption === 'editAssignmentLesson' && (
          <AssignmentEdit assignment={singleAssignment} onCancel={handleCancel} onSubmit={handleSubmitAssignment} />
        )}
        {selectedOption === 'showMarks' && (
          <ShowMark quizes={quizes} assInfor={assOptions} course={singleCourse} onCancel={handleCancel} onSubmit={handleSubmitMark} />
        )}
        {selectedOption === 'calendar' && (
          <Newcalendar />
        )}
        {selectedOption === 'close' && (
          // No content when selected
          <>
            <Layout style={{ minHeight: '100vh', backgroundColor: '#EFF1F6', textAlign: 'center' }}>
              <div style={{ textAlign: 'center', paddingTop: '20%', }}>
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
      {/* Hide button */}
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