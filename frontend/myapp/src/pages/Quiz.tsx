import React, { useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, DatePicker, TimePicker, Select, Radio, Tag, Checkbox,message } from 'antd';
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
import { validNotNull } from '../utils/utilsStaff';
import { QuizDTO } from '../utils/entities';
import {  getToken } from '../utils/utils';
import { useEffect } from 'react';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;


const Quiz: React.FC<{ onCancel: () => void; onSubmit: () => void; courseId: string }> = ({ onCancel, onSubmit, courseId }) => {
  const [totalMarks, setTotalMarks] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [forms, setForms] = useState<{ id: number; options: {id: number, value: string, isCorrect: boolean}[]; selectedOption: string; correctOptionId: string; mark?: number | undefined;questionId:string }[]>([]);
  const [showTotalMark, setShowTotalMark] = useState(true);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [limitation, setLimitation] = useState("");
  const [quizId, setQuizId] = useState("");
  const [questionId, setQuestionId] = useState("");
  const token = getToken()
  const [quizCreated, setQuizCreated] = useState(false);
  const [optionCounter, setOptionCounter] = useState(0);

  const handleQuizTitleChange = (e:any) => {
    setTitle(e.target.value);
  };
  const handleLimitationChange = (e:any) => {
    setLimitation(e.target.value);
  };
  const handleQuizStartChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setStart(formattedDate);
    }
  };
  const handleQuizEndChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
      setEnd(formattedDate);
    }
  };
  const [questionTitle, setQuestionTitle] = useState("");
  const handlequestionTitleChange = (e:any) => {
    setQuestionTitle(e.target.value);
  };
  type QuestionType = "sc" | "mc" | "st";

  const typeMapping: Record<QuestionType, number> = {
    sc: 0,
    mc: 1,
    st: 2,
  };

  const [questiontype, setType] = useState(0);
  const handlequestionTypeChange = (value: QuestionType) => {
    setType(typeMapping[value]);
  };
  const [mark, setMark] = useState('');
    const MarkChange = (e:any) => {
      setMark(e.target.value);
    };
  const [cover, setImageUrl] = useState("");
  const handleImageUpload = (url: any) => {
      setImageUrl(url);
  };
  const [shortAnswer, setshortAnswer] = useState("");
  const handlesetshortAnswerChange = (e: any) => {
    setshortAnswer(e.target.value);
  };
  const handleInputChange = (formId:any, optionId:any, event:any) => {
    const newForms = forms.map(form => {
        if(form.id === formId) {
            const newOptions = form.options.map(option => {
                if(option.id === optionId) {
                    return {...option, value: event.target.value};
                } else {
                    return option;
                }
            });
            return {...form, options: newOptions};
        } else {
            return form;
        }
    });
    setForms(newForms);
}
const handleOptionSCSelection = (formId:any, optionId:any) => {
  const newForms = forms.map(form => {
      if (form.id === formId) {
          const newOptions = form.options.map(option => {
              if (option.id === optionId) {
                  return {...option, isCorrect: true};
              } else {
                  return {...option, isCorrect: false};
              }
          });
          return {...form, options: newOptions, correctOptionId: optionId};
      } else {
          return form;
      }
  });
  setForms(newForms);
  const updatedFormsWithCorrectTag = newForms.map(form => {
      if (form.id === formId) {
          return {
              ...form,
              options: form.options.map(option => {
                  if (option.id === optionId) {
                      return {...option, isCorrect: true};
                  } else {
                      return {...option, isCorrect: false};
                  }
              })
          };
      } else {
          return form;
      }
  });
  setForms(updatedFormsWithCorrectTag);
}
const handleOptionMCSelection = (formId: any, optionId: any) => {
  const newForms = forms.map((form) => {
    if (form.id === formId) {
      const newOptions = form.options.map((option) => {
        if (option.id === optionId) {
          return { ...option, isCorrect: !option.isCorrect };
        } else {
          return option;
        }
      });
      return { ...form, options: newOptions };
    } else {
      return form;
    }
  });
  setForms(newForms);
};
const createNewQuiz = () => {
  if (!validNotNull(title)) {
    alert('Please input a valid quiz title')
    return
  }
  if (!validNotNull(limitation)) {
    alert('Please input a valid quiz li')
    return
  }
  if (!validNotNull(start)) {
    alert('Please input a valid quiz start')
    return
  }
  if (!validNotNull(end) || (new Date(end)< new Date(start))) {
    alert('Please input a valid quiz end')
    return
  }
  console.log(token)
  console.log(courseId)
  const dto = new QuizDTO(title, start,end,limitation);
  console.log(dto)
  fetch(`/service-edu/edu-quiz/quiz/${courseId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(dto)
  })
  .then(res => res.json())
  .then(res => {
    if (res.code !== 20000) {
      throw new Error(res.message)
    }
    setQuizId(res.data.quizId)
    message.success('Create quiz successfully!')
    setQuizCreated(true);
  })
  .catch(error => {
    console.log(error)
    message.error(error.message)
    setQuizCreated(false);
  })
}
const createQuiz = () => {
  if (!validNotNull(title)) {
    alert('Please input a valid quiz title')
    return
  }
  if (!validNotNull(limitation)) {
    alert('Please input a valid quiz li')
    return
  }
  if (!validNotNull(start)) {
    alert('Please input a valid quiz start')
    return
  }
  if (!validNotNull(end) || (new Date(end)< new Date(start))) {
    alert('Please input a valid quiz end')
    return
  }
  console.log(token)
  console.log(courseId)
  const dto = new QuizDTO(title, start,end,limitation);
  console.log(dto)
  fetch(`/service-edu/edu-quiz/quiz/${courseId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(dto)
  })
  .then(res => res.json())
  .then(res => {
    if (res.code !== 20000) {
      throw new Error(res.message)
    }
    setQuizId(res.data.quizId)
    message.success('Create quiz successfully!')
    setQuizCreated(true);
    const newFormId = Date.now(); // Generate a unique ID for the new form
    const newOptionId1 = Date.now(); // Generate a unique ID for the first new option
    const newOptionId2 = newOptionId1 + 1; // Generate a unique ID for the second new option
    setForms([...forms, { id: newFormId, options: [{ id: newOptionId1, value: '', isCorrect: false }, { id: newOptionId2, value: '', isCorrect: false }], selectedOption: 'sc', correctOptionId: '', mark: 0,questionId: '' }]);
  })
  .catch(error => {
    console.log(error)
    message.error(error.message)
    setQuizCreated(false);
  })
}
  
  const addForm = () => {
      const formData = {
        options: [] as { value: string; isCorrect: boolean }[],
    };
    const optionsData: { value: string; isCorrect: boolean }[] = [];
    const currentForm = forms[forms.length-1]; // 获取最后一个添加的问题
    if (currentForm && currentForm.options) {
    currentForm.options.forEach((option) => {
      optionsData.push({
        value: option.value,
        isCorrect: option.isCorrect,
      });
    });
    formData.options = optionsData;
    const dto_question = {
      cover: cover,
      content: questionTitle,
      type: questiontype,
      mark: mark,
      a: currentForm.options[0]?.value || '',
      b: currentForm.options[1]?.value || '',
      c: currentForm.options[2]?.value || '',
      d: currentForm.options[3]?.value || '',
      e: currentForm.options[4]?.value || '',
      f: currentForm.options[5]?.value || '',
      shortAnswer: shortAnswer,
      acorrect: currentForm.options[0]?.isCorrect ? 1 : 0,
      bcorrect: currentForm.options[1]?.isCorrect ? 1 : 0,
      ccorrect: currentForm.options[2]?.isCorrect ? 1 : 0,
      dcorrect: currentForm.options[3]?.isCorrect ? 1 : 0,
      ecorrect: currentForm.options[4]?.isCorrect ? 1 : 0,
      fcorrect: currentForm.options[5]?.isCorrect ? 1 : 0,
    };
    console.log(dto_question)
    fetch(`/service-edu/edu-question/question/${courseId}/${quizId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(dto_question)
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      setForms(forms => {
        const newForms = [...forms];
        newForms[newForms.length - 1].questionId = res.data.questionId;
        return newForms;
      });
      message.success('Create question successfully!')
      const newFormId = Date.now(); // Generate a unique ID for the new form
    const newOptionId1 = Date.now(); // Generate a unique ID for the first new option
    const newOptionId2 = newOptionId1 + 1; // Generate a unique ID for the second new option
    setForms([...forms, { id: newFormId, options: [{ id: newOptionId1, value: '', isCorrect: false }, { id: newOptionId2, value: '', isCorrect: false }], selectedOption: 'sc', correctOptionId: '', mark: 0,questionId: '' }]);
    })
    .catch(error => {
      message.error(error.message)
    })
    }
};
const removeForm = (formId: number) => {
  console.log(formId)
  const formToRemove = forms.find((form) => form.id === formId);
  if (formToRemove && formToRemove.questionId) {
    console.log(formToRemove.questionId)
    fetch(`/service-edu/edu-question/question/${formToRemove.questionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      // Continue to remove the form from the state if API call is successful
      const updatedForms = forms.filter((form) => form.id !== formId);
      setForms(updatedForms);
      if (formToRemove.mark) {
        const totalMarks = updatedForms.reduce((total, form) => (form.mark ? total + form.mark : total), 0);
        setTotalMarks(totalMarks);
      }
      message.success('Delete question successfully!')

      // Check if updatedForms is empty, if it is, set showTotalMark to false
      setShowTotalMark(updatedForms.length > 0);
    })
    .catch(error => {
      message.error(error.message)
      console.log('1')
    })
  } else {
    message.error('The question does not exist or questionId is not available')
  }
}

