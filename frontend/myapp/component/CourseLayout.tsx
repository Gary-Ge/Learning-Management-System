import React, { useState } from 'react';
import { Layout, Typography, Button, Form, Input, Radio, message  } from 'antd';
import {
  HeartFilled,
} from '@ant-design/icons';
import './CourseLayout.less';
import CourseUploadImageButton from './CourseUploadImageButton';
import { getToken, validNotNull, HOST_COURSE, COURSE_DETAIL_URL } from '../src/utils/utils'
import { CourseLayoutDTO } from '../src/utils/entities';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const CourseLayout: React.FC<{ onCancel: () => void; onSubmit: (courseId: string) => void }> = ({ onCancel, onSubmit }) => {
  const token = getToken();
  const [title, setTitle] = useState("");
  const handleCourseTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [category, setCategory] = useState("");
  const handleCourseCategoryChange = (e:any) => {
    setCategory(e.target.value);
  };
  const [description, setDescription] = useState("");
  const handleCourseDescriptionChange = (e:any) => {
    setDescription(e.target.value);
  };
  const [hasForum, setForum] = useState(null);

  const [cover, setImageUrl] = useState("");
  const handleImageUpload = (url: any) => {
    setImageUrl(url);
  };

  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };

  const handleSubmit = () => {
    // Process commit logic
    if (!validNotNull(title)) {
      message.error('Please input a valid course title')
      return
    }
    if (!validNotNull(category)) {
      message.error('Please input a valid course category')
      return
    }
    if (!validNotNull(description)) {
      message.error('Please input a valid course description')
      return
    }
    if (!validNotNull(hasForum)) {
      message.error('Please choose a valid course forum')
      return
    }
      
    const dto = new CourseLayoutDTO(title, category, description, cover, hasForum);
    const requestData = JSON.stringify(dto);
    fetch(`${HOST_COURSE}${COURSE_DETAIL_URL}`, {
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
      const courseId = res.data.courseId;
      message.success('Create Course Successfully!');
      onSubmit(courseId);
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
          height: 'auto'
        }}
      >
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold' }}>Create Courses</Title>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', marginBottom: '15px' }}>
          <CourseUploadImageButton onImageUpload={handleImageUpload} url="" />
        </div>
        <Form style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Course Name
              </Text>
            } 
            name="course name"  
            rules={[
              { required: true, message: 'Please input the course name!' },
              { max: 50, message: 'The course name must be less than 50 characters!' },
            ]}
          >
            <Input 
                placeholder="Input Course Name"
                value={title}
                onChange={handleCourseTitleChange}
                style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
            />
          </Form.Item>
          <Form.Item 
            label={
                <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                    Category
                </Text>
            } 
            name="category"
            rules={[
              { required: true, message: 'Please input the course category!' },
              { max: 50, message: 'The course category must be less than 50 characters!' },
            ]}
          >
            <Input 
              placeholder="Input Course Category" 
              value={category}
              onChange={handleCourseCategoryChange}
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
            />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                  Description
              </Text>
            }
            rules={[
              { required: true, message: 'Please input the course description!' },
              { max: 1000, message: 'The course description must be less than 200 characters!' },
            ]}
          >
          </Form.Item>
          <Form.Item
            name="description"
          >
            <Input.TextArea 
              placeholder="You can input many words here..."
              rows={4} 
              value={description}
              onChange={handleCourseDescriptionChange}
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
            />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS',color: 'black' }}>
                  Create Forums?
              </Text>
            }
            name="createForums"
            rules={[{ required: true, message: 'Please select an option!' }]}
          >
            <Radio.Group value={hasForum} onChange={(e) => setForum(e.target.value)}>
              <Radio value={true} style={{ fontSize: '15px', fontFamily: 'Comic Sans MS', color: 'black' }}>
                Yes
              </Radio>
              <Radio value={false} style={{ fontSize: '15px', fontFamily: 'Comic Sans MS', color: 'black' }}>
                No
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit} style={{ fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }}>
              Submit
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: '10px', fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }}>
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

export default CourseLayout;