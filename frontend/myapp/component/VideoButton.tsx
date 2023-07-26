import React, { useState, useEffect } from 'react';
import { Layout, Button, message } from 'antd';
import {
  PlayCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { getToken, HOST_SECTION } from '../src/utils/utils'

const VideoButton: React.FC<{ courseId: string; onSingleVideoSectionChange: (sectionData: any) => void; changeFlag: boolean }> = ({ courseId, onSingleVideoSectionChange, changeFlag }) => {
  const [sections, setSections] = useState<any[]>([]);
  const token = getToken();
  const fetchTextSections = async () => {
    try {
      const response = await fetch(`${HOST_SECTION}/videoSections/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const fetchedSections = data.data.sections;
      setSections(fetchedSections);
    } catch (error) {
      message.error(error);
    }
  };
  useEffect(() => {
    fetchTextSections(); // Initially load chapter data
  }, [changeFlag]);

  const handleSectionClick = (sectionId: string) => {
    // Handle menu item click events
    fetch(`${HOST_SECTION}/section/${sectionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      const sectionData = res.data.section;
      onSingleVideoSectionChange(sectionData);
    })
    .catch(error => {
      message.error(error.message);
    });
  };

  const handleDeleteClick = (sectionId: string) => {
    fetch(`${HOST_SECTION}/section/${sectionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      fetchTextSections();
    })
    .catch(error => {
      message.error(error.message);
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
      {(sections||[]).map((section) => (
        <>
        <div key={`vid_${section.sectionId}`}>
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
              <PlayCircleOutlined style={{ color: 'orange', margin: '0' }} />
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
        </div>
        </>
      ))}
    </Layout>
  );
};

export default VideoButton;