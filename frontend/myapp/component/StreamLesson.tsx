import React, { useState } from 'react';
import { Layout, Typography, Button, Form, Input, DatePicker, TimePicker, message } from 'antd';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getToken, validNotNull, HOST_STREAM } from '../src/utils/utils'
import { StreamLessonDTO } from '../src/utils/entities';

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
const StreamLesson: React.FC<{ onCancel: () => void; onSubmit: () => void; courseId: string }> = ({ onCancel, onSubmit, courseId }) => {
  const token = getToken();
  const [title, setTitle] = useState("");
  const handleStreamTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [description, setDescription] = useState("");
  const handleStreamDescriptionChange = (value: string) => {
    setDescription(value);
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
  const handleSubmit = () => {
    // Process commit logic
    if (!validNotNull(title)) {
      message.error('Please input a valid stream title')
      return
    }
    if (!validNotNull(start)) {
      message.error('Please input a valid stream start time')
      return
    }
    if (!validNotNull(end)) {
      message.error('Please input a valid stream end time')
      return
    }
    if (!validNotNull(description)) {
      message.error('Please input a valid stream description')
      return
    }
    const dto = new StreamLessonDTO(title, description, start, end);
    const requestData = JSON.stringify(dto);
    fetch(`${HOST_STREAM}/stream/${courseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: requestData
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      else {
        message.success("Create stream success")
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Create Stream Lesson</Title>
        <Form style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Stream Title
              </Text>
            } 
            name="stream title" 
            rules={[
              { required: true, message: 'Please input the stream title!' },
              { max: 100, message: 'The stream title must be less than 100 characters!' },
            ]}
          >
            <Input 
              placeholder="Input Title" 
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
              value={title}
              onChange={handleStreamTitleChange}
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
              { required: true, message: 'Please input the stream start time!' },
            ]}
          >
            <DatePicker placeholder="Select Start Date and Time" showTime onOk={handleStreamStartChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                End Date and Time
              </Text>
            }
            name="endDateTime"
            rules={[
              { required: true, message: 'Please input the stream end time!' },
            ]}
          >
            <DatePicker placeholder="Select Start Date and Time" showTime onOk={handleStreamEndChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Description
              </Text>
            }
<<<<<<< HEAD
=======
            //name="description"
>>>>>>> 22d4a86250e9482901bd3db827c4ad3bd260249e
            rules={[
              { required: true, message: 'Please input the stream description!' },
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
                onChange={handleStreamDescriptionChange}
              />
            </div>
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

export default StreamLesson;
