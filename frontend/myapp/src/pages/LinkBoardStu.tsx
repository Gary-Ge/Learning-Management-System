import React, { useEffect, useRef, useState } from 'react';
import { Layout, Typography, Button, Form, Input, Avatar, message, Modal, DatePicker, Select, Radio, Tag, Checkbox, Row, Col, Progress, Space, Statistic } from 'antd';
import {
  DeleteOutlined,
  UsergroupAddOutlined,
  PlusCircleOutlined,
  SendOutlined,
  HeartFilled,
  ClockCircleOutlined
} from '@ant-design/icons';
import {getToken} from '../utils/utils'
import FlvJs from 'flv.js';
import SockJsClient from 'react-stomp';
import crown from '../../../images/crown.png';
import fail from '../../../images/fail.png';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, CartesianGrid, Tooltip, YAxis, ResponsiveContainer } from 'recharts';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const dataDist = [
  { name: 'A', value: 0 },
  { name: 'B', value: 0 },
  { name: 'C', value: 0 },
  { name: 'D', value: 0 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const pieChart = (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={dataDist}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label={(entry: any) => `${entry.name} ${(entry.value * 100).toFixed(2)}%`}
      >
        {dataDist.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer>
);

const dataCount = [
  { name: 'A', value: 0 },
  { name: 'B', value: 0 },
  { name: 'C', value: 0 },
  { name: 'D', value: 0 },
];
const barChart = (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={dataCount}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

const LinkBoardStu: React.FC<{ stream: any }> = ({ stream }) => {
  const token = getToken();
  // stream
  const videoRef = useRef(null);
  const [playbackUrl, setPlaybackUrl] = useState('');
  useEffect(() => {
    if (stream.inProgress) {
      fetch(`http://175.45.180.201:10900/service-stream/stream-basic/stream/${stream.streamId}/play`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(res => {
          if (res.code !== 20000) {
            throw new Error(res.message);
          }
          setPlaybackUrl(res.data.playUrl);
        })
        .catch(error => {
          message.error(error.message);
        });
    } else {
      message.error('The live stream has not started yet.');
    }
  }, [stream.inProgress]);
  useEffect(() => {
    if (playbackUrl && FlvJs.isSupported()) {
      const videoElement = videoRef.current;
      videoElement.muted = true;

      const flvPlayer = FlvJs.createPlayer({
        type: 'flv',
        isLive: true,
        url: playbackUrl,
      });
      flvPlayer.attachMediaElement(videoRef.current);
      flvPlayer.load();
      flvPlayer.play();
      flvPlayer.on('error', err => {
        console.log('FLVJS: ', err);
      });
      return () => {
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
        videoRef.current.src = '';
        videoRef.current.removeAttribute('src');
      };
    }
  }, [playbackUrl]);

  // chat
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  const send = (message: any) => { // 发送信息
    fetch(`http://175.45.180.201:10900/service-stream/stream-chat/message/${stream.streamId}/${message}`, {
      method: 'POST',
      headers: headers
    })
    .then(res => res.json())
    .then(res => console.log(res.data))
    .catch(error => {
      message.error(error.message);
    });
    setInputValue('');
  }
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  const handleEnterPress = (e: any) => {
    if (e.key === 'Enter') {
      send(inputValue);
    }
  };

  // question
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleQuestionClick = () => {
    setIsModalVisible(true);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  const [showQuestion, setShowQuestion] = useState({});
  const [type, setType] = useState(Number);
  const [seconds, setSeconds] = useState(Number);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [correctOrNot, setCorrectOrNot] = useState(false);
  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [seconds]);
  const formatTime = (time: any) => {
    return time < 10 ? `0${time}` : time;
  };
  const [selectedOption, setSelectedOption] = useState(""); // 存储选项结果的状态
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [fasterThan, setFasterThan] = useState(Number);
  const [quizId, setQuizId] = useState('');
  let answer = {
    answers: []
  };
  const handleSubmit = () => {
    // console.log('selectedOption', selectedOption);
    // console.log('selectedOptions', selectedOptions);
    if (seconds !== 0 && type === 2) {
      if (showQuestion.questions[0].type === 0) {
        answer.answers.push(selectedOption);
        if (correctAnswer === selectedOption) {
          setCorrectOrNot(true);
        }
        else {
          setCorrectOrNot(false);
        }
      }
      else {
        // answer = [selectedOption];
        const selectedOptionsString = selectedOptions.join('');
        answer.answers.push(selectedOptionsString);
        if (correctAnswer === selectedOptionsString) {
          setCorrectOrNot(true);
        }
        else {
          setCorrectOrNot(false);
        }
      }
      // console.log(answer);
      const requestData = JSON.stringify(answer);
      fetch(`http://175.45.180.201:10900/service-stream/stream-quiz/quiz/answer/${quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: requestData
      })
      .then(res => res.json())
      .then(res => {
        // console.log('ass_res', res);
        if (res.code !== 20000) {
          throw new Error(res.message)
        }
        message.success('online quiz submit successfully');
        setFasterThan(res.data.fasterThan);
        // console.log('fasterThan', res.data.fasterThan);
        setSelectedOptions([]);
        setSelectedOption('');
      })
      .catch(error => {
        message.error(error.message);
      });
    }
    setIsModalVisible(false);
  };
  
  return (
    <>
    <SockJsClient
      url={`http://175.45.180.201:10940/ws?streamId=${stream.streamId}&userId=${JSON.parse(localStorage.getItem("userData")).userId}`}
      topics={[`/topic/stream/${stream.streamId}`]}
      onMessage={(msg: any) => {
        if (msg.type === 0) {
          setMessages(prevMessages => [...prevMessages, msg]);
        }
        else if (msg.type === 1) {
          // console.log('msg1', msg); // 处理收到的消息
          setUsers(msg.userList);
        }
        else if (msg.type === 2) {
          setShowQuestion(msg);
          setSeconds(msg.limitation);
          setQuizId(msg.quizId);
          setType(msg.type);
          setCorrectAnswer(msg.questions[0].answer);
          setIsModalVisible(true);
          // console.log('msg2', msg); // 处理收到的消息
        }
        else if (msg.type === 3) {
          setType(msg.type);
          console.log('msg3', msg); // 处理收到的消息
          dataDist.map((item:any)=>{
            // console.log(item)
            if (item.name === 'A') {
              item.value = msg.questions[0].distA;
            }
            else if (item.name === 'B') {
              item.value = msg.questions[0].distB;
            }
            else if (item.name === 'C') {
              item.value = msg.questions[0].distC;
            }
            else if (item.name === 'D') {
              item.value = msg.questions[0].distD;
            }
          })
          dataCount.map((item:any)=>{
            // console.log(item)
            if (item.name === 'A') {
              item.value = msg.questions[0].countA;
            }
            else if (item.name === 'B') {
              item.value = msg.questions[0].countB;
            }
            else if (item.name === 'C') {
              item.value = msg.questions[0].countC;
            }
            else if (item.name === 'D') {
              item.value = msg.questions[0].countD;
            }
          })
          setIsModalVisible(true);
        }
      }}
      // ref={handleStompClientRef} // 如果需要引用Stomp客户端实例，可以使用ref
    />
    <Layout style={{ minHeight: '100vh' }}>
      <Layout style={{  }}>        
        <Content style={{ margin: '24px 16px 0', background: '#fff', padding: '15px' }}>
          <Text style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold' }}>
            <UsergroupAddOutlined style={{ marginRight: '3px', fontSize: '20px' }} />
            Online People: {users.length}
          </Text>
          <Button 
            onClick={handleQuestionClick} 
            icon={<PlusCircleOutlined />} 
            type="primary" 
            ghost
            style={{ fontFamily: 'Comic Sans MS', marginLeft: '10px', borderRadius: '5px', color: 'black', borderColor: 'black' }} 
          >
            Questions
          </Button>
          
          {type === 2 && 
            <Modal title="Online Quiz" open={isModalVisible} onCancel={handleModalClose} style={{fontFamily: 'Comic Sans MS'}} footer={[
              <Button key="cancel" onClick={handleModalClose}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleSubmit}>
                Save
              </Button>,
            ]}>
              <div>
                {seconds > 0 ? (
                  <>
                  <div style={{ display: 'flex' }}>
                    <div style={{ flex: '1', alignSelf: 'flex-start' }}>
                      <ClockCircleOutlined style={{ fontSize: '24px', marginRight: '5px' }} />
                      {formatTime(Math.floor(seconds / 60))}:{formatTime(seconds % 60)}
                    </div>
                    <div style={{ flex: '9', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      <div style={{ textAlign: 'center' }}>
                        <Text style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold' }}>
                          {showQuestion.questions[0].question}
                        </Text>
                      </div>
                      {showQuestion.questions[0].type === 0 ? 
                      (
                        <Radio.Group
                          onChange={(e) => setSelectedOption(e.target.value)}
                          value={selectedOption}
                          style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', marginLeft: '25%' }}
                        >
                          {showQuestion.questions[0].optionA !== null && (
                            <Radio value="A" style={{ marginTop: '5px' }}>
                              A: {showQuestion.questions[0].optionA}
                            </Radio>
                          )}
                          {showQuestion.questions[0].optionB !== null && (
                            <Radio value="B" style={{ marginTop: '5px' }}>
                              B: {showQuestion.questions[0].optionB}
                            </Radio>
                          )}
                          {showQuestion.questions[0].optionC !== null && (
                            <Radio value="C" style={{ marginTop: '5px' }}>
                              C: {showQuestion.questions[0].optionC}
                            </Radio>
                          )}
                          {showQuestion.questions[0].optionD !== null && (
                            <Radio value="D" style={{ marginTop: '5px' }}>
                              D: {showQuestion.questions[0].optionD}
                            </Radio>
                          )}
                        </Radio.Group>
                      ):(
                        <>
                        <Checkbox.Group
                          onChange={(values) => setSelectedOptions(values)}
                          value={selectedOptions}
                          style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', marginLeft: '25%' }}
                        >
                          {showQuestion.questions[0].optionA !== null && (
                            <Checkbox value="A" style={{ marginBottom: '5px', marginLeft: '2.5%' }}>
                              A: {showQuestion.questions[0].optionA}
                            </Checkbox>
                          )}
                          {showQuestion.questions[0].optionB !== null && (
                            <Checkbox value="B" style={{ marginBottom: '5px' }}>
                              B: {showQuestion.questions[0].optionB}
                            </Checkbox>
                          )}
                          {showQuestion.questions[0].optionC !== null && (
                            <Checkbox value="C" style={{ marginBottom: '5px' }}>
                              C: {showQuestion.questions[0].optionC}
                            </Checkbox>
                          )}
                          {showQuestion.questions[0].optionD !== null && (
                            <Checkbox value="D" style={{ marginBottom: '5px' }}>
                              D: {showQuestion.questions[0].optionD}
                            </Checkbox>
                          )}
                        </Checkbox.Group>
                        </>
                      )}
                      
                    </div>
                  </div>
                  </>
                ) : (
                  <>
                  <div>Countdown finished!</div>
                  {formatTime(Math.floor(seconds / 60))}:{formatTime(seconds % 60)}
                  </>
                )}
              </div>
            </Modal>
          }
          {type === 3 && 
            <Modal title="Online Quiz" open={isModalVisible} onCancel={handleModalClose} style={{fontFamily: 'Comic Sans MS'}} footer={[
              <Button key="cancel" onClick={handleModalClose}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleSubmit}>
                Save
              </Button>,
            ]}>
              <>
              <Layout style={{ background: '#FFFFFF' }}>
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
                    height: 'auto'
                  }}
                >
                  <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold' }}>Qustion: {showQuestion.questions[0].question}</Title>
                  {correctOrNot ? (
                    <>
                    <img src={crown} width={'15%'}/>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', marginBottom: '15px' }}>
                      <Text>
                        Congratulations!! You answer is correct!
                      </Text>
                    </div>
                    </>
                  ):
                  (
                   <>
                    <img src={fail} width={'30%'}/>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', marginBottom: '15px' }}>
                      <Text>
                        What a pity! Your answer is wrong
                      </Text>
                    </div>                    
                   </> 
                  )}
                  <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-start' }}>
                    <Progress style={{ height: 'auto', width: '200px' }} percent={100} status="active" strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <Space wrap>
                        <Progress type="circle" percent={fasterThan * 100} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
                      </Space>
                    </div>
                    <div style={{ flex: 9 }}>
                      <Text>
                        Congratulations!! You are faster than {fasterThan * 100}% of students to submit
                      </Text>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <div>The percentage of students who chose the answer</div>
                      {pieChart}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div>The number of options the student chooses</div>
                      {barChart}
                    </div>
                  </div>
                </Content>

              </Layout>
              </>
            </Modal>
          }
          <Text style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold', float: 'right' }}>
            Course Name: {stream.title}
          </Text>
          <div style={{ marginTop: '15px', marginBottom: '15px', border: 'none', borderRadius: '10px', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <video ref={videoRef} controls width="100%" height="100%" style={{ borderRadius: '10px' }} />
          </div>
          <div>
            <div style={{ display: 'flex' }}>
              {(users || []).map((user, index) => (
                <div key={index} style={{ marginRight: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={user.avatar} style={{ cursor:'pointer', width: '80px', height: '80px', borderRadius: '50%' }} />
                    <Text style={{ fontFamily: 'Comic Sans MS' }}>{user.username}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Content>
        {/* <Footer
          style={{
            textAlign: 'center',
            backgroundColor: '#EFF1F6',
            fontFamily: 'Comic Sans MS',
          }}
        >
          Copyright ©2023 All rights reserved  
          <HeartFilled style={{ color: 'red', marginLeft: '5px' }} />
        </Footer> */}
      </Layout>
      <Sider width={250} style={{ background: '#f0f2f5' }}>
        <Content style={{ margin: '24px 16px 0', background: '#fff', padding: '15px', minHeight: '87vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', paddingBottom: 10, fontWeight: 'bold' }}>Chatting</Title>
          <Content style={{ overflow: 'auto', height: '60vh' }} >
            {(messages || []).map((message, index) => (
              <div key={index}>
                {message.avatar ? 
                  <>
                  <div>
                    <Text style={{ fontFamily: 'Comic Sans MS' }}>{message.username}</Text>
                  </div>
                  <img src={message.avatar} style={{ marginLeft: '5px', width: '30px', height: '30px',borderRadius: '50%' }} />
                  <Button type="primary" disabled={true} style={{ background: '#DAE8FC', border: 'none', color: 'black', marginLeft: '10px' }}>
                    {message.message}
                  </Button>
                  </>
                : <></>
                }
              </div>
            ))}
          </Content>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
            <Input 
              placeholder="Input your words"
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS', marginRight: 10 }}
              value={inputValue}
              onChange={handleInputChange}
              onPressEnter={handleEnterPress}
            />
            <Button type="primary" onClick={() => send(inputValue)} icon={<SendOutlined />} />
          </div>
        </Content>
      </Sider>
    </Layout>
    </>
  );
};

export default LinkBoardStu;
