import React, { useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, DatePicker, TimePicker  } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploader from './FileUploader';
import { validNotNull, validNotFile } from '../utils/utilsStaff';
import { AssignmentLessonDTO } from '../utils/entities';
import moment, { Moment } from 'moment';

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
const Assignment: React.FC<{ onCancel: () => void; onSubmit: () => void; courseId: string }> = ({ onCancel, onSubmit, courseId }) => {
  const [title, setTitle] = useState("");
  const handleAssignmentTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [mark, setMark] = useState(-1);
  const handleAssignmentMarkChange = (e:any) => {
    setMark(e.target.value);
  };
  const [start, setStart] = useState("");
  const handleAssignmentStartChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setStart(formattedDate);
    }
  };
  const [end, setEnd] = useState("");
  const handleAssignmentEndChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setEnd(formattedDate);
    }
  };
  const [description, setDescription] = useState("");
  const handleAssignmentDescriptionChange = (value: string) => {
    setDescription(value);
  };
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  // upload resource
  const [fileList, setFileList] = useState<any[]>([]);

  const handleFileListChange = (newFileList: any[]) => {
    setFileList(newFileList);
  };
  const handleSubmit = () => {
    console.log(start);
    console.log(end);
    // 处理提交逻辑
    if (!validNotNull(title)) {
      alert('Please input a valid assignment title')
      return
    }
    if (!validNotNull(mark)) {
      alert('Please input a valid assignment mark')
      return
    }
    if (!validNotNull(start)) {
      alert('Please input a valid assignment start')
      return
    }
    if (!validNotNull(end)) {
      alert('Please input a valid assignment end')
      return
    }
    if (!validNotNull(description)) {
      alert('Please input a valid assignment description')
      return
    }
    if (!validNotFile(fileList)) {
      alert('Please choose a valid assignment file')
      return
    }
    const dto = new AssignmentLessonDTO(title, description, start, end, mark);
    const requestData = JSON.stringify(dto);
    // console.log('dto', dto); 
    // const token = getToken(); // 获取令牌(token)
    // const token = localStorage.getItem('token');
    // console.log(token);
    // console.log(courseId);
    fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${courseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc1MTg2MDksImV4cCI6MTY5MDExMDYwOSwiaWQiOiIwZTVjM2UwMTRjNDA1NDhkMzNjY2E0ZWQ3YjlhOWUwNCJ9.ngA7l15oOI-LyXB_Ps5kMzW_nzJDFYDOI4FmKcYIxO4`,
      },
      body: requestData
    })
    .then(res => res.json())
    .then(res => {
      // console.log('ass_res', res);
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      onSubmit();
      const formData = new FormData();

      fileList.forEach((file) => {
        formData.append("files", file);
      });

      fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/assFile/${res.data.assignmentId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc1MTg2MDksImV4cCI6MTY5MDExMDYwOSwiaWQiOiIwZTVjM2UwMTRjNDA1NDhkMzNjY2E0ZWQ3YjlhOWUwNCJ9.ngA7l15oOI-LyXB_Ps5kMzW_nzJDFYDOI4FmKcYIxO4`,
        },
        body: formData
      })
      .then(res => res.json())
      .then(res => {
        console.log('res', res);
        if (res.code !== 200) {
          throw new Error(res.message);
        }
      })
      .catch(error => {
        alert(error.message);
      });
      // history.push('/'); // redirect to login page, adjust as needed
    })
    .catch(error => {
      alert(error.message);
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Create Assignment</Title>
        <Form style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Assignment Title
              </Text>
            } 
            name="assignment title" 
            rules={[
              { required: true, message: 'Please input the assignment title!' },
              { max: 100, message: 'The assignment title must be less than 100 characters!' },
            ]}
          >
            <Input 
              placeholder="Input Title" 
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
              value={title}
              onChange={handleAssignmentTitleChange}
            />
          </Form.Item>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Assignment Mark
              </Text>
            } 
            name="assignment mark" 
            rules={[
              { required: true, message: 'Please input the assignment mark!' },
            ]}
          >
            <Input 
              type="number"
              placeholder="Input Number" 
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
              value={mark}
              onChange={handleAssignmentMarkChange}
            />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Start Date and Time
              </Text>
            }
            name="startDateTime"
            rules={[
              { required: true, message: 'Please input the assignment start time!' },
            ]}
          >
            <DatePicker placeholder="Select Start Date and Time" showTime onOk={handleAssignmentStartChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                End Date and Time
              </Text>
            }
            name="endDateTime"
            rules={[
              { required: true, message: 'Please input the assignment end time!' },
            ]}
          >
            <DatePicker placeholder="Select Start Date and Time" showTime onOk={handleAssignmentEndChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Description
              </Text>
            }
            name="description"
            rules={[
              { required: true, message: 'Please input the assignment description!' },
            ]}
          >
          </Form.Item>
          <Form.Item>
            <div className="quill-container">
              <ReactQuill
                modules={quillModules}
                formats={quillFormats}
                placeholder="You can input many words here..."
                value={description}
                onChange={handleAssignmentDescriptionChange}
              />
            </div>
          </Form.Item>
          <Form.Item>
            <FileUploader onFileListChange={handleFileListChange} />
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

export default Assignment;
