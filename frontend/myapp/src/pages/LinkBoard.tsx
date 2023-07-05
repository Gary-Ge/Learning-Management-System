import React, { useState } from 'react';
import { Layout, Typography, Button, Form, Input, Avatar  } from 'antd';
import {
  CameraOutlined,
  AudioOutlined,
  PhoneOutlined,
  UsergroupAddOutlined,
  PlusCircleOutlined,
  UserOutlined,
  SendOutlined,
  HeartFilled,
} from '@ant-design/icons';
import {getToken} from '../utils/utils'

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const LinkBoard: React.FC<{ courseId: string }> = ({ courseId }) => {
  const token = getToken();
  return (
    <>
    <Layout style={{ minHeight: '100vh' }}>
      <Layout style={{  }}>        
        <Content style={{ margin: '24px 16px 0', background: '#fff', padding: '15px' }}>
          <Text style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold' }}>
            <UsergroupAddOutlined style={{ marginRight: '3px', fontSize: '20px' }} />
            Online People: 90
          </Text>
          <Button 
            onClick={() => {}} 
            icon={<PlusCircleOutlined />} 
            type="primary" 
            ghost
            style={{ fontFamily: 'Comic Sans MS', marginLeft: '10px', borderRadius: '5px' }} 
          >
            Students
          </Button>
          <Button 
            onClick={() => {}} 
            icon={<PlusCircleOutlined />} 
            type="primary" 
            ghost
            style={{ fontFamily: 'Comic Sans MS', marginLeft: '10px', borderRadius: '5px', color: 'black', borderColor: 'black' }} 
          >
            Questions
          </Button>
          <Text style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold', float: 'right' }}>
            Course Name: COMP9900
          </Text>
          <div style={{ marginTop: '15px', marginBottom: '15px', border: '1px solid red', borderRadius: '10px', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              Content
            </div>
            <div style={{ flex: 'none', marginBottom: '15px' }}>
              <AudioOutlined style={{ fontSize: '25px' }} />
              <PhoneOutlined style={{ fontSize: '25px', marginLeft: '20px' }} />
              <CameraOutlined style={{ fontSize: '25px', marginLeft: '20px' }} />
            </div>
          </div>
          <div>
            <div>
              <Avatar icon={<UserOutlined style={{ fontSize: '80px' }} />}  style={{cursor:'pointer',  width: '80px', height: '80px'}} onClick={() => {}} />
            </div>
            <Text>Name</Text>
          </div>
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
      <Sider width={250} style={{ background: '#f0f2f5' }}>
        <Content style={{ margin: '24px 16px 0', background: '#fff', padding: '15px', minHeight: '87vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', paddingBottom: 10, fontWeight: 'bold' }}>Chatting</Title>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
            <Input 
              placeholder="Input your words"
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS', marginRight: 10 }}
            />
            <Button type="primary" onClick={() => {}} icon={<SendOutlined />} />
          </div>
        </Content>
      </Sider>
    </Layout>
    </>
  );
};

export default LinkBoard;
