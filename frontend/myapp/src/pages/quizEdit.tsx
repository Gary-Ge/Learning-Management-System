import React, { useEffect, useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, DatePicker, TimePicker, message  } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import {
  HeartFilled,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getToken} from '../utils/utils'
import { validNotNull } from '../utils/utilsStaff';
import { QuizDTO } from '../utils/entities';
import Quiz from './Quiz';

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

const QuizEdit: React.FC<{ onCancel: () => void; onSubmit: () => void; quiz: any }> = ({ onCancel, onSubmit, quiz }) => {
  const token = getToken();
  const [sectionInfor, setSectionInfor] = useState(quiz || {});
  const [forms, setForms] = useState<{ 
    id: number; 
    options: {id: number, value: string, isCorrect: boolean}[]; 
    selectedOption: string; 
    correctOptionId: string; 
    mark?: number | undefined;
    questionId:string,
    cover:string,
    questionTitle:string,
    questiontype:number,
    shortAnswer:string
  }[]>([]);
  
  
  const [title, setTitle] = useState("");
  const handleQuizTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const [limitation, setLimitation] = useState("");
  const handleQuizDescriptionChange = (e: any) => {
    setLimitation(e.target.value);
  };
  const [start, setStart] = useState("");
  const handleQuizStartChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setStart(formattedDate);
    }
  };
  const [end, setEnd] = useState("");
  const handleQuizEndChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setEnd(formattedDate);
    }
  };
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('quiz', quiz);
    setTitle(quiz.title);
    setStart(quiz.start);
    setEnd(quiz.end);
    setLimitation(quiz.limitation);
    setSectionInfor(quiz);

    form.setFieldsValue({
      "Title": quiz.title,
      "quiz attempt time": quiz.limitation
    })
    fetch(`/service-edu/edu-question/questions/${quiz.quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res);
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      else {
        console.log(res.data.questions)
        setForms(res.data.questions)
      }
    })
    .catch(error => {
      message.error(error.message);
    });
}, [quiz]);



  const handleSubmit = () => {
    // 处理提交逻辑
    const dto = new QuizDTO(title,start, end,limitation);
    const requestData = JSON.stringify(dto);
    fetch(`/service-edu/edu-quiz/quiz/${quiz.quizId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: requestData
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res);
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      else {
        message.success('Quiz updated successfully');
        onSubmit();
      }
    })
    .catch(error => {
      message.error(error.message);
    });
  };
  
  return (
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
          // border: '1px solid red'
        }}
      >
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Edit Stream Lesson</Title>
        <Form form={form} style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Quiz Title
              </Text>
            } 
            name="Title" 
            rules={[
              { max: 100, message: 'The quiz title must be less than 100 characters!' },
            ]}
          >
            <Input 
              placeholder={quiz.title}
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
              onChange={handleQuizTitleChange}
            />
          </Form.Item>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Quiz Attempt Time
              </Text>
            } 
            name="quiz attempt time" 
          >
            <Input
                type="number"
                placeholder="Input Number"
                style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
                onChange={handleQuizDescriptionChange}
              />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Start Date and Time
              </Text>
            }
            name="startDateTime"
          >
            <DatePicker style={{ fontFamily: 'Comic Sans MS', color: 'black',width: '100%' }} placeholder={quiz.start} showTime onOk={handleQuizStartChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                End Date and Time
              </Text>
            }
            name="endDateTime"
          >
            <DatePicker style={{ fontFamily: 'Comic Sans MS', color: 'black',width: '100%' }} placeholder={quiz.end} showTime onOk={handleQuizEndChange} />
          </Form.Item>
          {/*{forms.map((form) => (
            <div 
              key={form.id} 
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
                <div style={{ flex: 1,marginRight: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
                    <UploadImageButton onImageUpload={(url) => handleImageUpload(url, form.id)} url=""/>
                  </div>
                </div>
                <div style={{ flex: 2,marginLeft: '10px' }}>
                  <Form.Item
                    label={<Text style={{ fontFamily: 'Comic Sans MS' }}>Question</Text>}
                    name="question"
                    style={{ margin: '5px' }}
                  />
                  <Form.Item>
                    <Input
                      placeholder="Enter your question"
                      onChange={(e) => handleQuestionTitleChange(e,form.id)}
                      style={{ fontFamily: 'Comic Sans MS' }}
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
                    onChange={(value) => {
                      handleQuestionTypeChange(value,form.id);
                      const updatedForms = forms.map((f) => {
                        if (f.id === form.id) {
                          return { ...f, selectedOption: value };
                        }
                        return f;
                      });
                      setForms(updatedForms);
                    }}
                  >
                    <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="sc" >Single Choice</Select.Option>
                    <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="mc">Multi Choice</Select.Option>
                    <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="st">Single Text</Select.Option>
                  </Select>
                </div>
                <div style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Comic Sans MS',marginLeft:'10px' }}>Mark</Text>
                  <Input type="number" placeholder="Input Number" style={{ marginLeft: '5px', fontFamily: 'Comic Sans MS',width:'98%' }} onChange={(e) => {handleMark(e,form.id);handleMarkChange(form.id, e.target.value)}} />
                </div>
              </div>
              {form.selectedOption === 'sc' && (
                <div>
                  <div>
                    <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
                  </div>
                  {form.options.map((option) => (
                    <div key={option.id} style={{ display: 'flex', marginBottom: '5px' }}>
                      <div style={{ flex: 1 }}>
                        <Input placeholder="Option content" style={{ fontFamily: 'Comic Sans MS' }} value={option.value} onChange={(event) => handleInputChange(form.id, option.id, event)} />
                      </div>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => removeOption(form.id, option.id)}
                      />
                      <Radio
                          style = {{marginTop: '5px'}}
                          checked={form.correctOptionId.toString() === option.id.toString()}
                          onChange={() => handleOptionSCSelection(form.id, option.id)}
                      />
                      {option.isCorrect && (
                        <Tag color="green">Correct</Tag>
                      )}
                      {!option.isCorrect && (
                        <Tag color="red">Incorrect</Tag>
                      )}
                    </div>
                    
                  ))}
                  <Button
                    type="text"
                    icon={<PlusCircleOutlined />}
                    onClick={() => addOption(form.id)}
                    style={{ color: '#0085FC' }}
                  >
                    Add Answers
                  </Button>
                </div>
              )}
              {form.selectedOption === 'mc' && (
                <div>
                  <div>
                    <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
                  </div>
                  {form.options.map((option) => (
                    <div key={option.id} style={{ display: 'flex', marginBottom: '5px' }}>
                      <div style={{ flex: 1 }}>
                        <Input placeholder="Option content" style={{ fontFamily: 'Comic Sans MS' }} value={option.value} onChange={(event) => handleInputChange(form.id, option.id, event)}/>
                      </div>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        style={{ flexShrink: 0 }}
                        onClick={() => removeOption(form.id, option.id)}
                      />
                      <Checkbox
                        style = {{marginTop: '5px'}}
                        checked={option.isCorrect}
                        onChange={() => handleOptionMCSelection(form.id, option.id)}
                      />
                      {option.isCorrect ? (
                        <Tag color="green" style={{ marginLeft: '10px' }}>
                          Correct
                        </Tag>
                      ) : (
                        <Tag color="red" style={{ marginLeft: '10px' }}>
                          Incorrect
                        </Tag>
                      )}

                    </div>
                  ))}
                  <Button
                    type="text"
                    icon={<PlusCircleOutlined />}
                    onClick={() => addOption(form.id)}
                    style={{ color: '#0085FC' }}
                  >
                    Add Answers
                  </Button>
                </div>
              )}
              {form.selectedOption === 'st' && (
                <div>
                  <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
                  <Input.TextArea
                    placeholder="you can input many words here ..."
                    style={{ fontFamily: 'Comic Sans MS' }}
                    onChange={(e) => handleShortAnswerChange(e, form.id)}
                  />
                  
                </div>
              )}
              <Button
                type="text"
                icon={<DeleteOutlined />}
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => removeForm(form.id)}
              />
            </div>
          ))}
          {showTotalMark && forms.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: 'Comic Sans MS' }}>
            total mark: {totalMarks}
          </div>
          )}*/}
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
  );
};

export default QuizEdit;
