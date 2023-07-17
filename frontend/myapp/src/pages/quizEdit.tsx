import React, { useEffect, useState } from 'react';
import { Layout, theme, Typography, Button, Form, Input, DatePicker, TimePicker, message,Select,Radio, Tag, Checkbox  } from 'antd';
import './StaffDashboardContent.less';
import './TextLesson.css';
import {
  HeartFilled,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getToken} from '../utils/utils'
import { validNotNull } from '../utils/utilsStaff';
import { QuizDTO } from '../utils/entities';
import Quiz from './Quiz';
import UploadImageButton from './UploadImageButton';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const QuizEdit: React.FC<{ onCancel: () => void; onSubmit: () => void; quiz: any }> = ({ onCancel, onSubmit, quiz }) => {
  const token = getToken();
  const [totalMarks, setTotalMarks] = useState(0);
  const [showTotalMark, setShowTotalMark] = useState(true);
  const [sectionInfor, setSectionInfor] = useState(quiz || {});
  const [forms, setForms] = useState<{ 
    id: number; 
    options: {id: number, value: string, isCorrect: boolean}[]; 
    selectedOption: string; 
    correctOptionId: string; 
    mark: number,
    questionId:string,
    cover:string,
    questionTitle:string,
    questiontype:number,
    shortAnswer:string,
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
  const handleImageUpload = (url: any, formId: number) => {
    setForms(forms => {
      const newForms = [...forms];
      const formIndex = newForms.findIndex(form => form.id === formId);
  
      if (formIndex !== -1) {
        newForms[formIndex].cover = url;
      }
  
      return newForms;
    });
  };
  const handleQuestionTitleChange = (e: any, formId: number) => {
    setForms(forms => {
      const newForms = [...forms];
      const formIndex = newForms.findIndex(form => form.id === formId);
      
      if (formIndex !== -1) {
        newForms[formIndex].questionTitle = e.target.value;
      }
      
      return newForms;
    });
  };
  type QuestionType = "sc" | "mc" | "st";

  const typeMapping: Record<QuestionType, number> = {
    sc: 0,
    mc: 1,
    st: 2,
  };
  const handleQuestionTypeChange = (value: QuestionType, formId: number) => {
    setForms((forms) => {
      const newForms = [...forms];
      const formIndex = newForms.findIndex((form) => form.id === formId);
  
      if (formIndex !== -1) {
        newForms[formIndex].questiontype = typeMapping[value];
  
        // Reset all options and correct answer for the current form
        newForms[formIndex].options.forEach((option) => {
          option.isCorrect = false;
        });
  
        // Set the first option as correct for single choice
        newForms[formIndex].options[0].isCorrect = true;
        newForms[formIndex].correctOptionId = newForms[formIndex].options[0].id.toString();
      }
  
      return newForms;
    });
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
const handleMark = (e: any, formId: number) => {
  const newMark = e.target.value;

  setForms(forms => {
    const newForms = [...forms];
    const formIndex = newForms.findIndex(form => form.id === formId);

    if (formIndex !== -1) {
      newForms[formIndex].mark = newMark;
    }

    return newForms;
  });
};
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
const handleShortAnswerChange = (e: any, formId: number) => {
  setForms(forms => {
    const newForms = [...forms];
    const formIndex = newForms.findIndex(form => form.id === formId);
    
    if (formIndex !== -1) {
      newForms[formIndex].shortAnswer = e.target.value;
    }

    return newForms;
  });
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

function transformQuestionData(question:any, index:number) {
  let options = [
    { id: 'a', value: question.a, isCorrect: question.aCorrect === 1 },
    { id: 'b', value: question.b, isCorrect: question.bCorrect === 1 },
    { id: 'c', value: question.c, isCorrect: question.cCorrect === 1 },
    { id: 'd', value: question.d, isCorrect: question.dCorrect === 1 },
    { id: 'e', value: question.e, isCorrect: question.eCorrect === 1 },
    { id: 'f', value: question.f, isCorrect: question.fCorrect === 1 },
  ];
  options = options.filter(option => option.value !== "");
  
  const correctOption = options.find(option => option.isCorrect);
  
  return {
    id: question.questionId,
    options: options,
    selectedOption: '',
    correctOptionId: correctOption ? correctOption.id : '',
    mark: question.mark,
    questionId: question.questionId,
    cover: question.cover,
    questionTitle: question.content,
    questiontype: question.type,
    shortAnswer: question.shortAnswer || '',
    index: index,
  };
}

const handleButtonClick = () => {
  const newForm = {
    id: forms.length + 1, // 生成一个新的唯一ID
    options: [
      { id: 1, value: '', isCorrect: false },
      { id: 2, value: '', isCorrect: false },
    ],
    selectedOption: '',
    correctOptionId: '',
    mark: 0,
    questionId: '',
    cover: '',
    questionTitle: '',
    questiontype: 0,
    shortAnswer: '',
  };

  setForms(forms => [...forms, newForm]);
};


const removeForm = (formId: number) => {
  // Check if forms array is defined
  if (!forms) {
    console.error('Forms is undefined');
    return;
  }

  const formToRemove = forms.find((form) => form.id === formId);

  // Check if formToRemove is defined
  if (!formToRemove) {
    console.error(`Form with id ${formId} not found.`);
    return;
  }

  if (formToRemove.questionId) {
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
      if (formToRemove && formToRemove.mark) {
        const totalMarks = updatedForms.reduce((total, form) => (form && form.mark ? total + form.mark : total), 0);
        setTotalMarks(totalMarks);
      }
      message.success('Delete question successfully!')

      // Check if updatedForms is empty, if it is, set showTotalMark to false
      setShowTotalMark(updatedForms.length > 0);
    })
    .catch(error => {
      console.log("delete question",error)
    })
  } else{
    const updatedForms = forms.filter((form) => form.id !== formId);
    setForms(updatedForms);
    if (formToRemove && formToRemove.mark) {
      const totalMarks = updatedForms.reduce((total, form) => (form && form.mark ? total + form.mark : total), 0);
      setTotalMarks(totalMarks);
    }
  }
}
  const handleCancel = () => {
    onCancel(); // Call the onCancel function received from props
  };
  
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(forms)
    setTitle(quiz.title);
    setStart(quiz.start);
    setEnd(quiz.end);
    setLimitation(quiz.limitation);
    setSectionInfor(quiz);
    
    const formValues = forms.map((form) => ({
      [`Cover ${form.id}`]: form.cover,
      [`Mark ${form.id}`]: form.mark,
      [`Question Type ${form.id}`]: form.questiontype,
      [`Question Title ${form.id}`]: form.questionTitle,
      [`Shortanswer ${form.id}`]: form.shortAnswer,
    }));

    form.setFieldsValue({
      "Title": quiz.title,
      "quiz attempt time": quiz.limitation,
      ...Object.assign({}, ...formValues),
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
        const newFormsData = res.data.questions.map(transformQuestionData);
        setForms(newFormsData);
        const total = newFormsData.reduce((sum:any, form:any) => sum + (form.mark || 0), 0);
        setTotalMarks(total);
        //console.log(res.data.questions)
      }
    })
    .catch(error => {
      console.log(error);
    });
}, [quiz]);



  const handleSubmit = () => {
    // 处理提交逻辑
    for (const form of forms) {
    const requestData = {
      cover: form.cover,
      content: form.questionTitle,
      type: form.questiontype,
      mark: form.mark,
      a: form.options[0]?.value || '',
      b: form.options[1]?.value || '',
      c: form.options[2]?.value || '',
      d: form.options[3]?.value || '',
      e: form.options[4]?.value || '',
      f: form.options[5]?.value || '',
      shortAnswer: form.shortAnswer,
      acorrect: form.options[0]?.isCorrect ? 1 : 0,
      bcorrect: form.options[1]?.isCorrect ? 1 : 0,
      ccorrect: form.options[2]?.isCorrect ? 1 : 0,
      dcorrect: form.options[3]?.isCorrect ? 1 : 0,
      ecorrect: form.options[4]?.isCorrect ? 1 : 0,
      fcorrect: form.options[5]?.isCorrect ? 1 : 0,
    }
    if (form.questionId){
      fetch(`/service-edu/edu-question/question/${form.questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestData)
      })
      .then(res => res.json())
      .then(res => {
        if (res.code !== 20000) {
          throw new Error(res.message)
        }
      })
      .catch(error => {
        console.log("update",error)
      })
    }else {
      console.log(quiz.courseId)
      fetch(`/service-edu/edu-question/question/${quiz.courseId}/${quiz.quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestData)
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
      })
      .catch(error => {
        console.log("create last question",error)
      })
    }
  }
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
      console.log(error);
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
        <Title level={4} style={{ color: 'black', textAlign: 'center', fontFamily: 'Comic Sans MS', padding: 10, fontWeight: 'bold', }}>Edit Quiz</Title>
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
          {forms.map((form:any) => (
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
                    <UploadImageButton onImageUpload={(url) => handleImageUpload(url, form.id)} url={form.cover}/>
                  </div>
                </div>
                <div style={{ flex: 2,marginLeft: '10px' }}>
                  <Form.Item
                    label={<Text style={{ fontFamily: 'Comic Sans MS' }}>Question Title</Text>}
                    name={`Question Title ${form.id}`}
                    style={{ margin: '5px' }}
                  />
                  <Form.Item>
                    <Input
                      placeholder="Enter your question"
                      value={form.questionTitle}
                      onChange={(e) => handleQuestionTitleChange(e,form.id)}
                      style={{ fontFamily: 'Comic Sans MS' }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: '5px' }}>
                  <div style={{ flex: 2, marginRight: '10px' }}>
                    <Text style={{ fontFamily: 'Comic Sans MS', marginBottom: '5px' }}>Question Type</Text>
                    <Select
                      placeholder="Select Option"
                      style={{ width: '100%', fontFamily: 'Comic Sans MS' }}
                      onChange={(value) => {
                        handleQuestionTypeChange(value, form.id);
                        const updatedForms = forms.map((f) => {
                          if (f.id === form.id) {
                            return { ...f, questiontype: value };
                          }
                          return f;
                        });
                        setForms(updatedForms);
                      }}
                      value={form.questiontype} 
                    >
                      <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value={0}>Single Choice</Select.Option>
                      <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value={1}>Multi Choice</Select.Option>
                      <Select.Option style={{ fontFamily: 'Comic Sans MS', color: 'black' }} value={2}>Single Text</Select.Option>
                    </Select>
                  </div>
                <div style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Comic Sans MS', marginLeft: '10px' }}>Mark</Text>
                <Form.Item
                  style={{ flex: 1 }}
                  name={`Mark ${form.id}`}
                  initialValue={form.mark}
                >
                  <Input
                    type="number"
                    placeholder="Input Number"
                    style={{ marginLeft: '5px', fontFamily: 'Comic Sans MS', width: '96%' }}
                    onChange={(e) => {
                      handleMark(e, form.id);
                      handleMarkChange(form.id, e.target.value);
                    }}
                    value={form.mark}
                  />
                </Form.Item>
              </div>
              </div>
              {form.questiontype === 0 && (
                <div>
                  <div>
                    <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
                  </div>
                  {form.options&&form.options.map((option:any) => (
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
              {form.questiontype === 1 && (
                <div>
                  <div>
                    <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
                  </div>
                  {form.options&&form.options.map((option:any) => (
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
              {form.questiontype === 2 && (
                <div>
                  <Text style={{ fontFamily: 'Comic Sans MS' }}>Answers</Text>
                  <Input.TextArea
                    placeholder="you can input many words here ..."
                    style={{ fontFamily: 'Comic Sans MS' }}
                    onChange={(e) => handleShortAnswerChange(e, form.id)}
                    value={form.shortAnswer}
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
