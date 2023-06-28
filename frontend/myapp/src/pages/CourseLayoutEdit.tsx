import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Form, Input, Radio, message  } from 'antd';
import './StaffDashboardContent.less';
import './CourseLayout.css';
import {getToken} from '../utils/utils'
const { Content, Footer } = Layout;
const { Title, Text } = Typography;
import {
  HeartFilled,
} from '@ant-design/icons';
import CourseUploadImageButton from './CourseUploadImageButton';
import { CourseLayoutDTO } from '../utils/entities';
import { useHistory } from 'umi';

const CourseLayoutEdit: React.FC<{ onCancel: () => void; onSubmit: (courseId: string) => void; course: any }> = ({ onCancel, onSubmit, course }) => {

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      "course name": course.title,
      "category": course.category,
      "description content": course.description
    });
  }, [course])

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
    console.log(cover)
  };
  console.log(course.url)
  const history = useHistory();
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  // const [courseId, setCourseId] = useState(null);
  const handleSubmit = () => {
    // 处理提交逻辑
    // setImageUrl(course.cover);
    // console.log(course.cover)
    const dto = new CourseLayoutDTO(title, category, description, cover, hasForum);
    const requestData = JSON.stringify(dto);
    // console.log('dto', dto); 
    // console.log(dto.hasForum); 
    // console.log(typeof dto.hasForum); 
    // const token = getToken(); // 获取令牌(token)
    // const token = localStorage.getItem('token');
    // console.log(token);
    fetch(`http://175.45.180.201:10900/service-edu/edu-course/course/${course.courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: requestData
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res)
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      message.success('Update Course Successfully!');
      onSubmit(course.courseId);
      // history.push('/'); // redirect to login page, adjust as needed
    })
    .catch(error => {
      console.log(error.message);
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold' }}>Edit Courses</Title>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', marginBottom: '15px' }}>
          <CourseUploadImageButton onImageUpload={handleImageUpload} url={course.cover}  />
        </div>
        <Form form={form} style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Course Name
              </Text>
            } 
            name="course name"  
            rules={[
              { max: 50, message: 'The course name must be less than 50 characters!' },
            ]}
          >
            <Input 
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
              { max: 50, message: 'The course category must be less than 50 characters!' },
            ]}
          >
            <Input 
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
            name="description"
            rules={[
              { max: 1000, message: 'The course description must be less than 200 characters!' },
            ]}
          >
          </Form.Item>
          <Form.Item
            name="description content"
          >
            <Input.TextArea 
              rows={4} 
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
          >
            <Radio.Group value={course.hasForum} defaultValue={course.hasForum} onChange={(e) => setForum(e.target.value)}>
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

export default CourseLayoutEdit;