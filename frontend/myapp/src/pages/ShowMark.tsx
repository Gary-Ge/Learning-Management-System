import React, { useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, Select  } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import {getToken} from '../utils/utils'
import {
  HeartFilled,
} from '@ant-design/icons';
import { validNotNull } from '../utils/utilsStaff';
import { TextLessonDTO } from '../utils/entities';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const ShowMark: React.FC<{ onCancel: () => void; onSubmit: () => void }> = ({ onCancel, onSubmit }) => {
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
    // 处理提交逻辑
    if (!validNotNull(title)) {
      alert('Please input a valid text title')
      return
    }
    if (!validNotNull(description)) {
      alert('Please input a valid text description')
      return
    }
    const dto = new TextLessonDTO(title, description);
    const requestData = JSON.stringify(dto);
    // console.log('dto', dto); 
    // const token = getToken(); // 获取令牌(token)
    // const token = localStorage.getItem('token');
    // console.log(token);
    // console.log(courseId);
    fetch(`http://175.45.180.201:10900/service-edu/edu-section/textSection/${courseId}`, {
      method: 'POST',
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
      console.log('sectionId', res.data.sectionId);
      const sectionID = res.data.sectionId;
      
      // Upload File, if any
      if (fileList.length > 0) {
        const formData = new FormData();

        fileList.forEach((file) => {
          formData.append("files", file);
        });
        
        fetch(`http://175.45.180.201:10900/service-edu/edu-resource/resources/${sectionID}`, {
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
          onSubmit(sectionID);
        })
        .catch(error => {
          alert(error.message);
        });
      } else {
        onSubmit(sectionID);
      }
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Students Grades</Title>
        <Form style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item>
            <Select
              placeholder="Select Option"
              style={{ width: '100%', fontFamily: 'Comic Sans MS' }}
              // onChange={(value) => {
              //   const updatedForms = forms.map((f) => {
              //     if (f.id === form.id) {
              //       return { ...f, selectedOption: value };
              //     }
              //     return f;
              //   });
              //   setForms(updatedForms);
              // }}
            >
              <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="sc">Assignment</Select.Option>
              <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="mc">Quiz</Select.Option>
              <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="st">Total grade</Select.Option>
            </Select>
            
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

export default ShowMark;
