import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Form, Input, DatePicker, TimePicker, message  } from 'antd';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getToken, HOST_STREAM } from '../src/utils/utils'
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
const StreamLessonEdit: React.FC<{ onCancel: () => void; onSubmit: () => void; stream: any }> = ({ onCancel, onSubmit, stream }) => {
  const token = getToken();

  const [streamInfor, setStreamInfor] = useState(stream);

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
  
  const [form] = Form.useForm();

  useEffect(() => {
    setTitle(stream.title);
    setStart(stream.start);
    setEnd(stream.end);
    setDescription(stream.description);

    setStreamInfor(stream);

    form.setFieldsValue({
      "stream title": stream.title,
      "description content": stream.description,
      "start": stream.start,
      "end": stream.end,
    })
  }, [stream])

  const handleSubmit = () => {
    // Process commit logic
    const dto = new StreamLessonDTO(title, description, start, end);
    const requestData = JSON.stringify(dto);
    fetch(`${HOST_STREAM}/stream/${stream.streamId}`, {
      method: 'PUT',
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
        }}
      >
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Edit Stream Lesson</Title>
        <Form form={form} style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Stream Title
              </Text>
            } 
            name="stream title" 
            rules={[
              { max: 100, message: 'The stream title must be less than 100 characters!' },
            ]}
          >
            <Input 
              placeholder={stream.title}
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
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
          >
            <DatePicker placeholder={stream.start} showTime onOk={handleStreamStartChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                End Date and Time
              </Text>
            }
            name="endDateTime"
          >
            <DatePicker placeholder={stream.end} showTime onOk={handleStreamEndChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Description
              </Text>
            }
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

export default StreamLessonEdit;
