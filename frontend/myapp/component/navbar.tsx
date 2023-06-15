import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Typography, Avatar, Modal, Button,Form, Input,message, Upload } from 'antd';
import type { TabsProps } from 'antd';
import './navbar.less'; 
import { validEmail, validNotNull, ValidPassword,HOST, CHANGEFILE_URL, HEADER} from '../src/utils/utils';
import { UserOutlined,LogoutOutlined,PlusOutlined,LoadingOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import AlertDialog from '../component/alert';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ChangeUserDTO } from '../src/utils/entities';


const { Title, Text } = Typography;

const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';
const { Header, Content } = Layout;

const StudentDashboardContent: React.FC = () => {
  return (
    <div style={{ border: '1px solid blue', margin: '100px' }}>
      学生仪表板内容
    </div>
  );
};

const { TabPane } = Tabs;

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
      <Text style={{ margin: '0px', padding: '0px', color: 'white', display: 'block', fontFamily: 'Comic Sans MS', minWidth: '80px' }}><div style={{ height: '25px', marginRight: '10px' }}>{currentDate}</div>{currentTime}</Text>
    );
  };

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('1');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validUsername, setValidUsename] = useState(true);
  const [validEmailState, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [showAlertUsername, setShowUsername] = useState(false);
  const [showAlertEmail, setShowEmail] = useState(false);
  const [showAlertPassword, setShowPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertDialogContent, setAlertDialogContent] = useState("");


  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleUsernameChange = (e:any) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e:any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e:any) => {
    setPassword(e.target.value);
  };

  const handleAvatarClick = () => {
    setIsModalVisible(true);
    window.history.pushState(null, '', '/user');
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    window.history.pushState(null, '', '/');
  };
  const handleSubmit = () => {
    if (!validNotNull(username)) {
      setValidUsename(false);
      setShowUsername(true);
      return
    } else {
      setValidUsename(true);
    }
    if (!validEmail(email)) {
      setValidEmail(false);
      setShowEmail(true);
      return
    } else {
      setValidEmail(true);
    }
    if (!ValidPassword(password)) {
      setValidPassword(false);
      setShowPassword(true);
      return
    } else {
      setValidPassword(true);
    }
    console.log("success")
  }
  const dto = new ChangeUserDTO(username,password,email,imageUrl);
  fetch(`${HOST}${CHANGEFILE_URL}`, {
    method: 'POST',
    body: JSON.stringify(dto),
    headers: HEADER
  })
  .then(res => res.json())
  .then(res => {
    if (res.code !== 20000) {
      throw new Error(res.message)
    }
    console.log(res.data.token)
    history.push('/login'); // redirect to login page, adjust as needed
  })
  .catch(error => {
    console.log(error.message)
  });  


  const tabStyle: React.CSSProperties = {
    color: 'white',               // Tab文字颜色
    fontSize: '18px',           // Tab文字大小
    fontWeight: 'bold',         // Tab文字粗细
    textTransform: 'uppercase', // Tab文字格式（大写）
    fontFamily: 'Comic Sans MS',
    margin: '0',    // Tab文字与标签边框的间距
    padding: '2px',            // Tab文字内边距
    background: 'transparent',
    // border: '1px solid blue',    // Tab边框样式和大小
    // borderRadius: '8px'         // Tab边框圆角大小
  };
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
  const history = useHistory(); 
  const handleLogout = () => {
    history.push('/login');
  };

  return (
    <Layout className="layout">
      <Header className="fixed-tabs" style={{ display: 'flex', alignItems: 'center', }}>
        <img
          src={url}
          alt="LogoSVG" 
          style={{ width: '50px', height: 'auto', position: 'absolute', top: '10%', left: '1%' }} 
        />
        <Title className="custom-title" level={4} style={{ color: '#fff', margin: '25px', fontFamily: 'Comic Sans MS', }}>Brainoverflow</Title>
        <Tabs    
          defaultActiveKey="1"
          activeKey={activeTab}
          items={items}
          onChange={onChange}
          className="custom-tabs" 
          tabBarStyle={tabStyle}       
          
        />
        <div style={{ marginLeft: 'auto', marginRight: '-10px', display: 'flex', alignItems: 'center' }}>
          <div className='TimeDisplay'>
            <TimeDisplay />
          </div>
          <Avatar
            icon={<UserOutlined />} 
            onClick={handleAvatarClick}
          />
          <Modal title="My Profile" visible={isModalVisible} onCancel={handleModalClose} footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmit}>
              Save
            </Button>,
          ]}>
            <div className="avatar" style={{display: 'flex',justifyContent:"center",alignItems:"center",paddingLeft: '37%'}}>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      </div>
            <Form
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, paddingTop: "30px" }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input placeholder="Please input your username" value={username} onChange={handleUsernameChange} />
      </Form.Item>

      <Form.Item
        label="Email Address"
        name="Email Address"
        rules={[{ required: true, message: 'Please input your Email Address!' }]}
      >
         <Input placeholder="Please input your email address" value={email} onChange={handleEmailChange} />
      </Form.Item>
  
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
         <Input placeholder="Please input your password" value={password} onChange={handlePasswordChange} />
      </Form.Item>
  
        </Form>
        {showAlertUsername && 
          <div className="alert-dialog-container">
            <AlertDialog
              message="Error"
              description="Please input a valid username" 
              onClose={() => setShowUsername(false)}
            />
          </div>
        }
        {showAlertEmail && 
          <div className="alert-dialog-container">
            <AlertDialog
              message="Error"
              description="Please input a valid email" 
              onClose={() => setShowEmail(false)}
            />
          </div>
        }
        {showAlertPassword && 
          <div className="alert-dialog-container">
            <AlertDialog
              message="Error"
              description="Please enter a password with at least 8 digits, including uppercase and lowercase numbers" 
              onClose={() => setShowPassword(false)}
            />
          </div>
        }
        {showMessage && 
          <div className="alert-dialog-container">
            <AlertDialog
              message="Error"
              description={alertDialogContent}
              onClose={() => setShowMessage(false)}
            />
          </div>
        }
          </Modal>
          <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <LogoutOutlined style={{ fontSize: '20px', color: '#6D64FF', marginLeft: '15px' }} />
          </div>
        </div>
      </Header>
      <Content style={{ padding: '0 50px', position: 'relative' }}>
        <div>
          {<StudentDashboardContent />}
        </div>
      </Content>
      {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
    </Layout>
  );
};
