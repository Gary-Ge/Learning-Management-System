import React, { useState, useEffect } from 'react';
import { Layout, theme, Typography, Button, Form, Modal, Select, Table, message, InputNumber, Badge, Checkbox } from 'antd';
import {
  CheckCircleOutlined,
  HeartFilled
} from '@ant-design/icons';
import './StaffDashboardContent.less';
import './TextLesson.css';
import crown from '../../../images/crown.png';
import downloadicon from '../../../images/download.png';
import { getToken } from '../utils/utils'
import { ShowMarkDTO } from '../utils/entities';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;
const values: any[] = [];
// Mark当前课程所选的assignment或quiz
const GradeInput: React.FC<{ mark: number, fetchUrl: string, handleValue: (value: any, fetchUrl: any) => void }> = ({ mark, fetchUrl, handleValue }) => {
  const token = getToken();
  const [gradeValue, setGradeValue] = useState<number>(mark);
  useEffect(() => {
    setGradeValue(mark); // 在初始渲染时更新标记值
  }, [mark]);
  const handleInputBlur = () => {
    handleValue(gradeValue, fetchUrl);
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const dto = new ShowMarkDTO(gradeValue);
      const requestData = JSON.stringify(dto);
      fetch(fetchUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: requestData
      })
      .then(res => res.json())
      .then(res => {
        // console.log('res', res)
        if (res.code !== 20000) {
          throw new Error(res.message)
        }
        message.success('Mark Successfully!');
      })
      .catch(error => {
        message.error(error.message);
      });
    }
  };
  return (
    <>
    <InputNumber
      min={0}
      value={gradeValue}
      onChange={(value:any) => setGradeValue(value)}
      onBlur={handleInputBlur}
      onPressEnter={handleKeyPress}
    />
    </>
  );
};

