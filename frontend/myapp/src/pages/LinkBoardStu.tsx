import React, { useState } from 'react';
import { Row, Col } from 'antd';
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

const LinkBoardStu: React.FC<{ courseId: string }> = ({ courseId }) => {
  const token = getToken();
  return (  
    <Row style= {{marginTop: '60px'}}>
      <Col span={18}>
        <Content style={{ background: '#fff', padding: '15px' }}>
          <Text style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold' }}>
            <UsergroupAddOutlined style={{ marginRight: '3px', fontSize: '20px' }} />
            Online People: 90
          </Text>
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: '0' }}>
            <div>
              <Avatar icon={<UserOutlined style={{ fontSize: '80px' }} />}  style={{cursor:'pointer',  width: '80px', height: '80px',marginTop: '10px'}} onClick={() => {}} />
            </div>
            <div>
            <Text>Name</Text>
            </div>
          </div>
        </Content>
        </Col>
      <Col span={4} style= {{marginLeft: '20px'}}>
      <Sider width={250} style={{ background: '#f0f2f5' }}>
        <Content style={{ margin: '24px 16px 0', background: '#fff', padding: '15px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
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
      </Col>
    </Row>
  );
};

export default LinkBoardStu;
