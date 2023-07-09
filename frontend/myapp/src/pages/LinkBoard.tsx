import React, { useEffect, useRef, useState } from 'react';
import { Layout, Typography, Button, Form, Input, Avatar, message, Modal, DatePicker, Select, Radio, Tag, Checkbox } from 'antd';
import {
  CameraOutlined,
  AudioOutlined,
  DeleteOutlined,
  UsergroupAddOutlined,
  PlusCircleOutlined,
  UserOutlined,
  SendOutlined,
  HeartFilled,
} from '@ant-design/icons';
import {getToken} from '../utils/utils'
import FlvJs from 'flv.js';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import UploadImageButton from './UploadImageButton';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const LinkBoard: React.FC<{ stream: any }> = ({ stream }) => {
  const token = getToken();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  const handleSubmit = () => {

  };
  const handleQuestionClick = () => {
    setIsModalVisible(true);
  };
  
  const [title, setTitle] = useState("");
  const handleTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [start, setStart] = useState("");
  const handleOnlineQuizStartChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setStart(formattedDate);
    }
  };
  const [end, setEnd] = useState("");
  const handleOnlineQuizEndChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setEnd(formattedDate);
    }
  };
  const [limitation, setLimitation] = useState("");
  const handleLimitationChange = (e:any) => {
    setLimitation(e.target.value);
  };
  const [cover, setImageUrl] = useState("");
  const handleImageUpload = (url: any) => {
    setImageUrl(url);
  };
  const [question, setQuestion] = useState("");
  const handleQuestionChange = (e: any) => {
    setQuestion(e.target.value);
  };
  const [mark, setMark] = useState(0);
  const handleOnlineQuizMarkChange = (e:any) => {
    setMark(e.target.value);
  };

  const [singleOptions, setSingleOptions] = useState([]);
  const addSingleOption = () => {
    const newOption = {
      id: Date.now(), // 生成独特的 ID
      value: ''
    };
    setSingleOptions([...singleOptions, newOption]);
  };
  const removeOption = (optionId: any) => {
    const updatedOptions = singleOptions.filter((singleOption:any) => singleOption.id !== optionId);
    setSingleOptions(updatedOptions);
  };
  const [selectedSingleOption, SetSelectedSingleOption] = useState(null);
  const handleRadioChange = (optionId: any) => {
    SetSelectedSingleOption(optionId);
  };

  const [multiOptions, setMultiOptions] = useState([]);
  const addMultiOption = () => {
    const newOption = {
      id: Date.now(), // 生成独特的 ID
      value: '',
      isCorrect: false
    };
    setMultiOptions([...multiOptions, newOption]);
  };
  const removeMultiOption = (optionId: any) => {
    const updatedOptions = multiOptions.filter((multiOption:any) => multiOption.id !== optionId);
    setMultiOptions(updatedOptions);
    const updatedCorrect = selectedMultiOption.filter(option => option !== optionId)
    setSelectedMultiOption(updatedCorrect);
  };
  const [selectedMultiOption, setSelectedMultiOption] = useState([]);
  const handleCheckBoxChange = (optionId: any) => {
    if (selectedMultiOption.includes(optionId)) {
      setSelectedMultiOption(selectedMultiOption.filter(option => option !== optionId));
    } else {
      setSelectedMultiOption([...selectedMultiOption, optionId]);
    }
  };

  const [selectedOption, setSelectedOption] = useState('');
  let content;
  if (selectedOption === 'sc') {
    content = 
    <div>
      <div>
        <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
      </div>
      {singleOptions.map(singleOption => (
        <div key={singleOption.id} style={{ display: 'flex', marginBottom: '5px' }}>
          <div style={{ flex: 1 }}>
            <Input placeholder="Option content" style={{ fontFamily: 'Comic Sans MS' }} />
          </div>
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
            onClick={() => removeOption(singleOption.id)}
          />
          <Radio
            style = {{marginTop: '5px'}}
            checked={selectedSingleOption === singleOption.id}
            onChange={() => handleRadioChange(singleOption.id)}
          />
          {selectedSingleOption === singleOption.id && (
            <Tag color="green" >Correct</Tag>
          )}
          {selectedSingleOption !== singleOption.id && (
            <Tag color="red" >Incorrect</Tag>
          )}
        </div>
      ))}
      <Button
        type="text"
        icon={<PlusCircleOutlined />}
        onClick={addSingleOption}
        style={{ color: '#0085FC' }}
      >
        Add Answers
      </Button>
    </div>;
  }
  else if (selectedOption === 'mc') {
    content = 
    <div>
      <div>
        <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
      </div>
      {multiOptions.map(multiOption => (
        <div key={multiOption.id} style={{ display: 'flex', marginBottom: '5px' }}>
          <div style={{ flex: 1 }}>
            <Input placeholder="Option content" style={{ fontFamily: 'Comic Sans MS' }} />
          </div>
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
            style={{ flexShrink: 0 }}
            onClick={() => removeMultiOption(multiOption.id)}
          />
          <Checkbox
            style = {{marginTop: '5px'}}
            checked={selectedMultiOption.includes(multiOption.id)}
            onChange={() => handleCheckBoxChange(multiOption.id)}
          />
          {(selectedMultiOption && selectedMultiOption.includes(multiOption.id)) ? (
            <Tag color="green" style = {{marginLeft: '10px'}}>Correct</Tag>
          ):(
            <Tag color="red" style = {{marginLeft: '10px'}}>Incorrect</Tag>
          )}

        </div>
      ))}
      <Button
        type="text"
        icon={<PlusCircleOutlined />}
        onClick={addMultiOption}
        style={{ color: '#0085FC' }}
      >
        Add Answers
      </Button>
    </div>;
  }
  else if (selectedOption === 'st') {
    content = 
    <div>
      <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
      <Input.TextArea
        placeholder="you can input many words here ..."
        style={{ fontFamily: 'Comic Sans MS' }}
      />
    </div>;
  }
  else {
    content = null;
  }
  
  const [isModalStuVisible, setIsModalStuVisible] = useState(false);
  const handleStudentsClick = () => {
    setIsModalStuVisible(true);
  };
  const handleModalStuClose = () => {
    setIsModalStuVisible(false);
  };
  const handleStuSubmit = () => {

  };
  // stream
  const videoRef = useRef(null);
  const [pushStarted, setPushStarted] = useState(false);
  useEffect(() => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    // start
    fetch(`http://175.45.180.201:10900/service-stream/stream-basic/stream/${stream.streamId}/start`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res);
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
    })
    .catch(error => {
      message.error(error.message);
    });
    const interval = setInterval(() => {
      fetch(`http://175.45.180.201:10900/service-stream/stream-basic/stream/${stream.streamId}/status`, {
        method: "GET",
        headers: headers
      }).then(res => res.json())
        .then(res => {
          if (res.data.isPushing) {
            setPushStarted(true);
            clearInterval(interval);
          }
        })
    }, 2000); // 使⽤定时器轮询，判断推流是否开始
  });
  useEffect(() => {
    // 如果推流已经开始，创建播放器
    if (pushStarted && FlvJs.isSupported()) {
      const videoElement = videoRef.current;
      videoElement.muted = true; // 必须设置为静⾳播放，否则⾃动播放⽆法开始，⽤户可以⼿动打开声⾳
      fetch(`http://175.45.180.201:10900/service-stream/stream-basic/stream/${stream.streamId}/play`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(res => {
        // console.log('res', res);
        if (res.code !== 20000) {
          throw new Error(res.message)
        }
        const flvPlayer = FlvJs.createPlayer({
          type: 'flv',
          isLive: true,
          url: res.data.playUrl,
        });
        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        flvPlayer.play();
        flvPlayer.on('error', (err) => {
          console.log('FLVJS: ', err);
        });
        return () => {
          flvPlayer.unload();
          flvPlayer.detachMediaElement();
          flvPlayer.destroy();
          videoRef.current.src = '';
          videoRef.current.removeAttribute('src');
        };
      })
      .catch(error => {
        message.error(error.message);
      });      
    }
  }, [pushStarted]);
  // chat
  const [messages, setMessages] = useState([]);
  const stompClient = useRef(null);
  useEffect(() => {
    fetch(`http://175.45.180.201:10900/service-ucenter/ucenter/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res);
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      const socket = new SockJS(`http://175.45.180.201:10940/ws?streamId=${stream.streamId}`); 
      // const client = new Client({
        // webSocketFactory: () => socket,
        // onConnect: () => {
        //   client.subscribe(`/topic/stream/${stream.streamId}`, (message) => {
        //     const data = JSON.parse(message.body)
        //     if (data.type === 0) { // 判断事件类型
        //       setMessages(prevMessages => [...prevMessages, data])
        //     }
        //     console.log(data)
        //   }, {
        //     id:  `${res.data.user.userId}`
        //   })
        // }
      // })
      // client.activate();
      // stompClient.current = client
      // return () => {
      //   client.deactivate()
      // }
    })
    .catch(error => {
      message.error(error.message);
    });

    
  }, [])
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  const send = () => { // 发送信息
    fetch(`http://175.45.180.201:10900/service-stream/stream-chat/message/${stream.streamId}/${message}`, {
      method: 'POST',
      headers: headers
    })
    .then(res => res.json())
    .then(res => console.log(res.data));
  }
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
            onClick={handleStudentsClick} 
            icon={<PlusCircleOutlined />} 
            type="primary" 
            ghost
            style={{ fontFamily: 'Comic Sans MS', marginLeft: '10px', borderRadius: '5px' }} 
          >
            Students
          </Button>
          <Modal title="Online Students" open={isModalStuVisible} onCancel={handleModalStuClose} style={{fontFamily: 'Comic Sans MS'}} footer={[
            <Button key="cancel" onClick={handleModalStuClose}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleStuSubmit}>
              Save
            </Button>,
          ]}></Modal>
          <Button 
            onClick={handleQuestionClick} 
            icon={<PlusCircleOutlined />} 
            type="primary" 
            ghost
            style={{ fontFamily: 'Comic Sans MS', marginLeft: '10px', borderRadius: '5px', color: 'black', borderColor: 'black' }} 
          >
            Questions
          </Button>
          <Modal title="Online Quiz" open={isModalVisible} onCancel={handleModalClose} style={{fontFamily: 'Comic Sans MS'}} footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmit}>
              Save
            </Button>,
          ]}>
            <div style={{display: 'flex',justifyContent:"center",alignItems:"center" }}>
              <Input style={{ width: '70%', borderRadius: '5px' }} placeholder="Type Question Title" value={title} onChange={handleTitleChange} />
            </div>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600, paddingTop: '30px', fontFamily: 'Comic Sans MS' }}
              autoComplete="off"
            >
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <DatePicker style={{ width: '100%', border: '1px solid #0085FC' }} placeholder="Select Start Date and Time" showTime onOk={handleOnlineQuizStartChange} />
                <DatePicker style={{ marginLeft: '5%', width: '100%', border: '1px solid #0085FC' }} placeholder="Select End Date and Time" showTime onOk={handleOnlineQuizEndChange} />
              </div>
              <div style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns: '1fr 1.7fr', columnGap: '3%' }}>
                <div style={{ marginLeft: '10px'}}>
                  <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>Question Attempt Time</Text>
                </div>
                <div style={{ borderRadius: '5px'}}>
                  <Input
                    type="number"
                    placeholder="Input Number"
                    style={{ fontFamily: 'Comic Sans MS' }}
                    onChange={handleLimitationChange}
                  />
                </div>
              </div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '15px',
                  border: '1px dashed #66B2FF',
                  borderRadius: '4px',
                  padding: '10px'
                }}
              >
                <div style={{ display: 'flex', marginBottom: '15px' }}>
                  <div style={{ flex: 1, marginRight: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
                      <UploadImageButton onImageUpload={handleImageUpload} url=""/>
                    </div>
                  </div>
                  <div style={{ flex: 2, marginLeft: '10px' }}>
                    <Form.Item
                      label={<Text style={{ fontFamily: 'Comic Sans MS' }}>Question</Text>}
                      name="question"
                      style={{ margin: '0' }}
                    >
                      <Input
                        placeholder="Enter your question"
                        style={{ fontFamily: 'Comic Sans MS' }}
                        value={question} 
                        onChange={handleQuestionChange}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div style={{ display: 'flex', marginBottom: '5px' }}>
                  <div style={{ flex: 1,marginRight: '10px' }}>
                    <Text style={{ fontFamily: 'Comic Sans MS' }}>Question Type</Text>
                    <Select
                      placeholder="Select Option"
                      style={{ width: '100%', fontFamily: 'Comic Sans MS' }}
                      value={selectedOption}
                      onChange={value => setSelectedOption(value)}
                    >
                      <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="sc">Single Choice</Select.Option>
                      <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="mc">Multi Choice</Select.Option>
                      <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="st">Single Text</Select.Option>
                    </Select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Comic Sans MS',marginLeft:'10px' }}>Mark</Text>
                    <Input type="number" placeholder="Input Number" style={{ marginLeft: '5px', fontFamily: 'Comic Sans MS',width:'98%' }} value={mark} onChange={handleOnlineQuizMarkChange} />
                  </div>
                </div>
                {content}
              </div>
            </Form>
          </Modal>
          <Text style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold', float: 'right' }}>
            Course Name: {stream.title}
          </Text>
          <div style={{ marginTop: '15px', marginBottom: '15px', border: 'none', borderRadius: '10px', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <video ref={videoRef} controls width={"100%"} height={"100%"} style={{ borderRadius: '10px' }} />
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
