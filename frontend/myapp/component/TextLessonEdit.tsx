import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Form, Input, Collapse, message } from 'antd';
import {
  DeleteOutlined,
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextLesson.less';
import FileUploader from './FileUploader';
import { getToken, HOST_RESOURCE, HOST_SECTION } from '../src/utils/utils'
import { TextLessonDTO } from '../src/utils/entities';

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

    setSectionInfor(section);

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

  const openFile = (resourceId: string) => {
    fetch(`${HOST_RESOURCE}/resource/${resourceId}`, {
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
    .catch(error => {
      message.error(error.message);
    });
  }

  const handleSubmit = () => {
    // Process commit logic
    const dto = new TextLessonDTO(title, description);
    const requestData = JSON.stringify(dto);
    fetch(`${HOST_SECTION}/textSection/${section.sectionId}`, {
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
      // Upload file, if any
      if (fileList.length > 0) {
        const formData = new FormData();

        fileList.forEach((file) => {
          formData.append("files", file);
        });
  
        fetch(`${HOST_RESOURCE}/resources/${section.sectionId}`, {
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
          message.success('Successfully updated text lesson!');
          onSubmit(section.sectionId);
        })
        .catch(error => {
          message.error(error.message);
        });
      } else {
        message.success('Successfully updated text lesson!');
        onSubmit(section.sectionId);
      }
    })
    .catch(error => {
      message.error(error.message);
    });
  };
  const handleDeleteClick = (resourceId: string) => {
    // Handle delete icon click event
    fetch(`${HOST_RESOURCE}/resource/${resourceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      fetch(`${HOST_SECTION}/section/${section.sectionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(res => {
        if (res.code !== 20000) {
          throw new Error(res.message)
        }
        const sectionData = res.data.section;
        setSectionInfor(sectionData);
      })
      .catch(error => {
        message.error(error.message);
      });
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
          height: 'auto',
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
          >
          </Form.Item>
          <Form.Item>
            {sectionInfor.resources.map((resources: any) => (
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
                <DeleteOutlined 
                  style={{ color: 'red', cursor: 'pointer', width: '30px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(resources.resourceId);
                  }} 
                />
              </div>
              </>
              </div>
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
