import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Typography, Avatar, Modal, Button } from 'antd';
import type { TabsProps } from 'antd';
import './Dashboard.css'; // 引入自定义样式文件
import { LogoutOutlined } from '@ant-design/icons';
// import { useHistory } from 'react-router-dom'; // 导入路由相关的依赖
import StaffDashboardContent from './StaffDashboardContent';

const { Title, Text } = Typography;


const { Header, Content } = Layout;

const StudentDashboardContent: React.FC = () => {
  return (
    <div style={{ border: '1px solid blue', margin: '100px' }}>
      学生仪表板内容
    </div>
  );
};

const TimeDisplay: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const formattedDate = date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Text style={{ color: 'white', display: 'block', fontFamily: 'Comic Sans MS' }}><div style={{ height: '20px' }}>{currentDate}</div>{currentTime}</Text>
  );
};

const Dashboard: React.FC = () => {
  const tabStyle: React.CSSProperties = {
    color: 'white',               // Tab文字颜色
    fontSize: '18px',           // Tab文字大小
    fontWeight: 'bold',         // Tab文字粗细
    textTransform: 'uppercase', // Tab文字格式（大写）
    fontFamily: 'Comic Sans MS', // 设置字体系列为Arial
    margin: '0',    // Tab文字与标签边框的间距
    padding: '2px',            // Tab文字内边距
    background: 'transparent',
    // border: '1px solid blue',    // Tab边框样式和大小
    // borderRadius: '8px'         // Tab边框圆角大小
  };

  // Tab
  const [activeTab, setActiveTab] = useState('1');
  const onChange = (key: string) => {
    setActiveTab(key);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Student Dashboard`,
      // children: <StudentDashboardContent />,
    },
    {
      key: '2',
      label: `Staff Dashboard`,
      // children: <StaffDashboardContent />,
    }
  ];

  // 头像
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleAvatarClick = () => {
    setIsModalVisible(true);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  
  // const history = useHistory(); // 创建路由实例
  const handleLogout = () => {
    // 执行退出登录的逻辑，例如清除用户信息、重置状态等
    // 然后跳转到登录页面
    // history.push('/login');
  };

  return (
    <Layout className="layout">
      <Header className="fixed-tabs" style={{ display: 'flex', alignItems: 'center', position: 'sticky', }}>
        <img 
          src={"../logo.svg"} 
          alt="LogoSVG" 
          style={{ width: '50px', height: 'auto', position: 'absolute', top: '10%', left: '1%' }} 
        />
        <Title level={4} style={{ color: '#fff', margin: '25px', fontFamily: 'Comic Sans MS', }}>Brainoverflow</Title>
        <Tabs    
          defaultActiveKey="1"
          activeKey={activeTab}
          items={items}
          onChange={onChange}
          className="custom-tabs" // 添加自定义CSS类名
          tabBarStyle={tabStyle}       
        />
        <div style={{ marginLeft: 'auto', marginRight: '-10px', display: 'flex', alignItems: 'center' }}>
          <TimeDisplay />
          <Avatar 
            size={40} 
            src={"../logo.svg"} 
            style={{ marginLeft: '10px' }} 
            onClick={handleAvatarClick}
          />
          <Modal title="Edit Profile" visible={isModalVisible} onCancel={handleModalClose} footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleModalClose}>
              Save
            </Button>,
          ]}>
            {/* Profile editing form */}
          </Modal>
          <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <LogoutOutlined style={{ fontSize: '20px', color: '#6D64FF', marginLeft: '15px' }} />
          </div>
        </div>
      </Header>
      <Content style={{ padding: '0 50px', position: 'relative' }}>
        <div>
          {activeTab === '1' ? <StudentDashboardContent /> : <StaffDashboardContent />}
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
