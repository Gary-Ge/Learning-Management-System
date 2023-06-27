import React, { useState, useEffect } from 'react';
import { Layout, Button } from 'antd';
import './StaffDashboardContent.less';
import {
  FileTextOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const TextButton: React.FC<{ courseId: string; onSingleSectionChange: (sectionData: any) => void }> = ({ courseId, onSingleSectionChange }) => {
  const [sections, setSections] = useState<any[]>([]);

  const fetchTextSections = async () => {
    try {
      const response = await fetch(`http://175.45.180.201:10900/service-edu/edu-section/textSections/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc1MTg2MDksImV4cCI6MTY5MDExMDYwOSwiaWQiOiIwZTVjM2UwMTRjNDA1NDhkMzNjY2E0ZWQ3YjlhOWUwNCJ9.ngA7l15oOI-LyXB_Ps5kMzW_nzJDFYDOI4FmKcYIxO4`,
        },
      });

      const data = await response.json();
      const fetchedSections = data.data.sections;
      setSections(fetchedSections);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchTextSections(); // 初始加载章节数据
    // 设置轮询定时器，每隔一段时间更新章节数据
    const interval = setInterval(fetchTextSections, 5000); // 5000毫秒为轮询间隔，可根据需要调整
    // 在组件卸载时清除定时器
    return () => {
      clearInterval(interval);
    };
  }, [courseId]);

  const handleSectionClick = (sectionId: string) => {
    // 处理菜单项点击事件
    // console.log('click event:', sectionId);
    fetch(`http://175.45.180.201:10900/service-edu/edu-section/section/${sectionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc1MTg2MDksImV4cCI6MTY5MDExMDYwOSwiaWQiOiIwZTVjM2UwMTRjNDA1NDhkMzNjY2E0ZWQ3YjlhOWUwNCJ9.ngA7l15oOI-LyXB_Ps5kMzW_nzJDFYDOI4FmKcYIxO4`,
      },
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res)
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      const sectionData = res.data.section;
      onSingleSectionChange(sectionData);
    })
    .catch(error => {
      alert(error.message);
    });
  };

  const handleDeleteClick = (sectionId: string) => {
    // 处理删除图标点击事件
    // console.log('click delete:', sectionId);
    fetch(`http://175.45.180.201:10900/service-edu/edu-section/section/${sectionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc1MTg2MDksImV4cCI6MTY5MDExMDYwOSwiaWQiOiIwZTVjM2UwMTRjNDA1NDhkMzNjY2E0ZWQ3YjlhOWUwNCJ9.ngA7l15oOI-LyXB_Ps5kMzW_nzJDFYDOI4FmKcYIxO4`,
      },
    })
    .then(res => res.json())
    .then(res => {
      // console.log('res', res)
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
    })
    .catch(error => {
      alert(error.message);
    });
  };

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (sectionId: string) => {
    setActiveButton(sectionId);
    handleSectionClick(sectionId);
  };
  const handleButtonMouseEnter = (sectionId: string) => {
    if (activeButton !== sectionId) {
      setActiveButton(sectionId);
    }
  };
  const handleButtonMouseLeave = () => {
    setActiveButton(null);
  };
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      {sections.map((section) => (
        <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
          <Button
            key={section.sectionId}
            onClick={() => handleButtonClick(section.sectionId)}
            onMouseEnter={() => handleButtonMouseEnter(section.sectionId)}
            onMouseLeave={handleButtonMouseLeave}
            style={{ 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              width: '130px',
              backgroundColor: activeButton === section.sectionId ? '#DAE8FC' : 'transparent',
              color: activeButton === section.sectionId ? 'red' : 'black',
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
              handleDeleteClick(section.sectionId);
            }} 
          />
        </div>
        </>
      ))}
    </Layout>
  );
};

export default TextButton;