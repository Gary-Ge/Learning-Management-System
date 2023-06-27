<<<<<<< HEAD
import React, { useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, Collapse  } from 'antd';
=======
import React, { useState, useEffect } from 'react';
import { Layout, theme, Typography, Button, Form, Input  } from 'antd';
>>>>>>> 2d8c2067fae716aa02214439633ccd41534bb3bb
import './StaffDashboardContent.less';
import './TextLesson.css';
import {getToken} from '../utils/utils'
import {
  DeleteOutlined,
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploader from './FileUploader';
import { validNotNull} from '../utils/utilsStaff';
import { TextLessonDTO } from '../utils/entities';
const { Panel } = Collapse;

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
const TextLessonEdit: React.FC<{ onCancel: () => void; onSubmit: (sectionId: string) => void; section: any }> = ({ onCancel, onSubmit, section }) => { 

  const [form] = Form.useForm();

  useEffect(() => {
    setTitle(section.title);
    setDescription(section.description);

    form.setFieldsValue({
      "text title": section.title
    })
  }, [section])

  const token = getToken();
  const [title, setTitle] = useState("");
  const [sectionInfor, setSectionInfor] = useState(section);
  const handleTextTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [description, setDescription] = useState("");
  const handleTextDescriptionChange = (value: string) => {
    setDescription(value);
  };
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  // upload resource
  const [fileList, setFileList] = useState<any[]>([]);

  const handleFileListChange = (newFileList: any[]) => {
    setFileList(newFileList);
  };
  const handleSubmit = () => {
    // 处理提交逻辑    
    const dto = new TextLessonDTO(title, description);
    const requestData = JSON.stringify(dto);
    // console.log('dto', dto); 
    // const token = getToken(); // 获取令牌(token)
    // const token = localStorage.getItem('token');
    // console.log(token);
    fetch(`http://175.45.180.201:10900/service-edu/edu-section/textSection/${section.sectionId}`, {
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
      onSubmit(section.sectionId);
      const formData = new FormData();

      fileList.forEach((file) => {
        formData.append("files", file);
      });

      fetch(`http://175.45.180.201:10900/service-edu/edu-resource/resources/${section.sectionId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc1MTg2MDksImV4cCI6MTY5MDExMDYwOSwiaWQiOiIwZTVjM2UwMTRjNDA1NDhkMzNjY2E0ZWQ3YjlhOWUwNCJ9.ngA7l15oOI-LyXB_Ps5kMzW_nzJDFYDOI4FmKcYIxO4`,
        },
        body: formData
      })
      .then(res => res.json())
      .then(res => {
        console.log('res', res);
        if (res.code !== 200) {
          throw new Error(res.message);
        }
      })
      .catch(error => {
        alert(error.message);
      });
      // history.push('/'); // redirect to login page, adjust as needed
    })
    .catch(error => {
      alert(error.message);
    });
  };
  const handleDeleteClick = (resourceId: string) => {
    // 处理删除图标点击事件
    // console.log('click delete:', sectionId);
    fetch(`http://175.45.180.201:10900/service-edu/edu-resource/resource/${resourceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc1MTg2MDksImV4cCI6MTY5MDExMDYwOSwiaWQiOiIwZTVjM2UwMTRjNDA1NDhkMzNjY2E0ZWQ3YjlhOWUwNCJ9.ngA7l15oOI-LyXB_Ps5kMzW_nzJDFYDOI4FmKcYIxO4`,
      },
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res)
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      fetch(`http://175.45.180.201:10900/service-edu/edu-section/section/${section.sectionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc1MTg2MDksImV4cCI6MTY5MDExMDYwOSwiaWQiOiIwZTVjM2UwMTRjNDA1NDhkMzNjY2E0ZWQ3YjlhOWUwNCJ9.ngA7l15oOI-LyXB_Ps5kMzW_nzJDFYDOI4FmKcYIxO4`,
        },
      })
      .then(res => res.json())
      .then(res => {
        // console.log('res', res)
        if (res.code !== 20000) {
          throw new Error(res.message)
        }
        const sectionData = res.data.section;
        setSectionInfor(sectionData);
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Edit Text Lesson</Title>
        <Form form={form} style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                  Text Title
              </Text>
            } 
            name="text title"
            rules={[
              { max: 50, message: 'The text title must be less than 50 characters!' },
            ]}
          >
            <Input 
              placeholder={section.title} 
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
          >
          </Form.Item>
          <Form.Item>
            <div className="quill-container">
              <ReactQuill
                modules={quillModules}
                formats={quillFormats}
                onChange={handleTextDescriptionChange}
                value={description}
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
          </Form.Item>
          <Form.Item>
            {sectionInfor.resources.map((resources: any) => (
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
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                    {resources.title.length > 12 ? resources.title.substring(0, 7) + '...' : resources.title}
                  </span>
                </Button>
                <DeleteOutlined 
                  style={{ color: 'red', cursor: 'pointer', width: '30px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(resources.resourceId);
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
    </>
  );
};

export default TextLessonEdit;
