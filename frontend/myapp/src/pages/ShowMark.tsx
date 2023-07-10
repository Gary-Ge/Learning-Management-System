import React, { useState, useEffect } from 'react';
import { Layout, theme, Typography, Button, Form, Input, Select, Table, InputNumber } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import { getToken } from '../utils/utils'
import {
  HeartFilled,
} from '@ant-design/icons';
import { validNotNull } from '../utils/utilsStaff';
import { TextLessonDTO } from '../utils/entities';
import {
  CheckCircleOutlined,
} from '@ant-design/icons';
const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const ShowMark: React.FC<{ allStudents: any; course: any; assInfor: any; onCancel: () => void; onSubmit: () => void }> = ({ allStudents, course, assInfor, onCancel, onSubmit }) => {
  const token = getToken();

  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  const handleSubmit = () => {
    // 处理提交逻辑

  };

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const [assignment, setAssignment] = useState("");
  const handleAssignmentChange = (value: string) => {
    const selectedAss = assInfor.find((assOption: any) => assOption.assignmentId === value);
    if (selectedAss) {
      setSelectedAssignmentId(selectedAss.assignmentId);
      setAssignment("assignment");
    }
  };

  const dataSource = (allStudents || []).map((student: any) => ({
    id: student.email,
    name: student.username,
  }));

  const handleDownload = () => {
    // 处理下载按钮的点击事件
    console.log('Download clicked');
  };
  const handleView = () => {
    // 处理查看按钮的点击事件
    console.log('View clicked');
  };
  const handleGradeChange = (value: Number) => {
    // 处理学生成绩输入框的数值变化事件
    console.log('Grade changed', value);
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'id', key: 'id' },
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Download',
      dataIndex: 'download',
      key: 'download',
      render: () => (
        <Button onClick={() => handleDownload()}>Download</Button>
      ),
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view',
      render: () => (
        <Button
          onClick={() => handleView()}
          style={{
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Comic Sans MS'
          }}
        >
          <CheckCircleOutlined style={{ color: 'red', margin: '0' }} />
        </Button>
      ),
    },
    {
      title: 'Students Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: () => (
        <InputNumber min={0} onChange={(value) => handleGradeChange(value)} />
      ),
    },
  ];

  return (
    <>
      {/* <input defaultValue={token}></input> */}
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
          <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>{course.title}: Students Grades</Title>
          <Form style={{ margin: '0 auto', maxWidth: '700px' }}>
            <Form.Item>
              <Text style={{ width: '100%', fontFamily: 'Comic Sans MS' }} >Choose Type:</Text>
              <Select
                placeholder="Select Option"
                style={{ width: '100%', fontFamily: 'Comic Sans MS' }}
                onChange={handleAssignmentChange}
                value={selectedAssignmentId}
              >
                {(assInfor || []).map((assOption: any) => (
                  <Select.Option
                    key={assOption.assignmentId}
                    style={{ fontFamily: 'Comic Sans MS', color: 'black' }}
                    value={assOption.assignmentId}
                  >
                    {assOption.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item style={{  }}>
              {assignment === "assignment" &&
                <>
                {/* {selectedAssignmentId} */}
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <Table style={{ border: '1px solid grey', width: '100%', fontFamily: 'Comic Sans MS' }} key={selectedAssignmentId} dataSource={dataSource} columns={columns} />
                </div>
                </>
              }
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