const addOption = (formId: any) => {
  const updatedForms = forms.map((form) => {
    if (form.id === formId) {
      if (form.options.length < 6) {
        const newOptionId = Date.now(); // Generate a unique ID for the new option
        const updatedOptions = [
          ...form.options,
          { id: newOptionId, value: '', isCorrect: false },
        ];
        return { ...form, options: updatedOptions };
      } else {
        message.error("you can only add no more than 6 options");
      }
    }
    return form;
  });
  setForms(updatedForms);
};



const removeOption = (formId: any, optionId: any) => {
  const updatedForms = forms.map((form) => {
    if (form.id === formId) {
      const updatedOptions = form.options.filter((option) => option.id !== optionId);
      return { ...form, options: updatedOptions };
    }
    return form;
  });
  setForms(updatedForms);
};

const handleButtonClick = () => {
  if (quizCreated) {
    addForm();
  } else {
    createQuiz();
  }
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
    if (!quizCreated) {
      // 创建测验并等待quizCreated状态更新为true
      createNewQuiz();
      onSubmit();
    } else {
    const formData = {
      options: [] as { value: string; isCorrect: boolean }[],
  };
  const optionsData: { value: string; isCorrect: boolean }[] = [];
  const currentForm = forms[forms.length-1]; // 获取最后一个添加的问题
  if (currentForm && currentForm.options) {
  currentForm.options.forEach((option) => {
    optionsData.push({
      value: option.value,
      isCorrect: option.isCorrect,
    });
  });
  formData.options = optionsData;
  const dto_question = {
    cover: cover,
    content: questionTitle,
    type: questiontype,
    mark: mark,
    a: currentForm.options[0]?.value || '',
    b: currentForm.options[1]?.value || '',
    c: currentForm.options[2]?.value || '',
    d: currentForm.options[3]?.value || '',
    e: currentForm.options[4]?.value || '',
    f: currentForm.options[5]?.value || '',
    shortAnswer: shortAnswer,
    acorrect: currentForm.options[0]?.isCorrect ? 1 : 0,
    bcorrect: currentForm.options[1]?.isCorrect ? 1 : 0,
    ccorrect: currentForm.options[2]?.isCorrect ? 1 : 0,
    dcorrect: currentForm.options[3]?.isCorrect ? 1 : 0,
    ecorrect: currentForm.options[4]?.isCorrect ? 1 : 0,
    fcorrect: currentForm.options[5]?.isCorrect ? 1 : 0,
  };
  console.log(dto_question)
  fetch(`/service-edu/edu-question/question/${courseId}/${quizId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(dto_question)
  })
  .then(res => res.json())
  .then(res => {
    if (res.code !== 20000) {
      throw new Error(res.message)
    }
    message.success('Create question successfully!')
    onSubmit();
  })
  .catch(error => {
    message.error(error.message)
  })
  }
  }
  };
  useEffect(() => {
    if (quizId) {
      console.log(quizId);
    }
  }, [quizId]);
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
                onChange={handleLimitationChange}
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
            <DatePicker style={{ fontFamily: 'Comic Sans MS', color: 'black',width: '100%' }} placeholder="Select Start Date and Time" showTime onOk={handleQuizStartChange} />
          </Form.Item>
          <Form.Item
            label={
              <Text style={{ fontFamily: 'Comic Sans MS', color: 'black' }}>
                End Date and Time
              </Text>
            }
            name="endDateTime"
          >
            <DatePicker style={{ fontFamily: 'Comic Sans MS', color: 'black',width: '100%' }} placeholder="Select Start Date and Time" showTime  onOk={handleQuizEndChange} />
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
                      onChange={handlequestionTitleChange}
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
                      handlequestionTypeChange(value);
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
                  <Input type="number" placeholder="Input Number" style={{ marginLeft: '5px', fontFamily: 'Comic Sans MS',width:'98%' }} onChange={(e) => {MarkChange(e);handleMarkChange(form.id, e.target.value)}} />
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
                    onChange={handlesetshortAnswerChange}
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
          <Button onClick={handleButtonClick} icon={<PlusCircleOutlined />} style={{ color: '#0085FC' }}>Questions</Button>
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
