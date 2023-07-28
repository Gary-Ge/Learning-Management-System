import React, { useState } from 'react';
import { Layout, Typography, Button, Form, Input, DatePicker, TimePicker, message  } from 'antd';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploader from './FileUploader';
import { validNotNull, getToken, HOST_ASSIGNMENT } from '../src/utils/utils';
import { AssignmentLessonDTO } from '../src/utils/entities';

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
  const token = getToken();
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
    // Process commit logic
    if (!validNotNull(title)) {
      message.error('Please input a valid assignment title');
      return
    }
    if (!validNotNull(mark)) {
      message.error('Please input a valid assignment mark');
      return
    }
    if (!validNotNull(start)) {
      message.error('Please input a valid assignment start');
      return
    }
    if (!validNotNull(end)) {
      message.error('Please input a valid assignment end');
      return
    }
    if (!validNotNull(description)) {
      message.error('Please input a valid assignment description');
      return
    }
    const dto = new AssignmentLessonDTO(title, description, start, end, mark);
    const requestData = JSON.stringify(dto);
    // console.log('dto', dto); 
    fetch(`${HOST_ASSIGNMENT}/assignment/${courseId}`, {
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
      // Upload file, if any
      if (fileList.length > 0) {
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append("files", file);
        });
        fetch(`${HOST_ASSIGNMENT}/assignment/assFile/${res.data.assignmentId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        })
        .then(res => res.json())
        .then(res => {
          if (res.code !== 20000) {
            throw new Error(res.message);
          }
          message.success("Create assignment success")
          onSubmit();
        })
        .catch(error => {
          message.error(error.message);
        });
      } else {
        message.success("Create assignment success")
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
<<<<<<< HEAD
=======
            //name="description"
>>>>>>> 22d4a86250e9482901bd3db827c4ad3bd260249e
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
