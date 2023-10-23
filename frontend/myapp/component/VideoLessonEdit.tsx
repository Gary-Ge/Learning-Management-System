import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Form, Input, message  } from 'antd';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploader from './FileUploader';
import VideoUploadImageButton from './VideoUploadImageButton';
import { VideoLessonDTO } from '../src/utils/entities';
import { getToken, HOST_SECTION, HOST_RESOURCE } from '../src/utils/utils'

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
const VideoLessonEdit: React.FC<{ onCancel: () => void; onSubmit: () => void; video: any; }> = ({ onCancel, onSubmit, video }) => {

  const [form] = Form.useForm();

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description);
      setImageUrl(video.cover);
      setVideoResourse(video.resources);

      form.setFieldsValue({
        "video title": video.title
      })
    }
  }, [video]);

  const token = getToken();
  const [videoResourse, setVideoResourse] = useState<any[]>([]);

  const [fileList, setFileList] = useState<any[]>([]);
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
  const handleFileListChange = (newFileList: any[]) => {
    setFileList(newFileList);
  }; 
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  const handleSubmit = () => {
    // Process commit logic
    const dto = new VideoLessonDTO(title, description, cover, youtubeLink, 2);
    const requestData = JSON.stringify(dto);
    fetch(`${HOST_SECTION}/videoSection/${video.sectionId}`, {
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

      if (fileList.length !== 0) {
        if (fileList.length > 1) {
          message.error('Please upload only one video file!');
        }
        const formData = new FormData();
        formData.append('file', fileList[0]);
        message.info('The video is uploading,please wait for a second')
        fetch(`${HOST_RESOURCE}/video/${video.sectionId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        })
        .then(res => res.json())
        .then(res => {
          if (res.code !== 20000) {
            throw new Error(res.message)
          }
          message.success('Video lesson updated successfully!')
          onSubmit();
        })
        .catch(error => {
          message.error(error.message);
        });
      } else {
        message.success('Video lesson updated successfully!')
        onSubmit();
      }
    })
    .catch(error => {
      message.error(error.message);
    });        
  };

  const openFile = (resourceId: string) => {
    fetch(`${HOST_RESOURCE}/video/${resourceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      window.open(res.data.auth.playURL);
    })
    .catch(error => {
      message.error(error.message);
    });
  }
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Edit Video Lesson</Title>
        <Form form={form} style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Video Title
              </Text>
            } 
            name="video title" 
            rules={[
              { max: 100, message: 'The video title must be less than 100 characters!' },
            ]}
          >
            <Input 
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
              onChange={handleVideoTitleChange}
            />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', marginBottom: '15px' }}>
              <VideoUploadImageButton onImageUpload={handleImageUpload} url={cover} />
            </div>
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Materials
              </Text>
            }
          >
          </Form.Item>
          <Form.Item>
            {videoResourse.map((resources: any) => (
              <div key={resources.resourceId}>
              <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Button
                  style={{ 
                    border: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '300px',
                    fontFamily: 'Comic Sans MS'
                  }}
                  onClick={() => {
                    openFile(resources.resourceId);
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {resources.title}
                  </span>
                </Button>
              </div>
              </>
              </div>
            ))}
            <FileUploader onFileListChange={handleFileListChange} />
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

export default VideoLessonEdit;
