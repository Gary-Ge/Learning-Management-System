import React, { useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, DatePicker, TimePicker, Select, Radio, Tag, Checkbox } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import './Quiz.css';
import {
  HeartFilled,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import UploadImageButton from './UploadImageButton';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Quiz: React.FC<{ onCancel: () => void; onSubmit: () => void; courseId: string }> = ({ onCancel, onSubmit, courseId }) => {
  const [totalMarks, setTotalMarks] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [forms, setForms] = useState<{ id: number; options: number[]; selectedOption: string; correctOptionId: string;mark?: number; }[]>([]);
  const [showTotalMark, setShowTotalMark] = useState(true);
  const addForm = () => {
    const newFormId = Date.now(); // Generate a unique ID for the new form
    const newOptionId1 = Date.now(); // Generate a unique ID for the first new option
    const newOptionId2 = newOptionId1 + 1; // Generate a unique ID for the second new option
    setForms([...forms, { id: newFormId, options: [newOptionId1, newOptionId2], selectedOption: 'sc', correctOptionId: '',mark: 0 }]);
};
const removeForm = (formId: number) => {
  const formToRemove = forms.find((form) => form.id === formId);
  if (formToRemove) {
    const updatedForms = forms.filter((form) => form.id !== formId);
    setForms(updatedForms);
    if (formToRemove.mark) {
      const totalMarks = updatedForms.reduce((total, form) => (form.mark ? total + form.mark : total), 0);
      setTotalMarks(totalMarks);
    }
  }

  // 检查 updatedForms 是否为空，如果为空，则将 showTotalMark 设置为 false
  setShowTotalMark(forms.length > 0);
};
  const addOption = (formId: any) => {
    const updatedForms = forms.map((form) => {
      if (form.id === formId) {
        const newOptionId = Date.now(); // Generate a unique ID for the new option
        const updatedOptions = [...form.options, newOptionId];
        return { ...form, options: updatedOptions };
      }
      return form;
    });
    setForms(updatedForms);
  };

  const removeOption = (formId: any, optionId: any) => {
    const updatedForms = forms.map((form) => {
      if (form.id === formId) {
        const updatedOptions = form.options.filter((id:any) => id !== optionId);
        return { ...form, options: updatedOptions };
      }
      return form;
    });
    setForms(updatedForms);
  };

  const handleOptionSelection = (formId: any, optionId: any) => {
    const updatedForms = forms.map((form) => {
      if (form.id === formId) {
        if (form.selectedOption === 'mc') {
          // 多项选择
          let updatedCorrectOptions = form.correctOptionId ? [...form.correctOptionId] : [];
  
          // 判断选项是否已选中
          const optionIndex = updatedCorrectOptions.indexOf(optionId);
          if (optionIndex !== -1) {
            // 已选中，则移除选中状态
            updatedCorrectOptions.splice(optionIndex, 1);
          } else {
            // 未选中，则添加选中状态
            updatedCorrectOptions.push(optionId);
          }
  
          return { ...form, correctOptionId: updatedCorrectOptions };
        } 
        if (form.selectedOption === 'sc') {
          // 单项选择
          if (form.correctOptionId === optionId.toString()) {
            // 如果已经选中，那么点击就取消选中
            return { ...form, correctOptionId: '' };
          } else {
            return { ...form, correctOptionId: optionId.toString() };
          }
        }
        
      }
      return form;
    });
  
    // 清空文本答案的输入
    const updatedFormsWithClearedTextAnswer = updatedForms.map((form) => {
      if (form.id === formId && form.selectedOption === 'st') {
        return { ...form, correctOptionId: '', textAnswer: '' };
      }
      return form;
    });
  
    setForms(updatedFormsWithClearedTextAnswer);
  };
  const handleMarkChange = (formId:any, value:any) => {
    let markValue = parseInt(value);
    const updatedForms = forms.map((form) => {
        if (form.id === formId) {
            return { ...form, mark: markValue };
        }
        return form;
    });
    setForms(updatedForms);
    let total = updatedForms.reduce((acc, form) => acc + (form.mark || 0), 0);
    setTotalMarks(total);
};


  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  const handleSubmit = () => {
    onSubmit();
  };
  const [cover, setImageUrl] = useState("");
  const handleImageUpload = (url: any) => {
    setImageUrl(url);
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
          margin: '90px auto',
          height: 'auto',
          marginTop: '30px'
          // border: '1px solid red'
        }}
      >
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Create Quiz</Title>
        <Form style={{ margin: '0 auto', maxWidth: '400px' }}>
          <Form.Item 
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Quiz Title
              </Text>
            } 
            name="quiz title" 
          >
            <Input 
              placeholder="Input Title" 
              style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
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
            <Select
              placeholder="Select Option"
              style={{ fontFamily: 'Comic Sans MS', width: '100%' }}
              onChange={(value) => {
                setSelectedOption(value);
              }}
            >
              <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="Custom Options">Custom Options</Select.Option>
              <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="Limited">Limited</Select.Option>
            </Select>
          </Form.Item>
          {selectedOption === 'Custom Options' && (
            <Form.Item
              label={
                <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                  Custom Attempt Time
                </Text>
              }
              name="customAttemptTime"
            >
              <Input
                type="number"
                placeholder="Input Number"
                style={{ fontSize: '15px', fontFamily: 'Comic Sans MS' }}
              />
            </Form.Item>
          )}
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                Start Date and Time
              </Text>
            }
            name="startDateTime"
          >
            <DatePicker style={{ fontFamily: 'Comic Sans MS', color: 'black',width: '100%' }} placeholder="Select Start Date and Time" showTime />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                End Date and Time
              </Text>
            }
            name="endDateTime"
          >
            <DatePicker style={{ fontFamily: 'Comic Sans MS', color: 'black',width: '100%' }} placeholder="Select Start Date and Time" showTime />
          </Form.Item>
          {forms.map((form) => (
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
                    <UploadImageButton onImageUpload={handleImageUpload} url=""/>
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
                      const updatedForms = forms.map((f) => {
                        if (f.id === form.id) {
                          return { ...f, selectedOption: value };
                        }
                        return f;
                      });
                      setForms(updatedForms);
                    }}
                  >
                    <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="sc">Single Choice</Select.Option>
                    <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="mc">Multi Choice</Select.Option>
                    <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value="st">Single Text</Select.Option>
                  </Select>
                </div>
                <div style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Comic Sans MS',marginLeft:'10px' }}>Mark</Text>
                  <Input type="number" placeholder="Input Number" style={{ marginLeft: '5px', fontFamily: 'Comic Sans MS',width:'98%' }} onChange={(e) => handleMarkChange(form.id, e.target.value)} />
                </div>
              </div>
              {form.selectedOption === 'sc' && (
                <div>
                  <div>
                    <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
                  </div>
                  {form.options.map((optionId) => (
                    <div key={optionId} style={{ display: 'flex', marginBottom: '5px' }}>
                      <div style={{ flex: 1 }}>
                        <Input placeholder="Option content" style={{ fontFamily: 'Comic Sans MS' }} />
                      </div>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => removeOption(form.id, optionId)}
                      />
                      <Radio
                          style = {{marginTop: '5px'}}
                          checked={form.correctOptionId.toString() === optionId.toString()}
                          onChange={() => handleOptionSelection(form.id, optionId)}
                      />
                      {form.correctOptionId === optionId.toString() && (
                          <Tag color="green" >Correct</Tag>
                      )}
                      {form.correctOptionId !== optionId.toString() && (
                          <Tag color="red" >Incorrect</Tag>
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
                  {form.options.map((optionId) => (
                    <div key={optionId} style={{ display: 'flex', marginBottom: '5px' }}>
                      <div style={{ flex: 1 }}>
                        <Input placeholder="Option content" style={{ fontFamily: 'Comic Sans MS' }} />
                      </div>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        style={{ flexShrink: 0 }}
                        onClick={() => removeOption(form.id, optionId)}
                      />
                      <Checkbox
                        style = {{marginTop: '5px'}}
                        checked={form.correctOptionId.toString().includes(optionId.toString())}
                        onChange={() => handleOptionSelection(form.id, optionId)}
                      />
                      {(form.correctOptionId && form.correctOptionId.toString().includes(optionId.toString())) ? (
                      <Tag color="green" style = {{marginLeft: '10px'}}>Correct</Tag>
                  ) : (
                      <Tag color="red" style = {{marginLeft: '10px'}}>Incorrect</Tag>
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
        )}
          <Form.Item style={{display: 'flex', justifyContent: 'center',marginTop: '40px'}}>
            <Button icon={<PlusCircleOutlined />} onClick={addForm} style={{ color: '#0085FC' }}>Questions</Button>
          </Form.Item>
          <Form.Item style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>
            <Button type="primary" onClick={handleSubmit} style={{ fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }}>
              Submit
            </Button>
            <Button style={{ marginLeft: '30px', fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }} onClick={handleCancel}>
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

export default Quiz;