const ShowMark: React.FC<{ quizes: any; course: any; assInfor: any; onCancel: () => void; onSubmit: () => void }> = ({ quizes, course, assInfor, onCancel, onSubmit }) => {
  const token = getToken();

  const [selectedType, setSelectedType] = useState('');

  // 当selectedType为assignment时
  // 选择一个课程的任意assignment
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const handleAssignmentIdChange = (value: string) => {
    const selectedSingleAssignment = assInfor.find((singleAssignment: any) => singleAssignment.assignmentId === value);
    if (selectedSingleAssignment) {
      setSelectedAssignmentId(selectedSingleAssignment.assignmentId);
    }
  };
  // 获取当前课程所选的assignment中上交的所有user的信息和submitId
  const [submitAssignments, setSubmitAssignments] = useState<any[]>([]);
  const fetchSubmitAssignments = async () => {
    try {
      const response = await fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${selectedAssignmentId}/submits`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const fetchedAssignments = data.data.assignment.submits;
      setSubmitAssignments(fetchedAssignments);
    } catch (error:any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchSubmitAssignments(); // 初始加载章节数据
  }, [selectedAssignmentId]);
  // 添加学生以及其上传assignment的数据信息
  const [dataAssignmentSource, setDataAssignmentSource] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const results: any[] = [];
      for (const student of submitAssignments || []) {
        // console.log('student.files.submitId', student.files[0].submitId)
        const files: any[] = [];
        for (const file of student.files || []) {
          try {
            const response = await fetch(
              `http://175.45.180.201:10900/service-edu/edu-assignment/submit/${file.submitId}`,
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
            console.log(error.message);
          }
        }
        results.push({
          id: student.email,
          name: student.username,
          grade: [student.mark, student.userId],
          download: files,
        });
      }
      setDataAssignmentSource(results);
    };
    fetchData();
  }, [submitAssignments, selectedType]);
  // 点击下载学生上传的assignment
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
  const handleValue = (value: any, fetchUrl: any) => {
    const existingValue = values.find(item => item.url === fetchUrl);
    if (existingValue) {
      values.find(item => item.url === fetchUrl).value = value
    } else {
      values.push({
        value: value,
        url: fetchUrl,
      })
    }
  };
  // 当前课程所选assignment的纵坐标信息
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
    {
      title: 'Students Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (record: any) => {
        const foundValue = (values || []).find((value: any) => {
          return value.url === `http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${selectedAssignmentId}/mark/${record[1]}`;
        });
        if (foundValue) {
          return (
            <GradeInput
              mark={foundValue.value}
              fetchUrl={`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${selectedAssignmentId}/mark/${record[1]}`}
              handleValue={handleValue}
            />
          );
        } else {
          return (
            <GradeInput
              mark={record[0]}
              fetchUrl={`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${selectedAssignmentId}/mark/${record[1]}`}
              handleValue={handleValue}
            />
          );
        }
      },
    },
  ];

  // 当selectedType为quiz时
  // 选择一个课程的任意quiz
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const handleQuizIdChange = (value: string) => {
    const selectedSingleQuiz = quizes.find((singleQuiz: any) => singleQuiz.quizId === value);
    if (selectedSingleQuiz) {
      setSelectedQuizId(selectedSingleQuiz.quizId);
    }
  };
  // 获取当前课程所选的quiz中所有上交的user, question和answer的信息
  const [submitQuizes, setSubmitQuizes] = useState<any[]>([]);
  const fetchSubmitQuizzes = async () => {
    try {
      const response = await fetch(`http://175.45.180.201:10900/service-edu/edu-question/quiz/${selectedQuizId}/answers`, {
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
      console.log(error.message);
    }
  };
  // 当前课程所选quiz的所有questions
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const fetchAllQuestions = async () => {
    try {
      const response = await fetch(`http://175.45.180.201:10900/service-edu/edu-question/questions/${selectedQuizId}`, {
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
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchSubmitQuizzes(); // 初始加载章节数据
    fetchAllQuestions();
  }, [selectedQuizId]);
  // 选择一个课程的一个quiz的任意一个question
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const handleQuestionIdChange = (value: string) => {
    const selectedQuestion = allQuestions.find((question: any) => question.questionId === value);
    if (selectedQuestion) {
      setSelectedQuestionId(selectedQuestion.questionId);
    } else {
      setSelectedQuestionId(value);
    }
  };
  // 当前课程quiz所选question的纵坐标信息
  const quizColumns = [
    { title: 'Student ID', dataIndex: 'id', key: 'id' },
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
    { title: 'Student Answer', dataIndex: 'answer', key: 'answer' },
    { title: 
      'Student Grade', 
      dataIndex: 'grade', 
      key: 'grade', 
      render: (record: any) => {
        const foundValue = (values || []).find((value: any) => {
          return value.url === `http://175.45.180.201:10900/service-edu/edu-question/question/${selectedQuestionId}/mark/${record[1]}`;
        });
        if (foundValue) {
          return (
            <GradeInput
              mark={foundValue.value}
              fetchUrl={`http://175.45.180.201:10900/service-edu/edu-question/question/${selectedQuestionId}/mark/${record[1]}`}
              handleValue={handleValue}
            />
          );
        } else {
          return (
            <GradeInput
              mark={record[0]}
              fetchUrl={`http://175.45.180.201:10900/service-edu/edu-question/question/${selectedQuestionId}/mark/${record[1]}`}
              handleValue={handleValue}
            />
          );
        }
      },
    },
  ];
  // 添加学生, 答案, 成绩等数据信息
  const [dataQuestionSource, setDataQuestionSource] = useState<any[]>([]);
  useEffect(() => {
    // setSelectedQuestionId(selectedQuestionId);
    fetchSubmitQuizzes(); // 初始加载章节数据
    const fetchData = async () => {
      const results: any[] = [];
      for (const infor of submitQuizes || []) {
        if (infor.question.questionId === selectedQuestionId) {
          if (infor.question.type === 0 || infor.question.type === 1) {
            results.push({
              id: infor.user.email,
              name: infor.user.username,
              answer: infor.answer.optionIds,
              grade: [infor.answer.mark, infor.answer.userId],
            });
          }
          else if (infor.question.type === 2) {
            results.push({
              id: infor.user.email,
              name: infor.user.username,
              answer: infor.answer.content,
              grade: [infor.answer.mark, infor.answer.userId],
            });
          }          
        }
      }
      setDataQuestionSource(results);
    };  
    fetchData();
    // setSelectedQuestionId(selectedQuestionId);
  }, [selectedQuestionId]);
  // 当前课程quiz或所有成绩的total grade的纵坐标信息
  const totalGradeColumns = [
    { title: 'Student ID', dataIndex: 'id', key: 'id' },
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
    { title: 'Student Grade', dataIndex: 'grade', key: 'grade' },
  ];
  // 添加学生和成绩等数据信息
  const [dataQuizSource, setDataQuizSource] = useState<any[]>([]);
  const fetchData = async () => {
    const results: any[] = [];
    const users: any[] = [];
    // 一个quiz中有多少个user进行答题
    for (const infor of submitQuizes || []) {
      const existingUser = users.find((user) => user.userId === infor.user.userId);
      if (!existingUser) {
        users.push({
          userId: infor.user.userId,
          email: infor.user.email,
          name: infor.user.username,
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
      results.push({
        id: user.email,
        name: user.name,
        grade: user.grade,
      });
    }
    setDataQuizSource(results);
  }; 
  useEffect(() => {
    // setSelectedQuestionId(selectedQuestionId);
    fetchSubmitQuizzes(); // 初始加载章节数据 
    fetchData();
    // setSelectedQuestionId(selectedQuestionId);
  }, [selectedQuestionId]);
  
  // 当selectedType为all时
  // 添加学生, 排名和成绩等数据信息
  const fetchGradeData = async () => {
    const users: any[] = [];
    const quizAnswerInfor: any[] = [];
    for (const quiz of quizes || []) {
      try {
        const response = await fetch(`http://175.45.180.201:10900/service-edu/edu-question/quiz/${quiz.quizId}/answers`, {
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
        console.log(error.message);
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
      try {
        const response = await fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${ass.assignmentId}/submits`, {
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
        console.log(error.message);
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
      results.push({
        id: user.email,
        name: user.name,
        grade: user.grade,
      });
    }
    return [results, users];
  };
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [firstSixData, setFirstSixData] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (selectedType === "total") {
        const results = await fetchGradeData();
        setDataSource(results[0].sort((a, b) => b.grade - a.grade));
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
  const rankColumns = [
    { title: 'Student Avatar', 
      dataIndex: 'avatar', 
      key: 'avatar',
      width: 200,
      align: 'center',
      render: (record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={record} width={'30%'} />
        </div>
      ),
    },
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
    { title: 'Student Grade', dataIndex: 'grade', key: 'grade' },
  ];

  const handleCancel = () => {
    values.length = 0;
    onCancel(); // Call the onCancel function received from props
  };
  const handleSubmit = () => {
    // 处理提交逻辑
    for (const value of values || []) {
      const dto = new ShowMarkDTO(value.value);
      const requestData = JSON.stringify(dto);
      fetch(value.url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: requestData
      })
      .then(res => res.json())
      .then(res => {
        // console.log('res', res)
        if (res.code !== 20000) {
          throw new Error(res.message)
        }
      })
      .catch(error => {
        message.error(error.message);
      });
    }
    values.length = 0;
    message.success('Mark Successfully!');
    onSubmit();
  };

  return (
    <>
    <Layout style={{ backgroundColor: '#EFF1F6', height: 'auto' }}>
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
                <Text style={{ fontFamily: 'Comic Sans MS', color: 'red' }} >Please press the key "Enter" to update grade</Text>
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
                <Text style={{ fontFamily: 'Comic Sans MS', color: 'red' }} >Please press the key "Enter" to update grade</Text>
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
                <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Show a quiz total grade for each student</Text>
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
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '10px 200px 0 200px', marginBottom: '10px' }}>
                {firstSixData[1] && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Badge.Ribbon text="2st" placement="start" color='silver'>
                      <Content
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                          width: '100%', height: 'auto',
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
                {firstSixData[0] && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <img src={crown} width={'30%'}/>
                    <Badge.Ribbon text="1st" placement="start" color='red'>
                      <Content
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          padding: '10px', borderRadius: '10px', background: '#FFFFFF',
                          width: '100%', height: 'auto',
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
                {firstSixData[2] && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Badge.Ribbon text="3st" placement="start" color='orange'>
                      <Content
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          padding: '10px', borderRadius: '10px', background: '#FFFFFF', marginBottom: '0',
                          width: '100%', height: 'auto',
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
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table 
                  style={{ border: '1px solid grey', width: '100%', fontFamily: 'Comic Sans MS' }} 
                  dataSource={firstSixData} 
                  columns={rankColumns} 
                />
              </div>
            </Form.Item>
            <Form.Item>
              <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Show total grade for each student</Text>
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
        <Form.Item>
          <Button type="primary" onClick={handleSubmit} style={{ fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }}>
            Submit
          </Button>
          <Button style={{ marginLeft: '10px', fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }} onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor: '#EFF1F6',
          fontFamily: 'Comic Sans MS',
        }}
      >
        Copyright ©2023 All rights reserved
        <HeartFilled style={{ color: 'red', marginLeft: '5px' }} />
      </Footer>
    </Layout>
    </>
  );
};

export default ShowMark;