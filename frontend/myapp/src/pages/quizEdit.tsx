import React, { useEffect, useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, DatePicker, TimePicker, message  } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getToken} from '../utils/utils'
import { validNotNull } from '../utils/utilsStaff';
import { QuizDTO } from '../utils/entities';
import Quiz from './Quiz';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean'],
  ],
};
const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'align',
  'list',
  'indent',
  'link',
  'image',
  'video',
  'color',
  'background',
];

const QuizEdit: React.FC<{ onCancel: () => void; onSubmit: () => void; quiz: any }> = ({ onCancel, onSubmit, quiz }) => {
  const token = getToken();
  const [sectionInfor, setSectionInfor] = useState(quiz || {});
  useEffect(() => {
    setTitle(quiz.title);
    setLimitation(quiz.limitation);

    setSectionInfor(quiz);

    form.setFieldsValue({
      "Title": quiz.title,
      "quiz attempt time": quiz.limitation
    })
  }, [quiz])
  
  const [title, setTitle] = useState("");
  const handleStreamTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [limitation, setLimitation] = useState("");
  const handleStreamDescriptionChange = (e: any) => {
    setLimitation(e.target.value);
  };
  const [start, setStart] = useState("");
  const handleStreamStartChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setStart(formattedDate);
    }
  };
  const [end, setEnd] = useState("");
  const handleStreamEndChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setEnd(formattedDate);
    }
  };
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('quiz', quiz);
    setTitle(quiz.title);
    setStart(quiz.start);
    setEnd(quiz.end);
    setLimitation(quiz.limitation);


    form.setFieldsValue({
      "Title": quiz.title,
      "quiz attempt time": quiz.limitation
    })
  }, [quiz])

  const handleSubmit = () => {
    // 处理提交逻辑
    const dto = new QuizDTO(title,start, end,limitation);
    const requestData = JSON.stringify(dto);
    fetch(`/service-edu/edu-quiz/quiz/${quiz.quizId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: requestData
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res);
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      else {
        message.success('Stream updated successfully');
        onSubmit();
      }
    })
    .catch(error => {
      message.error(error.message);
    });
  };
  
  return (
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Edit Stream Lesson</Title>
        <Form form={form} style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                 Title
              </Text>
            } 
            name="Title" 
            rules={[
              { max: 100, message: 'The quiz title must be less than 100 characters!' },
            ]}
          >
            <Input 
              placeholder={quiz.title}
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
              onChange={handleStreamTitleChange}
            />
          </Form.Item>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Quiz Attempt Time
              </Text>
            } 
            name="quiz attempt time" 
          >
            <Input
                type="number"
                placeholder="Input Number"
                style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
                onChange={handleStreamDescriptionChange}
              />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Start Date and Time
              </Text>
            }
            name="startDateTime"
          >
            <DatePicker placeholder={quiz.start} showTime onOk={handleStreamStartChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                End Date and Time
              </Text>
            }
            name="endDateTime"
          >
            <DatePicker placeholder={quiz.end} showTime onOk={handleStreamEndChange} />
          </Form.Item>
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
  );
};

export default QuizEdit;
