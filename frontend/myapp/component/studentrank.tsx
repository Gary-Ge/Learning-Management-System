import React, { useState, useEffect } from 'react';
import { CrownOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Layout, Typography, List, Button, Form, Modal, Select, Table, message, Badge, Checkbox } from 'antd';
import gold from '../../images/1.gif';
import silver from '../../images/2.gif';
import copper from '../../images/3.gif';
import crown from '../../images/crown.png';
import downloadicon from '../../images/download.png';
import { getToken, HOST_ASSIGNMENT, HOST_QUESTION, HOST,HOST_STUDENT } from '../src/utils/utils'

const { Content } = Layout;
const { Title, Text } = Typography;

const StudentRank: React.FC<{ quizes: any; course: any; assInfor: any; courseid:any }> = ({ quizes, course, assInfor, courseid }) => {
  const [open, setOpen] = useState(false);
  const data = [
      {
        title: 'All Grades',
        medals:[]
      },
      {
        title: 'Quiz',
        medals: [gold, silver,copper],
        description: ['Quiz1', 'Quiz2','Quiz3']
      },
      {
        title: 'Assignment',
        medals: [gold, silver,copper],
        description: ['Assignment1', 'Assignment2','Assignment3']
      },
    ];
    interface MedalItem {
      title: string;
      medals: string[];
      description?: string[];
  }
  type MedalType = 'gold' | 'silver' | 'copper';

  const medalImages: Record<MedalType, string> = {
      gold: gold,
      silver: silver,
      copper: copper
  };
  const query = new URLSearchParams(location.search);
  let courseId: any = query.get('courseid');
  const [medal, setMedal] = useState<MedalItem[]>([]);
  const token = getToken();
  const [selectedType, setSelectedType] = useState('');
  useEffect(() => {
    if(courseid){
    fetch(`${HOST_STUDENT}/medals/${courseid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${token}`
          },
      })
      .then(res => res.json())
      .then(res => {
        if (res.code !== 20000) {
           message.error(res.message)
           return
        }
        setMedal(res.data.medals)
      })
      .catch(error => {
        message.error(error.message)
      }); 
    } else {
      fetch(`${HOST_STUDENT}/medals/${courseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${token}`
          },
      })
      .then(res => res.json())
      .then(res => {
        if (res.code !== 20000) {
           message.error(res.message)
           return
        }
        setMedal(res.data.medals)
      })
      .catch(error => {
        message.error(error.message)
      });
    }
  }, [courseid, token]);
  // When selectedType is assignment
  // Choose a course for any assignment
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const handleAssignmentIdChange = (value: string) => {
    const selectedSingleAssignment = assInfor.find((singleAssignment: any) => singleAssignment.assignmentId === value);
    if (selectedSingleAssignment) {
      setSelectedAssignmentId(selectedSingleAssignment.assignmentId);
    }
  };
  // Add data about the student and their uploaded assignment
  const [dataAssignmentSource, setDataAssignmentSource] = useState<any[]>([]);
  const [dataAssignmentRank, setDataAssignmentRank] = useState<any[]>([]);
  // Gets the information and submitId for all users submitted in the assignment selected for the current course
  let cur_userId = JSON.parse(localStorage.getItem("userData")).userId;
  const fetchSubmitAssignments = async () => {
    try {
      const response = await fetch(`${HOST_ASSIGNMENT}/assignment/${selectedAssignmentId}/submits`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const fetchedAssignments = data.data.assignment.submits;
      const results: any[] = [];
      const rankResults: any[] = [];
      for (const student of fetchedAssignments || []) {
        const files: any[] = [];
        for (const file of student.files || []) {
          if (file.submitId !== '') {
            try {
              const response = await fetch(
                `${HOST_ASSIGNMENT}/submit/${file.submitId}`,
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const data = await response.json();
              const assignmentSubmitFileUrl = data.data.fileUrl;
              files.push({
                submitId: file.submitId,
                file: assignmentSubmitFileUrl,
                filename: file.name,
              });
            } catch (error: any) {
              message.error(error.message);
            }
          }
        }
        if (student.userId === cur_userId) {
          if (student.mark === -1) {
            results.push({
              id: student.email,
              name: student.username,
              grade: '-',
              download: files,
            });
          } else {
            results.push({
              id: student.email,
              name: student.username,
              grade: student.mark,
              download: files,
            });
          }
        }
        if (student.mark === -1) {
          rankResults.push({
            avatar: student.avatar,
            name: student.username,
            grade: '-',
          });
        } else {
          rankResults.push({
            avatar: student.avatar,
            name: student.username,
            grade: student.mark,
          });
        }
      }
      setDataAssignmentSource(results);
      setDataAssignmentRank(rankResults.sort((a, b) => b.grade - a.grade));
    } catch (error:any) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (selectedAssignmentId !== '') {
      fetchSubmitAssignments(); // Initially load chapter data
    }
  }, [selectedAssignmentId]);
  // Click to download the assignment uploaded by the student
  const [isFileVisible, setIsFileVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const handleOpenFiles = (files: any) => {
    setIsFileVisible(true);
    setFiles(files);
  };  
  const handleModalClose = () => {
    setIsFileVisible(false);
  }
  const [selectedMultiOption, setSelectedMultiOption] = useState<any[]>([]);
  const handleCheckBoxChange = (file: any) => {
    if (selectedMultiOption.includes(file)) {
      setSelectedMultiOption(selectedMultiOption.filter(option => option !== file));
    } else {
      setSelectedMultiOption([...selectedMultiOption, file]);
    }
  };
  const handleDownload = () => {
    for (const file of selectedMultiOption || []) {
      window.open(file, '_blank');
    }
    setSelectedMultiOption([]);
    setIsFileVisible(false);
  };
  // The ordinate information of the selected assignment for the current course
  const assignmentColumns = [
    { title: 'Student ID', dataIndex: 'id', key: 'id' },
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Download | View',
      dataIndex: 'download',
      key: 'download',
      render: (download: any) => (
        <>
        <Button
          onClick={() => handleOpenFiles(download)}
          style={{
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Comic Sans MS'
          }}
        >
          <img src={downloadicon} className="downloadicon"/>
          <div>|</div>
          <CheckCircleOutlined style={{ color: 'red', marginLeft: '10px', fontSize: '20px' }} />
        </Button>
        </>
      ),
    },
    { title: 'Students Grade', dataIndex: 'grade', key: 'grade' },
  ];

  // When selectedType is quiz
  // Choose any quiz for a course
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const handleQuizIdChange = (value: string) => {
    const selectedSingleQuiz = quizes.find((singleQuiz: any) => singleQuiz.quizId === value);
    if (selectedSingleQuiz) {
      setSelectedQuizId(selectedSingleQuiz.quizId);
    }
  };
  // Get information on all the users, questions and answers submitted in the quiz selected for the current course
  const [submitQuizes, setSubmitQuizes] = useState<any[]>([]);
  const fetchSubmitQuizzes = async () => {
    try {
      const response = await fetch(`${HOST_QUESTION}/quiz/${selectedQuizId}/answers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const fetchedQuizes = data.data.answers;
      setSubmitQuizes(fetchedQuizes);
    } catch (error:any) {
      message.error(error.message);
    }
  };
  // All questions for the quiz selected in the current course
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const fetchAllQuestions = async () => {
    try {
      const response = await fetch(`${HOST_QUESTION}/questions/${selectedQuizId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const fetchedQuestions = data.data.questions;
      setAllQuestions(fetchedQuestions);
    } catch (error:any) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (selectedQuizId !== '') {
      fetchSubmitQuizzes(); // Initially load chapter data
      fetchAllQuestions();
    }
  }, [selectedQuizId]);
  // Choose any question in a quiz of a course
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const handleQuestionIdChange = (value: string) => {
    const selectedQuestion = allQuestions.find((question: any) => question.questionId === value);
    if (selectedQuestion) {
      setSelectedQuestionId(selectedQuestion.questionId);
    } else {
      setSelectedQuestionId(value);
    }
  };
  // The longitudinal information for the selected question in the current course quiz
  const quizColumns = [
    { title: 'Student ID', dataIndex: 'id', key: 'id' },
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
    { title: 'Student Answer', dataIndex: 'answer', key: 'answer' },
    { title: 'Student Grade', dataIndex: 'grade', key: 'grade' },
  ];
  // Add data such as students, answers, grades, etc
  const [dataQuestionSource, setDataQuestionSource] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const results: any[] = [];
      for (const infor of submitQuizes || []) {
        if (infor.question.questionId === selectedQuestionId && infor.answer.userId === cur_userId) {
          if (infor.question.type === 0 || infor.question.type === 1) {
            results.push({
              id: infor.user.email,
              name: infor.user.username,
              answer: infor.answer.optionIds,
              grade: infor.answer.mark,
            });
          }
          else if (infor.question.type === 2) {
            results.push({
              id: infor.user.email,
              name: infor.user.username,
              answer: infor.answer.content,
              grade: infor.answer.mark,
            });
          }          
        }
      }
      setDataQuestionSource(results);
    };
    if (selectedQuestionId !== '') {
      fetchSubmitQuizzes(); // Initially load chapter data
      fetchData();
    }
  }, [selectedQuestionId]);
  // The longitudinal information of the current course quiz or total grade of all grades
  const totalGradeColumns = [
    { title: 'Student ID', dataIndex: 'id', key: 'id' },
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
    { title: 'Student Grade', dataIndex: 'grade', key: 'grade' },
  ];
  // Add data such as students and grades
  const [dataQuizSource, setDataQuizSource] = useState<any[]>([]);
  const [dataQuizRank, setDataQuizRank] = useState<any[]>([]);
  const fetchData = async () => {
    const results: any[] = [];
    const rankResults: any[] = [];
    const users: any[] = [];
    // How many users answer questions in a quiz
    for (const infor of submitQuizes || []) {
      const existingUser = users.find((user) => user.userId === infor.user.userId);
      if (!existingUser) {
        users.push({
          userId: infor.user.userId,
          email: infor.user.email,
          name: infor.user.username,
          avatar: infor.user.avatar,
          grade: 0,
        });
      }
    }
    for (const user of users || []) {
      for (const infor of submitQuizes || []) {
        if (infor.user.userId === user.userId && infor.answer.mark !== -1) {
          user.grade += infor.answer.mark;
        }
      }
      if (user.userId === cur_userId) {
        results.push({
          id: user.email,
          name: user.name,
          grade: user.grade,
        });
      }
      rankResults.push({
        avatar: user.avatar,
        name: user.name,
        grade: user.grade,
      });
    }
    setDataQuizSource(results);
    setDataQuizRank(rankResults.sort((a, b) => b.grade - a.grade));
  }; 
  useEffect(() => {
    if (selectedQuestionId !== '') {
      fetchSubmitQuizzes(); // Initially load chapter data
      fetchData();
    }
  }, [selectedQuestionId]);

  // When selectedType is all
  // Add data such as students, rankings and grades
  const fetchGradeData = async () => {
    const users: any[] = [];
    const quizAnswerInfor: any[] = [];
    for (const quiz of quizes || []) {
      if (quiz.quizId !== '') {
        try {
          const response = await fetch(`${HOST_QUESTION}/quiz/${quiz.quizId}/answers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          const fetchedQuizes = data.data.answers;
          quizAnswerInfor.push(fetchedQuizes);
        } catch (error:any) {
          message.error(error.message);
        }
      }
    }
    for (const quiz of quizAnswerInfor || []) {
      for (const answer of quiz || []) {
        const existingUser = users.find((user) => user.userId === answer.user.userId);
        if (existingUser) {
          if (answer.answer.mark !== -1) {
            users.find((user) => user.userId === answer.user.userId).grade += answer.answer.mark
          }
        } else {
          if (answer.answer.mark === -1) {
            users.push({
              userId: answer.user.userId,
              email: answer.user.email,
              name: answer.user.username,
              grade: 0,
              avatar: answer.user.avatar,
            });
          } else {
            users.push({
              userId: answer.user.userId,
              email: answer.user.email,
              name: answer.user.username,
              grade: answer.answer.mark,
              avatar: answer.user.avatar,
            });
          }
        }
      }
    }
    const assSubmitsInfor: any[] = [];
    for (const ass of assInfor || []) {
      if (ass.assignmentId !== '') {
        try {
          const response = await fetch(`${HOST_ASSIGNMENT}/assignment/${ass.assignmentId}/submits`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
          const fetchedAssignments = data.data.assignment.submits;
          assSubmitsInfor.push(fetchedAssignments);
        } catch (error:any) {
          message.error(error.message);
        }
      }
    }
    for (const assSubmits of assSubmitsInfor || []) {
      for (const submit of assSubmits || []) {
        const existingUser = users.find((user) => user.userId === submit.userId);
        if (existingUser) {
          if (submit.mark !== -1) {
            users.find((user) => user.userId === submit.userId).grade += submit.mark
          }
        } else {
          if (submit.mark === -1) {
            users.push({
              userId: submit.userId,
              email: submit.email,
              name: submit.username,
              grade: 0,
              avatar: submit.avatar,
            });
          } else {
            users.push({
              userId: submit.userId,
              email: submit.email,
              name: submit.username,
              grade: submit.mark,
              avatar: submit.avatar,
            });
          }          
        }
      }
    }
    const results: any[] = [];
    for (const user of users || []) {
      if (user.userId === cur_userId) {
        results.push({
          id: user.email,
          name: user.name,
          grade: user.grade,
        });
      }
    }
    return [results, users];
  };
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [firstSixData, setFirstSixData] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (selectedType === "total") {
        const results = await fetchGradeData();
        setDataSource(results[0]);
        const users: any[] = [];
        for (const user of results[1].sort((a, b) => b.grade - a.grade) || []) {
          users.push({
            avatar: user.avatar,
            name: user.name,
            grade: user.grade,
          });
        }
        setFirstSixData(users);
      }
    };
    fetchData();
  }, [selectedType]);
  
  return (
    <>
    <div onClick={() => setOpen(true)} style={{ position: 'relative', height: '50px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <CrownOutlined style={{ fontSize: '32px' }} />
      <div style={{marginRight: '-3px'}}>Medal</div>
    </div>
    <Modal
        title="My Medal"
        centered
        open={open}
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        style={{fontFamily: 'Comic Sans MS'}}
      >
        <List
          itemLayout="horizontal"
          dataSource={medal}
          renderItem={item => (
            <List.Item >
              <List.Item.Meta
                title={item.title}
                description={
                  item.medals && item.medals.length > 0 ? (
                    <div style={{ display: 'flex',alignItems: 'center',justifyContent:'flex-start' }}>
                      {item.medals.map((medal, index) => (
                        <div key={index} style={{ marginRight: '20px' }}>
                          <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                          <img src={medalImages[medal as MedalType]} alt="medal" style={{ width: '100px' }} />
                          {item.description && <p>{item.description[index]}</p>}
                        </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>Come on!You can do it!</div>
                  )
                }
              />
            </List.Item>
          )}
          style={{ marginTop: '-20px', padding: 0 }}
        />
    </Modal>
    <Content
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '30px', margin: '30px auto', borderRadius: '10px', background: '#FFFFFF',
        maxWidth: '800px', width: '100%', height: 'auto',
        // border: '1px solid red'
      }}
    >
      {/* <Text>{token}</Text> */}
      <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>{course.title}: Students Grades</Title>
      <Form style={{ margin: '0 auto', maxWidth: '700px', width: '100%' }}>
        <Form.Item>
          <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Choose Type:</Text>
          <Select
            placeholder="Select Option"
            style={{ width: '100%', fontFamily: 'Comic Sans MS' }}
            value={selectedType}
            onChange={value => setSelectedType(value)}
          >
            <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="assignments">Assignments</Select.Option>
            <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="quizzes">Quizzes</Select.Option>
            <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="total">View All Grade</Select.Option>
          </Select>
        </Form.Item>
        {selectedType === 'assignments' && 
          <>
          <Form.Item>
            <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Choose one assignment:</Text>
            <Select
              placeholder="Select Option"
              style={{ width: '100%', fontFamily: 'Comic Sans MS' }}
              onChange={handleAssignmentIdChange}
              value={selectedAssignmentId}
            >
              {(assInfor || []).map((singleAssignment: any) => (
                <Select.Option
                  key={singleAssignment.assignmentId}
                  style={{ fontFamily: 'Comic Sans MS', color: 'black' }}
                  value={singleAssignment.assignmentId}
                >
                  {singleAssignment.title}
                </Select.Option>
              ))}
            </Select>              
          </Form.Item>
          <Form.Item>
            {selectedAssignmentId !== '' && 
              <>
              <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Ranking</Text>
              
              <div style={{ height: 'auto', display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={crown} width={'10%'}/>
                </div>

                <div style={{ flex: 1, display: 'flex' }}>
                    
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {dataAssignmentRank[1] && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Badge.Ribbon text="2st" placement="start" color='silver'>
                          <Content
                            style={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                              width: '200px', height: '120px',
                              border: '1px solid black'
                            }}
                          >
                            <img src={dataAssignmentRank[1].avatar} width={'40%'}/>
                            <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                {dataAssignmentRank[1].name.length > 6 ? dataAssignmentRank[1].name.substring(0, 3) + '...' : dataAssignmentRank[1].name}
                              </span>
                            </Text>
                            <div>
                              <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                                {dataAssignmentRank[1].grade}
                              </Text>
                            </div>
                          </Content>
                        </Badge.Ribbon>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {dataAssignmentRank[0] && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginRight: '10px', marginLeft: '10px' }}>
                        <Badge.Ribbon text="1st" placement="start" color='red'>
                          <Content
                            style={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                              width: '200px', height: '120px',
                              border: '1px solid black'
                            }}
                          >
                            <img src={dataAssignmentRank[0].avatar} width={'40%'}/>
                            <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                {dataAssignmentRank[0].name.length > 6 ? dataAssignmentRank[0].name.substring(0, 3) + '...' : dataAssignmentRank[0].name}
                              </span>
                            </Text>
                            <div>
                              <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                                {dataAssignmentRank[0].grade}
                              </Text>
                            </div>
                          </Content>
                        </Badge.Ribbon>
                      </div>                  
                    )}
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {dataAssignmentRank[2] && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Badge.Ribbon text="3st" placement="start" color='orange'>
                          <Content
                            style={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                              width: '200px', height: '120px',
                              border: '1px solid black'
                            }}
                          >
                            <img src={dataAssignmentRank[2].avatar} width={'40%'}/>
                            <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                {dataAssignmentRank[2].name.length > 6 ? dataAssignmentRank[2].name.substring(0, 3) + '...' : dataAssignmentRank[2].name}
                              </span>
                            </Text>
                            <div>
                              <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                                {dataAssignmentRank[2].grade}
                              </Text>
                            </div>
                          </Content>
                        </Badge.Ribbon>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table 
                  style={{ border: '1px solid grey', width: '100%', fontFamily: 'Comic Sans MS' }} 
                  key={selectedAssignmentId} 
                  dataSource={dataAssignmentSource} 
                  columns={assignmentColumns} 
                />
              </div>
              {isFileVisible && (
                <>
                <Modal title="Submitted Files" open={isFileVisible} onCancel={handleModalClose} style={{fontFamily: 'Comic Sans MS'}} footer={[
                  <Button key="cancel" onClick={handleModalClose}>
                    Cancel
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleDownload}>
                    Save
                  </Button>,
                ]}>
                  <Form>
                    <Form.Item>
                      <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Choose the following assignment submit files:</Text>
                    </Form.Item>
                    {(files || []).map((file: any) => (
                      <div key={file.file}>
                      <>
                        <div key={file.file} style={{ display: 'flex', marginBottom: '5px' }}>
                          <div style={{ flex: 1 }}>
                            <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >
                              {file.filename}
                            </Text>
                          </div>
                          <Checkbox
                            style = {{marginTop: '5px'}}
                            checked={selectedMultiOption.includes(file.file)}
                            onChange={() => handleCheckBoxChange(file.file)}
                          />
                        </div>
                      </>
                      </div>
                    ))}
                  </Form>
                </Modal>
                </>
              )}
              </>
            }
          </Form.Item>
          </>
        }
        {selectedType === 'quizzes' && 
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item style={{ flex: 1 }}>
                <Text style={{ flex: 1, fontFamily: 'Comic Sans MS' }} >Choose one quiz:</Text>
                <Select
                  placeholder="Select Option"
                  style={{ flex: 2, fontFamily: 'Comic Sans MS' }}
                  onChange={handleQuizIdChange}
                  value={selectedQuizId}
                >
                  {(quizes || []).map((singleQuiz: any) => (
                    <Select.Option
                      key={singleQuiz.quizId}
                      style={{ fontFamily: 'Comic Sans MS', color: 'black' }}
                      value={singleQuiz.quizId}
                    >
                      {singleQuiz.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {selectedQuizId !== '' &&
                <>
                <Form.Item style={{ flex: 1 }}>
                  <Text style={{ flex: 1, fontFamily: 'Comic Sans MS' }} >Choose one question:</Text>
                  <Select
                    key={selectedQuizId}
                    placeholder="Select Option"
                    style={{ flex: 2, fontFamily: 'Comic Sans MS' }}
                    onChange={handleQuestionIdChange}
                    value={selectedQuestionId}
                  >
                    {(allQuestions || []).map((question: any) => (
                      <Select.Option
                        key={question.questionId}
                        style={{ fontFamily: 'Comic Sans MS', color: 'black' }}
                        value={question.questionId}
                      >
                        {question.content}
                      </Select.Option>
                    ))}
                    <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="all">ALL</Select.Option>
                  </Select>
                </Form.Item>
                </>
              }
            </div>
            <Form.Item>
            {selectedQuestionId !== '' && selectedQuestionId !== 'all' && 
              <>
              <Form.Item>
                <div>
                  <Text style={{ width: '100%', fontFamily: 'Comic Sans MS', fontWeight: 'bold' }} >Question Content:</Text>
                </div>
                {(allQuestions || []).map((question: any) => {
                  if (question.questionId === selectedQuestionId) {
                    return <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }}>{question.content}</Text>;
                  }
                })}
              </Form.Item>
              <div>
                <Text style={{ width: '100%', fontFamily: 'Comic Sans MS', fontWeight: 'bold' }} >Grade List:</Text>
              </div>
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table 
                  style={{ border: '1px solid grey', width: '100%', fontFamily: 'Comic Sans MS' }} 
                  key={selectedQuestionId} 
                  dataSource={dataQuestionSource} 
                  columns={quizColumns} 
                />
              </div>
              </>
            }
            {selectedQuestionId === 'all' &&
              <>
                <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Ranking</Text>
                
                <div style={{ height: 'auto', display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={crown} width={'10%'}/>
                  </div>

                  <div style={{ flex: 1, display: 'flex' }}>
                    
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                      {dataQuizRank[1] && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                          <Badge.Ribbon text="2st" placement="start" color='silver'>
                            <Content
                              style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                                width: '200px', height: '120px',
                                border: '1px solid black'
                              }}
                            >
                              <img src={dataQuizRank[1].avatar} width={'40%'}/>
                              <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                  {dataQuizRank[1].name.length > 6 ? dataQuizRank[1].name.substring(0, 3) + '...' : dataQuizRank[1].name}
                                </span>
                              </Text>
                              <div>
                                <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                                  {dataQuizRank[1].grade}
                                </Text>
                              </div>
                            </Content>
                          </Badge.Ribbon>
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {dataQuizRank[0] && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginRight: '10px', marginLeft: '10px' }}>
                          <Badge.Ribbon text="1st" placement="start" color='red'>
                            <Content
                              style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                                width: '200px', height: '120px',
                                border: '1px solid black'
                              }}
                            >
                              <img src={dataQuizRank[0].avatar} width={'40%'}/>
                              <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                  {dataQuizRank[0].name.length > 6 ? dataQuizRank[0].name.substring(0, 3) + '...' : dataQuizRank[0].name}
                                </span>
                              </Text>
                              <div>
                                <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                                  {dataQuizRank[0].grade}
                                </Text>
                              </div>
                            </Content>
                          </Badge.Ribbon>
                        </div>                  
                      )}
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {dataQuizRank[2] && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                          <Badge.Ribbon text="3st" placement="start" color='orange'>
                            <Content
                              style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                                width: '200px', height: '120px',
                                border: '1px solid black'
                              }}
                            >
                              <img src={dataQuizRank[2].avatar} width={'40%'}/>
                              <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                  {dataQuizRank[2].name.length > 6 ? dataQuizRank[2].name.substring(0, 3) + '...' : dataQuizRank[2].name}
                                </span>
                              </Text>
                              <div>
                                <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                                  {dataQuizRank[2].grade}
                                </Text>
                              </div>
                            </Content>
                          </Badge.Ribbon>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Show a quiz total grade for student</Text>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <Table 
                    style={{ border: '1px solid grey', width: '100%', fontFamily: 'Comic Sans MS' }} 
                    key={selectedQuestionId} 
                    dataSource={dataQuizSource} 
                    columns={totalGradeColumns} 
                  />
                </div>
              </>
            }
            </Form.Item>
          </>
        }
        {selectedType === 'total' && 
          <>
          <Form.Item>
            <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Ranking</Text>
            
            <div style={{ height: 'auto', display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={crown} width={'10%'}/>
              </div>

              <div style={{ flex: 1, display: 'flex' }}>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {firstSixData[1] && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                      <Badge.Ribbon text="2st" placement="start" color='silver'>
                        <Content
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                            width: '200px', height: '120px',
                            border: '1px solid black'
                          }}
                        >
                          <img src={firstSixData[1].avatar} width={'40%'}/>
                          <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                              {firstSixData[1].name.length > 6 ? firstSixData[1].name.substring(0, 3) + '...' : firstSixData[1].name}
                            </span>
                          </Text>
                          <div>
                            <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                              {firstSixData[1].grade}
                            </Text>
                          </div>
                        </Content>
                      </Badge.Ribbon>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {firstSixData[0] && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginRight: '10px', marginLeft: '10px' }}>
                      <Badge.Ribbon text="1st" placement="start" color='red'>
                        <Content
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                            width: '200px', height: '120px',
                            border: '1px solid black'
                          }}
                        >
                          <img src={firstSixData[0].avatar} width={'40%'}/>
                          <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                              {firstSixData[0].name.length > 6 ? firstSixData[0].name.substring(0, 3) + '...' : firstSixData[0].name}
                            </span>
                          </Text>
                          <div>
                            <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                              {firstSixData[0].grade}
                            </Text>
                          </div>
                        </Content>
                      </Badge.Ribbon>
                    </div>                  
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {firstSixData[2] && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                      <Badge.Ribbon text="3st" placement="start" color='orange'>
                        <Content
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                            width: '200px', height: '120px',
                            border: '1px solid black'
                          }}
                        >
                          <img src={firstSixData[2].avatar} width={'40%'}/>
                          <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                              {firstSixData[2].name.length > 6 ? firstSixData[2].name.substring(0, 3) + '...' : firstSixData[2].name}
                            </span>
                          </Text>
                          <div>
                            <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', fontWeight: 'bold', }}>
                              {firstSixData[2].grade}
                            </Text>
                          </div>
                        </Content>
                      </Badge.Ribbon>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form.Item>
          <Form.Item>
            <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Show total grade for student</Text>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <Table 
                style={{ border: '1px solid grey', width: '100%', fontFamily: 'Comic Sans MS' }} 
                key={selectedType} 
                dataSource={dataSource} 
                columns={totalGradeColumns} 
              />
            </div>
          </Form.Item>
          </>
        }
      </Form>
    </Content>
    </>
  );
};

export default StudentRank;