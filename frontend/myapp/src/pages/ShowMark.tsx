import React, { useState, useEffect } from 'react';
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

const ShowMark: React.FC<{ onCancel: () => void; onSubmit: () => void; courseId: string }> = ({ onCancel, onSubmit, courseId }) => {
  const token = getToken();
  const [curCourseId, setCourseId] = useState(courseId);

  const [assOptions, setAssOptions] = useState<any[]>([]);
  const fetchAssOptions = () => {
    // 发起 fetch 请求获取选项数据
    fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignments/${curCourseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      // Assuming the course title is returned in the 'title' field of the response
      const fetchedAssignments = data.data.assignments;
      setAssOptions(fetchedAssignments);
      // console.log('data', fetchedAssignments);
    })
    .catch((error) => {
      console.log(error.message);
    });
  };
  useEffect(() => {
    fetchAssOptions();
  }, []);

  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  const handleSubmit = () => {
    // 处理提交逻辑
    
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
              {(assOptions || []).map((assOption) => (
                <Select.Option
                  key={assOption.assignmentId}
                  style={{ fontFamily: 'Comic Sans MS', color: 'black' }}
                  value={assOption.title}
                >
                  {assOption.title}
                </Select.Option>
              ))}
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
