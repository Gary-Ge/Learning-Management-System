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
  const [showTotalMark, setShowTotalMark] = useState(true);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [limitation, setLimitation] = useState("");
  const [quizId, setQuizId] = useState("");
  const token = getToken()
  const [quizCreated, setQuizCreated] = useState(false);

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
    setForms(forms => {
      const newForms = [...forms];
      const formIndex = newForms.findIndex(form => form.id === formId);
      
      if (formIndex !== -1) {
        newForms[formIndex].questiontype = typeMapping[value];
      }
  
      return newForms;
    });
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
    setQuizCreated(true);
  })
  .catch(error => {
    console.log("create new quiz",error)
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
    setQuizCreated(true);
    const newFormId = Date.now(); // Generate a unique ID for the new form
    const newOptionId1 = Date.now(); // Generate a unique ID for the first new option
    const newOptionId2 = newOptionId1 + 1; // Generate a unique ID for the second new option
    setForms([...forms, { id: newFormId, options: [{ id: newOptionId1, value: '', isCorrect: false }, { id: newOptionId2, value: '', isCorrect: false }], selectedOption: 'sc', correctOptionId: '', mark: 0,questionId: '',cover:'',
    questionTitle:'',
    questiontype:0,
    shortAnswer:'' }]);
  })
  .catch(error => {
    console.log("create quiz",error)
    setQuizCreated(false);
  })
}
  
  const addForm = () => {
    if (forms.length === 0) {
      // 如果forms数组为空，则创建一个新的表单
      const newFormId = Date.now(); // 为新表单生成一个唯一的ID
      const newOptionId1 = Date.now(); // 为第一个新选项生成一个唯一的ID
      const newOptionId2 = newOptionId1 + 1; // 为第二个新选项生成一个唯一的ID
      setForms([
        {
          id: newFormId,
          options: [
            { id: newOptionId1, value: '', isCorrect: false },
            { id: newOptionId2, value: '', isCorrect: false }
          ],
          selectedOption: 'sc',
          correctOptionId: '',
          mark: 0,
          questionId: '',
          cover: '',
          questionTitle: '',
          questiontype: 0,
          shortAnswer: ''
        }
      ]);
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
      cover: forms[forms.length-1].cover,
      content: forms[forms.length-1].questionTitle,
      type: forms[forms.length-1].questiontype,
      mark: forms[forms.length-1].mark,
      a: currentForm.options[0]?.value || '',
      b: currentForm.options[1]?.value || '',
      c: currentForm.options[2]?.value || '',
      d: currentForm.options[3]?.value || '',
      e: currentForm.options[4]?.value || '',
      f: currentForm.options[5]?.value || '',
      shortAnswer: forms[forms.length-1].shortAnswer,
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
      const newFormId = Date.now(); // Generate a unique ID for the new form
    const newOptionId1 = Date.now(); // Generate a unique ID for the first new option
    const newOptionId2 = newOptionId1 + 1; // Generate a unique ID for the second new option
    setForms([...forms, { id: newFormId, options: [{ id: newOptionId1, value: '', isCorrect: false }, { id: newOptionId2, value: '', isCorrect: false }], selectedOption: 'sc', correctOptionId: '', mark: 0,questionId: '',cover:'',
    questionTitle:'',
    questiontype:0,
    shortAnswer:'' }]);
    })
    .catch(error => {
      console.log("create question",error)
    })
    }
    }
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
        cover: forms[forms.length-1].cover,
        content: forms[forms.length-1].questionTitle,
        type: forms[forms.length-1].questiontype,
        mark: forms[forms.length-1].mark,
        a: currentForm.options[0]?.value || '',
        b: currentForm.options[1]?.value || '',
        c: currentForm.options[2]?.value || '',
        d: currentForm.options[3]?.value || '',
        e: currentForm.options[4]?.value || '',
        f: currentForm.options[5]?.value || '',
        shortAnswer: forms[forms.length-1].shortAnswer,
        acorrect: currentForm.options[0]?.isCorrect ? 1 : 0,
        bcorrect: currentForm.options[1]?.isCorrect ? 1 : 0,
        ccorrect: currentForm.options[2]?.isCorrect ? 1 : 0,
        dcorrect: currentForm.options[3]?.isCorrect ? 1 : 0,
        ecorrect: currentForm.options[4]?.isCorrect ? 1 : 0,
        fcorrect: currentForm.options[5]?.isCorrect ? 1 : 0,
      };
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
      })
      .catch(error => {
        console.log("create last question",error)
      })
    }
    for (const form of forms) {
      const dto_update = {
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
      };
      console.log(form.questionId)
      fetch(`/service-edu/edu-question/question/${form.questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dto_update)
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
    }
    message.success('create quiz successfully')
    onSubmit();
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
