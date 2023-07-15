import React, { useEffect, useRef, useState } from 'react';
import { Layout, Typography, Button, Form, Input, Avatar, message, Modal, DatePicker, Select, Radio, Tag, Checkbox, Row, Col, Progress, Space, Statistic } from 'antd';
import {
  DeleteOutlined,
  UsergroupAddOutlined,
  PlusCircleOutlined,
  SendOutlined,
  HeartFilled,
} from '@ant-design/icons';
import {getToken} from '../utils/utils'
import FlvJs from 'flv.js';
import SockJsClient from 'react-stomp';
import { validNotNull } from '../utils/utilsStaff';
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


const LinkBoard: React.FC<{ stream: any; onClick: (streamId: string) => void }> = ({ stream, onClick }) => {
  const token = getToken();
  
  // const [showConfirmation, setShowConfirmation] = useState(false);
  // const handleClick = (event: any) => {
  //   const componentAElement = document.getElementById("LinkBoard");
  //   const targetElement = event.target;

  //   if (componentAElement && !componentAElement.contains(targetElement)) {
  //     setShowConfirmation(true);
  //   }
  // };
  // useEffect(() => {
  //   document.addEventListener('click', handleClick);
  //   return () => {
  //     document.removeEventListener('click', handleClick);
  //   };
  // }, [handleClick]);
  // const handleConfirmation = () => {
  //   setShowConfirmation(false);
  //   onClick(stream.streamId);
  // };

  // stream
  const videoRef = useRef(null);
  const [pushStarted, setPushStarted] = useState(false);
  const [showPushUrlModal, setShowPushUrlModal] = useState(false);
  const [pushUrl, setPushUrl] = useState('');
  useEffect(() => {
    if (stream.inProgress) {
      setPushStarted(true);
    } else {
      fetch(`http://175.45.180.201:10900/service-stream/stream-basic/stream/${stream.streamId}/pushUrl`, {
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
          setPushUrl(res.data.pushUrl);
          setShowPushUrlModal(true);
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  }, []);
  const handleStartPush = () => {
    fetch(`http://175.45.180.201:10900/service-stream/stream-basic/stream/${stream.streamId}/start`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.code !== 20000) {
          throw new Error(res.message);
        }
        setShowPushUrlModal(false);
        setPushStarted(true);
      })
      .catch(error => {
        message.error(error.message);
      });
  };
  useEffect(() => {
    if (pushStarted && FlvJs.isSupported()) {
      const videoElement = videoRef.current;
      videoElement.muted = true;
  
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
          const flvPlayer = FlvJs.createPlayer({
            type: 'flv',
            isLive: true,
            url: res.data.playUrl,
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
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  }, [pushStarted]);

  // chat
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
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
  const [seconds, setSeconds] = useState(Number);
  const handleSecondsChange = (e:any) => {
    setSeconds(e.target.value);
  };
  const [question, setQuestion] = useState("");
  const handleQuestionChange = (e: any) => {
    setQuestion(e.target.value);
  };
  const [mark, setMark] = useState(0);
  const handleOnlineQuizMarkChange = (e:any) => {
    setMark(e.target.value);
  };
  // single
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
  const handleOptionChange = (optionId: any, value: any) => {
    const updatedOptions = singleOptions.map((singleOption) => {
      if (singleOption.id === optionId) {
        return {
          ...singleOption,
          value: value,
        };
      }
      return singleOption;
    });
    setSingleOptions(updatedOptions);
  };
  // multi
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
  const handleMultiOptionChange = (optionId: any, value: any) => {
    const updatedOptions = multiOptions.map((multiOption) => {
      if (multiOption.id === optionId) {
        return {
          ...multiOption,
          value: value,
        };
      }
      return multiOption;
    });
    setMultiOptions(updatedOptions);
  };
  // select type
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
            <Input 
              placeholder="Option content" 
              style={{ fontFamily: 'Comic Sans MS' }} 
              value={singleOption.value} // 将输入框的值与对应的 value 关联起来
              onChange={(e) => handleOptionChange(singleOption.id, e.target.value)} // 更新对应的 value 值
            />
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
      {singleOptions.length < 4 && 
        <Button
          type="text"
          icon={<PlusCircleOutlined />}
          onClick={addSingleOption}
          style={{ color: '#0085FC' }}
        >
          Add Answers
        </Button>
      }
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
            <Input 
              placeholder="Option content" 
              style={{ fontFamily: 'Comic Sans MS' }} 
              value={multiOption.value} // 将输入框的值与对应的 value 关联起来
              onChange={(e) => handleMultiOptionChange(multiOption.id, e.target.value)}
            />
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
      {multiOptions.length < 4 && 
        <Button
          type="text"
          icon={<PlusCircleOutlined />}
          onClick={addMultiOption}
          style={{ color: '#0085FC' }}
        >
          Add Answers
        </Button>
      }      
    </div>;
  }
  else {
    content = null;
  }
  // submit
  let online_quiz = {
    limitation: 0,
    questions: [{
      mark: 0, type: 0, question: '', 
      optionA: '', optionB: '', optionC: '', optionD: '',
      answer: ''
    }],
  }
  const handleSubmit = () => {
    if (!validNotNull(seconds)) {
      alert('Please input a valid question seconds')
      return
    }
    if (!validNotNull(question)) {
      alert('Please input a valid question')
      return
    }
    if (!validNotNull(mark)) {
      alert('Please input a valid question mark')
      return
    }
    online_quiz.limitation = seconds;
    online_quiz.questions[0].question = question;
    online_quiz.questions[0].mark = mark;

    if (selectedOption === 'sc') {
      online_quiz.questions[0].type = 0;
      singleOptions.map((item: any, index: number) => {
        if(item.id == selectedSingleOption) {
          if (index == 0) {
            online_quiz.questions[0].answer = 'A' || 'a';
          }
          else if (index == 1) {
            online_quiz.questions[0].answer = 'B' || 'b';
          }
          else if (index == 2) {
            online_quiz.questions[0].answer = 'C' || 'c';
          }
          else if (index == 3) {
            online_quiz.questions[0].answer = 'D' || 'd';
          }
        }
        if (index === 0) {
          online_quiz.questions[0].optionA = item.value;
        }
        else if (index === 1) {
          online_quiz.questions[0].optionB = item.value;
        }
        else if (index === 2) {
          online_quiz.questions[0].optionC = item.value;
        }
        else if (index === 3) {
          online_quiz.questions[0].optionD = item.value;
        }
      })      
    }
    else if (selectedOption === 'mc') {
      online_quiz.questions[0].type = 1
      let answer = '';;
      multiOptions.map((item: any, index: number) => {
        if (index === 0) {
          online_quiz.questions[0].optionA = item.value;
        }
        else if (index === 1) {
          online_quiz.questions[0].optionB = item.value;
        }
        else if (index === 2) {
          online_quiz.questions[0].optionC = item.value;
        }
        else if (index === 3) {
          online_quiz.questions[0].optionD = item.value;
        }
        if (selectedMultiOption.includes(item.id)) {
          answer += String.fromCharCode(65 + index); // 将索引值转换为对应的大写字母
        }
      })
      online_quiz.questions[0].answer = answer;
    }
    // console.log('online_quiz', online_quiz);
    const requestData = JSON.stringify(online_quiz);
    fetch(`http://175.45.180.201:10900/service-stream/stream-quiz/quiz/${stream.streamId}`, {
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
      message.success('online quiz create successfully');
      setSeconds(0);
      setQuestion('');
      setMark(0);
      setSingleOptions([]);
      SetSelectedSingleOption(null);
      setMultiOptions([]);
      setSelectedMultiOption([]);
      setSelectedOption('');
    })
    .catch(error => {
      message.error(error.message);
    });
    setIsModalVisible(false);    
  }; 
  const [type, setType] = useState(Number);
  const [showQuestion, setShowQuestion] = useState({});
  const [isModalOpenMark, setIsModalOpenMark] = useState(false);
  const handleModalMarkClose = () => {
    setIsModalOpenMark(false);
  };
  const handleMarkSubmit = () => {
    setIsModalOpenMark(false);
  };
  const handleMarkClick = () => {
    setIsModalOpenMark(true);
  };

  return (
    <>
    {/* <div id="LinkBoard">
      {showConfirmation && (
        <Modal
          title="Finish Stream"
          visible={showConfirmation}
          style={{ fontFamily: "Comic Sans MS" }}
          footer={[
            <Button key="submit" type="primary" onClick={handleConfirmation}>
              Confirm
            </Button>,
          ]}
        >
          <div>
            You have already finished the Stream!
          </div>
        </Modal>
      )}
    </div> */}
    <SockJsClient
      url={`http://175.45.180.201:10940/ws?streamId=${stream.streamId}&userId=${JSON.parse(localStorage.getItem("userData")).userId}`}
      topics={[`/topic/stream/${stream.streamId}`]}
      onMessage={(msg: any) => {
        if (msg.type === 0) {
          setMessages(prevMessages => [...prevMessages, msg]);
        }
        else if (msg.type === 1) {
          // console.log('msg', msg.userList); // 处理收到的消息
          setUsers(msg.userList);
        }
        else if (msg.type === 2) {
          setShowQuestion(msg);
          setType(msg.type);
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
          setIsModalOpenMark(true);
        }
      }}
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
          <Modal title="Online Quiz" open={isModalVisible} onCancel={handleModalClose} style={{fontFamily: 'Comic Sans MS'}} footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmit}>
              Save
            </Button>,
          ]}>
            <div style={{display: 'flex',justifyContent:"center",alignItems:"center", marginTop: '10px' }}>
              <Text style={{ fontFamily: 'Comic Sans MS', marginRight: '5px' }}>Time Limitations</Text>
              <Input type='number' style={{ width: '50%', borderRadius: '5px' }} placeholder="Type seconds" value={seconds} onChange={handleSecondsChange} />
            </div>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600, paddingTop: '30px', fontFamily: 'Comic Sans MS' }}
              autoComplete="off"
            >
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
                  <div style={{ flex: 1, marginLeft: '10px' }}>
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
          {type === 3 && 
            <>
            <Button 
              onClick={handleMarkClick} 
              type="primary" 
              ghost
              style={{ fontFamily: 'Comic Sans MS', marginLeft: '10px', borderRadius: '5px' }} 
            >
              Results
            </Button>
            <Modal title="Online Quiz" open={isModalOpenMark} onCancel={handleModalMarkClose} style={{fontFamily: 'Comic Sans MS'}} footer={[
              <Button key="cancel" onClick={handleModalMarkClose}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleMarkSubmit}>
                Save
              </Button>,
            ]}>
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
            </Modal>
            </>
          }
          <Text style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold', float: 'right' }}>
            Course Name: {stream.title}
          </Text>
          <div style={{ marginTop: '15px', marginBottom: '15px', border: 'none', borderRadius: '10px', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Modal
              visible={showPushUrlModal}
              onCancel={() => setShowPushUrlModal(false)}
              onOk={handleStartPush}
              okText="Start Push"
            >
              <p>Push URL: {pushUrl}</p>
            </Modal>
            <video ref={videoRef} controls width={"100%"} height={"100%"} style={{ borderRadius: '10px' }} />
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

export default LinkBoard;
