import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Typography, Avatar, Modal, Button,Form, Input,Upload, message } from 'antd';
import './navbar.less'; 
import { validEmail, validNotNull, ValidPassword,HOST, CHANGEFILE_URL,getToken} from '../src/utils/utils';
import { UserOutlined,LogoutOutlined,PlusOutlined,LoadingOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'umi';
import { ChangeUserDTO } from '../src/utils/entities';
import { useMediaPredicate } from "react-media-hook";
import logo_l from '../../images/logo_l.png';
import logo_s from '../../images/logo_s.png';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

function updateUserData(newUserData:any) {
  localStorage.setItem('userData', JSON.stringify(newUserData));
}

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
      <Text className='time-wrap'>
        <div className='time-inner'>{currentDate}</div>{currentTime}</Text>
    );
};


export default function Dashboard() {
  const tabs_list = [{
    key: '1',
    is_selected: true,
    title: 'Student Dashboard'
  },{
    key: '2',
    is_selected: false,
    title: 'Staff Dashboard'
  }]
  const tabs_list2 = [{
    key: '1',
    is_selected: false,
    title: 'Student Dashboard'
  },{
    key: '2',
    is_selected: true,
    title: 'Staff Dashboard'
  }]
  const location = useLocation();
  const { pathname } = location;
  const [tablist, settablist] = useState(pathname == '/staffcourse' || pathname == '/teacherforums' ? tabs_list2 :tabs_list);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tempFile, setTempFile] = useState<File | null>(null);

  let avatarURL:any;
  let userData = localStorage.getItem('userData');
  if (userData) {
    let parsedData = JSON.parse(userData);
    if (parsedData) {
      avatarURL = parsedData.avatar;
    }
  }
  const onclicktab = (e:any) => {
    tabs_list.map((item)=> {
      item.is_selected = false
    })
    tabs_list[Number(e.target.id) - 1].is_selected = true
    settablist([...tabs_list]);
    if (e.target.id == '1') {
      history.push('/home')
    } else {
      history.push('/staffcourse')
    }
  }
  const [form] = Form.useForm();

  function getUserData() {
    fetch(`${HOST}${CHANGEFILE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        message.error(res.message)
        return
      }
      setImageUrl(res.data.user.avatar);
      setEmail(res.data.user.email);
      setUsername(res.data.user.username);

      form.setFieldsValue({
        "username": res.data.user.username,
        "Email Address": res.data.user.email,
        "password": "",
      })
    })
    .catch(error => {
      message.error(error.message);
    });  
  }
  useEffect(() => {
    getUserData();
  }, []);
  
  const biggerThan540 = useMediaPredicate("(min-width: 540px)");
  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const beforeUpload = (file: any) => {
    setTempFile(file); // Save the file
    return false;  // Stop the upload
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
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setTempFile(null);
    getUserData();
  };
  const handleSubmit = () => {
    const token = getToken();
    if (!validNotNull(username)) {
      message.error('Please input a username');
      return;
    }
    if (!validEmail(email)) {
      message.error('Please input a valid email');
      return;
    }
    if (password !== "" && password !== null && !ValidPassword(password)) {
      message.error('Please input a valid password');
      return;
    }

    if (!tempFile) {
      // If the user not upload a new avatar, just update the user info
      const dto = new ChangeUserDTO(username, password, email, "");
      fetch(`${HOST}${CHANGEFILE_URL}`, {
        method: "Put",
        body: JSON.stringify(dto),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(res => {
        if (res.code !== 20000) {
          message.error(res.message);
          return
        }
        const currentUrl = window.location.href;
        console.log('Current URL:', currentUrl);
        window.location.reload();
        message.success("User information updated successfully");
        handleModalClose();
      })
      .catch(error => {
        message.error(error.message);
      });
    } else {
      // If the user upload a new avatar, first upload the avatar, then update the user info
      const formData = new FormData();
      formData.append("file", tempFile);
      fetch (`${HOST}/avatar`,{
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })
      .then(res => res.json())
      .then(res => {
        if (res.code !== 20000) {
          message.error(res.message);
          return
        }
        const newAvatar = res.data.avatar;
        setImageUrl(newAvatar);
        let userData = localStorage.getItem('userData');
        let parsedData = JSON.parse(userData || '{}');
        parsedData.avatar = newAvatar; // update the avatar
        localStorage.setItem('userData', JSON.stringify(parsedData));
    
        const dto = new ChangeUserDTO(username,password,email,newAvatar);
        fetch(`${HOST}${CHANGEFILE_URL}`, {
          method: "Put",
          body: JSON.stringify(dto),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        })
        .then(res => res.json())
        .then(res => {
          if (res.code !== 20000) {
            message.error(res.message);
            return
          }
          message.success("User information updated successfully");
          handleModalClose();
        })
        .catch(error => {
          message.error(error.message);
        });
      })
      .catch(error => {
        message.error(error.message);
      });
    }
  }
  const history = useHistory(); 
  const handleLogout = () => {
    localStorage.clear();
    history.push('/login');
  };
  return (
    <Layout className="layout">
      <Header className="fixed-tabs">
        <img
          src={logo_l}
          alt="LogoSVG" 
          className="hearder-logo-l"
        />
        <img
          src={logo_s}
          alt="LogoSVG" 
          className="hearder-logo-s"
        />
        <div className='tabs_wrap'>
          {
            tablist.map((tab)=>{
              return <div className={tab.is_selected ? 'tabs_active' : ''} key={tab.key} id={tab.key} onClick={onclicktab}>{tab.title}</div>
            })
          }
        </div>
        <div className='header-right'>
          <div className='hear-right-inner'>
            <div className='TimeDisplay'>
              <TimeDisplay />
            </div>
            <div className="avatar" style={{cursor:'pointer'}}>
            {
                userData && avatarURL
                ? <img src={avatarURL} style={{ width: '30px', height: '30px',borderRadius: '50%' }} onClick={handleAvatarClick} />
                : <Avatar icon={<UserOutlined />}  style={{cursor:'pointer',  width: '30px', height: '30px'}} onClick={handleAvatarClick} />
            }
            </div>


            <Modal title="My Profile" open={isModalVisible} onCancel={handleModalClose} style={{fontFamily: 'Comic Sans MS'}} footer={[
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
            multiple={false}
            maxCount={1}
            beforeUpload={beforeUpload}
          >
            {tempFile ? <img src={URL.createObjectURL(tempFile)} alt="avatar" style={{ width: '100%' }} /> : (imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton)}
          </Upload>
            </div>
              <Form form={form}
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, paddingTop: "30px",fontFamily: 'Comic Sans MS' }}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: false, message: 'Please input your Username!' }]}
                >
                  <Input placeholder="Please input your username" value={username} onChange={handleUsernameChange} />
                </Form.Item>

                <Form.Item
                  label="Email Address"
                  name="Email Address"
                  rules={[{ required: false, message: 'Please input your Email Address!' }]}
                >
                  <Input placeholder="Please input your email address" value={email} onChange={handleEmailChange} />
                </Form.Item>
            
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: false, message: 'Please input your Password!' }]}
                >
                  <Input.Password placeholder="Please input your password" value={password} onChange={handlePasswordChange} />
                </Form.Item>
              </Form>
            </Modal>
            <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <LogoutOutlined style={{ fontSize: '20px', color: '#6D64FF', marginLeft: '15px' }} />
            </div>
          </div>
        </div>
      </Header>
       <Content style={{ padding: '0 50px', position: 'relative' }}>
        {/* <div className='welcome'>
          {<StudentDashboardContent />}
        </div> */}
      </Content> 
      {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
    </Layout>
  );
};
