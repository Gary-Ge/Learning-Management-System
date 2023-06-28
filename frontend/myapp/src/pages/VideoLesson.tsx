import React, { useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, Select  } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import VideoUploadButton from '../pages/videoUploadButton';
import FileUploader from './FileUploader';
import VideoUploadImageButton from './VideoUploadImageButton';
import { validNotNull} from '../utils/utilsStaff';
import { VideoLessonDTO } from '../utils/entities';
import {getToken} from '../utils/utils'

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
const VideoLesson: React.FC<{ onCancel: () => void; onSubmit: () => void; courseId: string }> = ({ onCancel, onSubmit, courseId }) => {
  const token = getToken();
  const [title, setTitle] = useState("");
  const handleVideoTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [description, setDescription] = useState("");
  const handleVideoDescriptionChange = (value: string) => {
    setDescription(value);
  };
  const [cover, setImageUrl] = useState("");
  const handleImageUpload = (url: any) => {
    setImageUrl(url);
  };
  const [youtubeLink, setUrl] = useState("");
  const handleUrlChange = (youtubeLink: any) => {
    setUrl(youtubeLink);
  };
  const [type, setType] = useState(0);
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  const handleSubmit = () => {
    // 处理提交逻辑
    if (!validNotNull(title)) {
      alert('Please input a valid video title')
      return
    }
    if (!validNotNull(description)) {
      alert('Please input a valid video description')
      return
    }
    const dto = new VideoLessonDTO(title, description, cover, youtubeLink, type);
    const requestData = JSON.stringify(dto);
    fetch(`http://175.45.180.201:10900/service-edu/edu-section/videoSection/${courseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: requestData
    })
    .then(res => res.json())
    .then(res => {
      console.log('video_res', res);
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      onSubmit();
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Create Video Lesson</Title>
        <Form style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                  Video Title
              </Text>
            } 
            name="video title" 
            rules={[
              { required: true, message: 'Please input the video title!' },
              { max: 100, message: 'The video title must be less than 100 characters!' },
            ]}
          >
            <Input 
              placeholder="Input Title" 
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
              value={title}
              onChange={handleVideoTitleChange}
            />
          </Form.Item>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Video Type
              </Text>
            } 
            name="video type" 
          >
            <Select
              placeholder="Select Video Section Type"
              style={{ fontFamily: 'Comic Sans MS', width: '100%' }}
              onChange={(value: number) => {
                setType(value);
              }}
            >
              <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value={1}>YouTube Video Section</Select.Option>
              <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value={2}>Custom Video Section</Select.Option>
            </Select>
          </Form.Item>
          {type === 1 && (
            <Form.Item 
              label={
                <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                  Video URL
                </Text>
              } 
              name="video url" 
            >
              <Input 
                placeholder="URL" 
                style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
                value={youtubeLink}
                onChange={handleUrlChange}
              />
            </Form.Item>
          )}
          {type === 2 && (
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', marginBottom: '15px' }}>
                <VideoUploadImageButton onImageUpload={handleImageUpload} url="" courseId={courseId} />
              </div>
            </Form.Item>
          )}
          {/* <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Video Source
              </Text>
            }
            name="video source"
          >
          </Form.Item>
          <Form.Item>
            <FileUploader onFileListChange={handleFileListChange}/>
          </Form.Item> */}
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Description
              </Text>
            }
            name="description"
            rules={[
              { required: true, message: 'Please input the video description!' },
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
                onChange={handleVideoDescriptionChange}
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

export default VideoLesson;
