import React, { useState, useEffect } from 'react';
import { Layout, Button,message  } from 'antd';
import './StaffDashboardContent.less';
import {getToken} from '../utils/utils'
import {
  FileTextOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const QuizButton: React.FC<{ courseId: string; onSingleQuizSectionChange: (sectionData: any) => void; changeFlag: boolean }> = ({ courseId, onSingleQuizSectionChange, changeFlag }) => {
  const [sections, setSections] = useState<any[]>([]);
  const token = getToken();
  const fetchTextSections = async () => {
    try {
      const response = await fetch(`/service-edu/edu-quiz/quiz/course/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const fetchedSections = data.data.quizzes;
      setSections(fetchedSections);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchTextSections(); // 初始加载章节数据
  }, [changeFlag]);

  const handleSectionClick = (quizId: string) => {
    // 处理菜单项点击事件
    console.log('click event:', quizId);
    fetch(`/service-edu/edu-quiz/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res)
      if (res.code !== 20000) {
        message.error(res.message)
        return
      }
      const sectionData = res.data.quiz;
      onSingleQuizSectionChange(sectionData);
    })
    .catch(error => {
      alert(error.message);
    });
  };

  const handleDeleteClick = (quizId: string) => {
    // 处理删除图标点击事件
    console.log('click delete:', quizId);
    fetch(`/service-edu/edu-quiz/quiz/${quizId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res)
      if (res.code !== 20000) {
        message.error(res.message)
        return
      }
      fetchTextSections();
    })
    .catch(error => {
      alert(error.message);
    });
  };

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (quizId: string) => {
    setActiveButton(quizId);
    handleSectionClick(quizId);
  };
  const handleButtonMouseEnter = (quizId: string) => {
    if (activeButton !== quizId) {
      setActiveButton(quizId);
    }
  };
  const handleButtonMouseLeave = () => {
    setActiveButton(null);
  };
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      {(sections||[]).map((section) => (
        <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
          <Button
            key={section.quizId}
            onClick={() => handleButtonClick(section.quizId)}
            onMouseEnter={() => handleButtonMouseEnter(section.quizId)}
            onMouseLeave={handleButtonMouseLeave}
            style={{ 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              width: '130px',
              backgroundColor: activeButton === section.quizId ? '#DAE8FC' : 'transparent',
              color: activeButton === section.quizId ? 'red' : 'black',
              fontFamily: 'Comic Sans MS'
            }}
          >
            <FileTextOutlined style={{ color: 'green', margin: '0' }} />
            {/* {section.title} */}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
              {section.title.length > 12 ? section.title.substring(0, 7) + '...' : section.title}
            </span>
            <span style={{ flex: '1' }}></span>
          </Button>
          <DeleteOutlined 
            style={{ color: 'red', cursor: 'pointer', width: '30px' }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(section.quizId);
            }} 
          />
        </div>
        </>
      ))}
    </Layout>
  );
};

export default QuizButton;