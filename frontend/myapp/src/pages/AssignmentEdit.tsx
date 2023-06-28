import React, { useEffect, useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, DatePicker, TimePicker  } from 'antd';
import './StaffDashboardContent.less';
import {getToken} from '../utils/utils'
import './TextLesson.css';
import {
  HeartFilled,
  DeleteOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploader from './FileUploader';
import { validNotNull} from '../utils/utilsStaff';
import { AssignmentLessonDTO } from '../utils/entities';
import moment, { Moment } from 'moment';

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
const AssignmentEdit: React.FC<{ onCancel: () => void; onSubmit: () => void; assignment: any }> = ({ onCancel, onSubmit, assignment }) => {
  const token = getToken();

  const [assignmentInfor, setAssignmentInfor] = useState(assignment);
  const [title, setTitle] = useState("");
  const handleAssignmentTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [mark, setMark] = useState(0);
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
  // upload resource
  const [fileList, setFileList] = useState<any[]>([]);

  const handleFileListChange = (newFileList: any[]) => {
    setFileList(newFileList);
  };
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };

  const [form] = Form.useForm();

  useEffect(() => {
    console.log('assignment', assignment);
    setTitle(assignment.title);
    setMark(assignment.mark);
    setStart(assignment.start);
    setEnd(assignment.end);
    setDescription(assignment.description);

    setAssignmentInfor(assignment);

    form.setFieldsValue({
      "assignment title": assignment.title,
      "assignment mark": assignment.mark
    })
  }, [assignment])

  const openFile = (assFileId: string) => {
    fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/assFile/${assFileId}`, {
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
      window.open(res.data.fileUrl);
    })
  }

  const handleSubmit = () => {
    console.log(start);
    console.log(end);
    // 处理提交逻辑
    const dto = new AssignmentLessonDTO(title, description, start, end, mark);
    const requestData = JSON.stringify(dto);
    // console.log('dto', dto); 
    // const token = getToken(); // 获取令牌(token)
    // const token = localStorage.getItem('token');
    // console.log(token);
    // console.log(courseId);
    fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${assignment.assignmentId}`, {
      method: 'PUT',
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

      // Upload file, if any
      if (fileList.length > 0) {
        const formData = new FormData();

        fileList.forEach((file) => {
          formData.append("files", file);
        });
  
        fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/assFile/${assignment.assignmentId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        })
        .then(res => res.json())
        .then(res => {
          console.log('res', res);
          if (res.code !== 20000) {
            throw new Error(res.message);
          }
          onSubmit();
        })
        .catch(error => {
          alert(error.message);
        });
      } else {
        onSubmit();
      }
    })
    .catch(error => {
      alert(error.message);
    });
  };
  const handleDeleteClick = (assFileId: string) => {
    // 处理删除图标点击事件
    // console.log('click delete:', sectionId);
    fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/assFile/${assFileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res)
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${assignment.assignmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(res => {
        // console.log('res', res)
        if (res.code !== 20000) {
          throw new Error(res.message)
        }
        const assignmentData = res.data.assignment;
        setAssignmentInfor(assignmentData);
      })
      .catch(error => {
        alert(error.message);
      });
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Edit Assignment</Title>
        <Form form={form} style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Assignment Title
              </Text>
            } 
            name="assignment title" 
            rules={[
              { max: 100, message: 'The assignment title must be less than 100 characters!' },
            ]}
          >
            <Input
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
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
          >
            <Input 
              type="number"
              placeholder={assignment.mark} 
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
          >
            <DatePicker placeholder={assignment.start} showTime onOk={handleAssignmentStartChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                End Date and Time
              </Text>
            }
            name="endDateTime"
          >
            <DatePicker placeholder={assignment.end} showTime onOk={handleAssignmentEndChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Description
              </Text>
            }
            name="description"
          >
          </Form.Item>
          <Form.Item>
            <div className="quill-container">
              <ReactQuill
                modules={quillModules}
                formats={quillFormats}
                value={description}
                onChange={handleAssignmentDescriptionChange}
              />
            </div>
          </Form.Item>
          <Form.Item>
          {assignmentInfor.assFiles.map((assFile: any) => (
              <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Button
                  // key={section.sectionId}
                  // onClick={() => handleButtonClick(section.sectionId)}
                  // onMouseEnter={() => handleButtonMouseEnter(section.sectionId)}
                  // onMouseLeave={handleButtonMouseLeave}
                  style={{ 
                    border: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '300px',
                    // backgroundColor: activeButton === section.sectionId ? '#DAE8FC' : 'transparent',
                    // color: activeButton === section.sectionId ? 'red' : 'black',
                    fontFamily: 'Comic Sans MS'
                  }}
                  onClick={() => {
                    openFile(assFile.assFileId);
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {assFile.title}
                  </span>
                </Button>
                <DeleteOutlined 
                  style={{ color: 'red', cursor: 'pointer', width: '30px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(assFile.assFileId);
                  }} 
                />
              </div>
              </>
            ))}
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

export default AssignmentEdit;
