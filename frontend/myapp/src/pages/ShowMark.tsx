import React, { useState, useEffect } from 'react';
import { Layout, theme, Typography, Button, Form, Input, Select, Table, message, InputNumber } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import { getToken } from '../utils/utils'
import {
  HeartFilled,
} from '@ant-design/icons';
import { validNotNull } from '../utils/utilsStaff';
import { TextLessonDTO } from '../utils/entities';
import {
  CheckCircleOutlined,
} from '@ant-design/icons';
const { Content, Footer } = Layout;
const { Title, Text } = Typography;
import downloadicon from '../../../images/download.png';
import { ShowMarkDTO } from '../utils/entities';

const ShowMark: React.FC<{ quizes: any; course: any; assInfor: any; onCancel: () => void; onSubmit: () => void }> = ({ quizes, course, assInfor, onCancel, onSubmit }) => {
  const token = getToken();

  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  const handleSubmit = () => {
    // 处理提交逻辑
    onSubmit();
  };

  const [selectedId, setSelectedId] = useState<string>("");
  const handleChange = (value: string) => {
    const selectedAss = assInfor.find((assOption: any) => assOption.assignmentId === value);
    if (selectedAss) {
      setSelectedId(selectedAss.assignmentId);
    }
    else {
      setSelectedId(value)
    }
  };
  const [submitAssignments, setSubmitAssignments] = useState<any[]>([]);
  const fetchSubmitAssignments = async () => {
    try {
      const response = await fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${selectedId}/submits`, {
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
  }, [selectedId]);


  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const handleQuizChange = (value: string) => {
    const selectedQuiz = quizes.find((quiz: any) => quiz.quizId === value);
    if (selectedQuiz) {
      setSelectedQuizId(selectedQuiz.quizId);
    }
  };
  const [submitQuizes, setSubmitQuizes] = useState<any[]>([]);
  const fetchSubmitQuizes = async () => {
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
  useEffect(() => {
    fetchSubmitQuizes(); // 初始加载章节数据
  }, [selectedQuizId]);

  
  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const results: any[] = [];
      for (const student of submitAssignments || []) {
        // console.log('student.files.submitId', student.files[0].submitId)
        try {
          const response = await fetch(
            `http://175.45.180.201:10900/service-edu/edu-assignment/submit/${student.files[0].submitId}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          const assignmentSubmitFileUrl = data.data.fileUrl;
          // console.log('assignmentSubmitFileUrl', assignmentSubmitFileUrl)
          
          results.push({
            id: student.email,
            name: student.username,
            grade: [student.mark, student.userId],
            download: assignmentSubmitFileUrl,
          });
        } catch (error: any) {
          console.log(error.message);
        }
      }
  
      setDataSource(results);
    };
  
    fetchData();
  }, [submitAssignments]);

  const handleDownload = (url: string) => {
    // 创建一个虚拟的<a>标签，设置下载链接和文件名，模拟点击下载操作
    const w:any = window.open("about:blank");  
    w.location.href = url;
  };

  const GradeInput: React.FC<{ mark: number, userId: string }> = ({ mark, userId }) => {
    const [gradeValue, setGradeValue] = useState<number>(mark);

    const handleGradeChange = (value: number) => {
      console.log('Grade changed', value, userId);
      setGradeValue(value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        // 处理按下 Enter 键的逻辑，可以与 onChange 事件有相同的效果
        console.log('Enter key pressed', gradeValue, userId);
        // 其他处理逻辑...
        const dto = new ShowMarkDTO(gradeValue);
        const requestData = JSON.stringify(dto);
        fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${selectedId}/mark/${userId}`, {
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
        onChange={handleGradeChange}
        onPressEnter={handleKeyPress}
      />
      </>
    );
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'id', key: 'id' },
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Download | View',
      dataIndex: 'download',
      key: 'download',
      render: (download: string) => (
        <Button
          onClick={() => handleDownload(download)}
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
      ),
    },
    {
      title: 'Students Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (record: any) => (
        <GradeInput mark={record[0]} userId={record[1]} />
      ),
    },
  ];

  const quizcolumns = [
    { title: 'Student ID', dataIndex: 'id', key: 'id' },
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
  ];
  return (
    <>
      {/* <input defaultValue={token}></input> */}
      <Layout style={{ backgroundColor: '#EFF1F6' }}>
        <Content
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            background: '#FFFFFF',
            borderRadius: '10px',
            maxWidth: '800px',
            width: '100%',
            margin: '30px auto',
            height: 'auto',
            // border: '1px solid red'
          }}
        >
          <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>{course.title}: Students Grades</Title>
          <Form style={{ margin: '0 auto', maxWidth: '700px' }}>
            <Form.Item>
              <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Choose Type:</Text>
              <Select
                placeholder="Select Option"
                style={{ width: '100%', fontFamily: 'Comic Sans MS' }}
                onChange={handleChange}
                value={selectedId}
              >
                {(assInfor || []).map((assOption: any) => (
                  <Select.Option
                    key={assOption.assignmentId}
                    style={{ fontFamily: 'Comic Sans MS', color: 'black' }}
                    value={assOption.assignmentId}
                  >
                    {assOption.title}
                  </Select.Option>
                ))}
                <Select.Option
                  key="quizes"
                  style={{ fontFamily: 'Comic Sans MS', color: 'black' }}
                  value="Quizes"
                >
                  ALL Quizes
                </Select.Option>
              </Select>
            </Form.Item>
            {selectedId === 'Quizes' ? (
              <>
              <Form.Item>
                <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Choose Quiz:</Text>
                <Select
                  placeholder="Select Option"
                  style={{ width: '100%', fontFamily: 'Comic Sans MS' }}
                  onChange={handleQuizChange}
                  value={selectedQuizId}
                >
                  {(quizes || []).map((quiz: any) => (
                    <Select.Option
                      key={quiz.quizId}
                      style={{ fontFamily: 'Comic Sans MS', color: 'black' }}
                      value={quiz.quizId}
                    >
                      {quiz.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{  }}>
                <Select
                  key={selectedQuizId}
                  placeholder="Select Option"
                  style={{ width: '100%', fontFamily: 'Comic Sans MS' }}
                  // onChange={handleQuizChange}
                  // value={selectedQuizId}
                >
                  <Select.Option
                    >
                      {selectedQuizId}
                    </Select.Option>
                  {/* {(quizes || []).map((quiz: any) => (
                    <Select.Option
                      key={quiz.quizId}
                      style={{ fontFamily: 'Comic Sans MS', color: 'black' }}
                      value={quiz.quizId}
                    >
                      {quiz.title}
                    </Select.Option>
                  ))} */}
                </Select>
                {/* <Text style={{ fontFamily: 'Comic Sans MS', color: 'red' }} >Please press the key "Enter" to update grade</Text> */}
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <Table 
                    style={{ border: '1px solid grey', width: '100%', fontFamily: 'Comic Sans MS' }} 
                    key={selectedQuizId} 
                    // dataSource={dataSource} 
                    columns={quizcolumns} 
                  />
                </div>
              </Form.Item>
              </>
            ) : (
              <Form.Item style={{  }}>
                <Text style={{ fontFamily: 'Comic Sans MS', color: 'red' }} >Please press the key "Enter" to update grade</Text>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <Table 
                    style={{ border: '1px solid grey', width: '100%', fontFamily: 'Comic Sans MS' }} 
                    key={selectedId} 
                    dataSource={dataSource} 
                    columns={columns} 
                  />
                </div>
              </Form.Item>
            )}
            
            <Form.Item>
              <Button type="primary" onClick={handleSubmit} style={{ fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }}>
                Submit
              </Button>
              <Button style={{ marginLeft: '10px', fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }} onClick={handleCancel}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
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
