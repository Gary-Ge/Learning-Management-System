import React, { useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input  } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploader from './FileUploader';
import { validNotNull, validNotFile } from '../utils/utilsStaff';
import { TextLessonDTO, FileUploadDTO } from '../utils/entities';

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
  // const [title, setTitle] = useState("");
  // const handleTextTitleChange = (e:any) => {
  //   setTitle(e.target.value);
  // };
  // const [description, setDescription] = useState("");
  // const handleTextDescriptionChange = (value: string) => {
  //   setDescription(value);
  // };
  // upload resource
  const [files, setFileList] = useState<any[]>([]);
  // 处理 file list 变化的回调函数
  const handleFileListChange = (newfileList: any[]) => {
    // 在这里处理文件列表的变化
    console.log(newfileList);
    setFileList(newfileList);
  };
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  // const [sectionId, setSectionId] = useState("");
  const handleSubmit = () => {
    // 处理提交逻辑
    // if (!validNotNull(title)) {
    //   alert('Please input a valid text title')
    //   return
    // }
    // if (!validNotNull(description)) {
    //   alert('Please input a valid text description')
    //   return
    // }
    // if (!validNotFile(files)) {
    //   alert('Please choose a valid text file')
    //   return
    // }
    // const dto = new TextLessonDTO(title, description);
    // const requestData = JSON.stringify(dto);
    // // console.log('dto', dto); 
    // // const token = getToken(); // 获取令牌(token)
    // // const token = localStorage.getItem('token');
    // // console.log(token);
    // // console.log(courseId);
    // fetch(`http://175.45.180.201:10900/service-edu/edu-section/textSection/${courseId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc1MTg2MDksImV4cCI6MTY5MDExMDYwOSwiaWQiOiIwZTVjM2UwMTRjNDA1NDhkMzNjY2E0ZWQ3YjlhOWUwNCJ9.ngA7l15oOI-LyXB_Ps5kMzW_nzJDFYDOI4FmKcYIxO4`,
    //   },
    //   body: requestData
    // })
    // .then(res => res.json())
    // .then(res => {
    //   // console.log('res', res);
    //   if (res.code !== 20000) {
    //     throw new Error(res.message)
    //   }
    //   console.log('sectionId', res.data.sectionId);
    //   const sectionID = res.data.sectionId;
    //   setSectionId(sectionID)
    //   onSubmit(sectionID);
    //   // history.push('/'); // redirect to login page, adjust as needed
    // })
    // .catch(error => {
    //   alert(error.message);
    // });

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });
    console.log("formData",formData);
    const filedto = new FileUploadDTO(files);
    const requestFileData = JSON.stringify(filedto);
    fetch(`http://175.45.180.201:10900/service-edu/edu-resource/resources/${sectionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: formData
    })
    .then(res => res.json())
    .then(res => {
      console.log('res', res);
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      // console.log('courseId', res.data.sectionId);
      // const sectionId = res.data.sectionId;
      // onSubmit(sectionId);
      // history.push('/'); // redirect to login page, adjust as needed
    })
    .catch(error => {
      alert(error.message);
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
          // border: '1px solid red'
        }}
      >
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Create Text Lesson</Title>
        <Form style={{ margin: '0 auto', maxWidth: '400px' }}>
          {/* <Form.Item 
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
            name="description"
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
            name="materials"
          >
          </Form.Item> */}
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
    </>
  );
};

export default TextLesson;
