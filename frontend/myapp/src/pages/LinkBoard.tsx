import React, { useEffect, useRef, useState } from 'react';
import { Layout, Typography, Button, Form, Input, Avatar, message  } from 'antd';
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
import FlvJs from 'flv.js';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const LinkBoard: React.FC<{ stream: any }> = ({ stream }) => {
  const token = getToken();
  // stream
  const videoRef = useRef(null);
  const [pushStarted, setPushStarted] = useState(false);
  const [urlLink, setUrlLink] = useState("");
  useEffect(() => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
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
        setUrlLink(res.data.playUrl);
      })
      .then(() => {
        const flvPlayer = FlvJs.createPlayer({
          type: 'flv',
          isLive: true,
          url: urlLink,
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
  }, [pushStarted, urlLink]);
  // chat
  const [userId, setUserId] = useState("");
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
      setUserId(res.data.user.userId);
    })
    .catch(error => {
      message.error(error.message);
    });

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
      //     id:  `${userId}`
      //   })
      // }
    // })
    // client.activate();
    // stompClient.current = client
    // return () => {
    //   client.deactivate()
    // }
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
