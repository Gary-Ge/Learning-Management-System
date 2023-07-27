import React, { useState } from 'react';
import { Layout, Typography, Button, Form, Input, message  } from 'antd';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextLesson.less';
import FileUploader from './FileUploader';
import { getToken, validNotNull, HOST_SECTION, HOST_RESOURCE } from '../src/utils/utils'
import { TextLessonDTO } from '../src/utils/entities';

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
const TextLesson: React.FC<{ onCancel: () => void; onSubmit: (sectionId: string) => void; courseId: string }> = ({ onCancel, onSubmit, courseId }) => {
  const token = getToken();
  const [title, setTitle] = useState("");
  const handleTextTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [description, setDescription] = useState("");
  const handleTextDescriptionChange = (value: string) => {
    setDescription(value);
  };
  // upload resource
  const [fileList, setFileList] = useState<any[]>([]);

  const handleFileListChange = (newFileList: any[]) => {
    setFileList(newFileList);
  };
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  const handleSubmit = () => {
    // Process commit logic
    if (!validNotNull(title)) {
      message.error('Please input a valid text title')
      return
    }
    if (!validNotNull(description)) {
      message.error('Please input a valid text description')
      return
    }
    const dto = new TextLessonDTO(title, description);
    const requestData = JSON.stringify(dto);
    fetch(`${HOST_SECTION}/textSection/${courseId}`, {
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
      const sectionID = res.data.sectionId;      
      // Upload File, if any
      if (fileList.length > 0) {
        const formData = new FormData();

        fileList.forEach((file) => {
          formData.append("files", file);
        });
        
        fetch(`${HOST_RESOURCE}/resources/${sectionID}`, {
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
          message.success('Create text lesson successfully');
          onSubmit(sectionID);
        })
        .catch(error => {
          message.error(error.message);
        });
      } else {
        message.success('Create text lesson successfully');
        onSubmit(sectionID);
      }
    })
    .catch(error => {
      message.error(error.message);
    });
    
  };
  return (
    <>
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Create Text Lesson</Title>
        <Form style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                  Text Title
              </Text>
            } 
            name="text title"
            rules={[
              { required: true, message: 'Please input the text title!' },
              { max: 50, message: 'The text title must be less than 50 characters!' },
            ]}
          >
            <Input 
              placeholder="Input Title" 
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
              value={title}
              onChange={handleTextTitleChange}
            />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Description
              </Text>
            }
            // name="description"
            rules={[
              { required: true, message: 'Please input the text description!' },
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
                onChange={handleTextDescriptionChange}
              />
            </div>
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Materials
              </Text>
            }
            // name="materials"
          >
          </Form.Item>
          <Form.Item>
            <FileUploader onFileListChange={handleFileListChange}/>
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
    </>
  );
};

export default TextLesson;
