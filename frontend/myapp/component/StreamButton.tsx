import React, { useState, useEffect } from 'react';
import { Layout, Button, message } from 'antd';
import {
  LinkOutlined,
  VideoCameraOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { getToken, HOST_STREAM } from '../src/utils/utils'

const StreamButton: React.FC<{ courseId: string; onSingleStreamChange: (StreamData: any) => void; onSingleStreamLinkChange: (StreamData: any, courseId: string) => void; changeFlag: boolean }> = ({ courseId, onSingleStreamChange, onSingleStreamLinkChange, changeFlag }) => {
  const [streams, setStreams] = useState<any[]>([]);
  const token = getToken();

  const fetchStreamSections = async () => {
    try {
      const response = await fetch(`${HOST_STREAM}/streams/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const fetchedSections = data.data.streams;
      setStreams(fetchedSections);
    } catch (error) {
      message.error(error);
    }
  };
  useEffect(() => {
    fetchStreamSections(); // Initially load chapter data
  }, [changeFlag]);

  const handleDeleteClick = (streamId: string) => {
    // Handle delete icon click event
    fetch(`${HOST_STREAM}/stream/${streamId}`, {
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
      fetchStreamSections();
    })
    .catch(error => {
      message.error(error.message);
    });
  };

  const handleSectionClick = (streamId: string) => {
    // Handle menu item click events
    fetch(`${HOST_STREAM}/stream/${streamId}`, {
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
      const streamData = res.data.stream;
      onSingleStreamChange(streamData);
    })
    .catch(error => {
      message.error(error.message);
    });
  };

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (streamId: string) => {
    setActiveButton(streamId);
    handleSectionClick(streamId);
  };
  const handleButtonMouseEnter = (streamId: string) => {
    if (activeButton !== streamId) {
      setActiveButton(streamId);
    }
  };
  const handleButtonMouseLeave = () => {
    setActiveButton(null);
  };

  const [activeLinkButton, setActiveLinkButton] = useState<string | null>(null);

  const handleLinkButtonClick = (streamId: string) => {
    setActiveLinkButton(streamId);
    fetch(`${HOST_STREAM}/stream/${streamId}`, {
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
      const streamData = res.data.stream;
      onSingleStreamLinkChange(streamData, courseId);
    })
    .catch(error => {
      message.error(error.message);
    });
  };
  const handleLinkButtonMouseEnter = (streamId: string) => {
    if (activeLinkButton !== streamId) {
      setActiveLinkButton(streamId);
    }
  };
  const handleLinkButtonMouseLeave = () => {
    setActiveLinkButton(null);
  };
  
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      {(streams||[]).map((stream) => (
        <>
        <div key={`strid_${stream.streamId}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
            <Button
              key={stream.streamId}
              onClick={() => handleButtonClick(stream.streamId)}
              onMouseEnter={() => handleButtonMouseEnter(stream.streamId)}
              onMouseLeave={handleButtonMouseLeave}
              style={{ 
                border: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                width: '130px',
                backgroundColor: activeButton === stream.streamId ? '#DAE8FC' : 'transparent',
                color: activeButton === stream.streamId ? 'red' : 'black',
                fontFamily: 'Comic Sans MS'
              }}
            >
              <VideoCameraOutlined style={{ color: 'blue', margin: '0' }} />
              {/* {assignment.title} */}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                {stream.title.length > 12 ? stream.title.substring(0, 7) + '...' : stream.title}
              </span>
              <span style={{ flex: '1' }}></span>
            </Button>
            <DeleteOutlined 
              style={{ color: 'red', cursor: 'pointer', width: '30px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(stream.streamId);
              }} 
            />
          </div>
          <Button
            key={stream.streamId+stream.streamId}
            onClick={() => handleLinkButtonClick(stream.streamId)}
            onMouseEnter={() => handleLinkButtonMouseEnter(stream.streamId)}
            onMouseLeave={handleLinkButtonMouseLeave}
            style={{ 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              width: '130px',
              backgroundColor: activeLinkButton === stream.streamId ? '#DAE8FC' : 'transparent',
              color: activeLinkButton === stream.streamId ? 'red' : 'black',
              fontFamily: 'Comic Sans MS'
            }}
          >
            <LinkOutlined style={{ color: 'blue', marginLeft: '20px' }} />
            {/* {assignment.title} */}
            <span>
              -- Link --
            </span>
            <span style={{ flex: '1' }}></span>
          </Button>
        </div>
        </>
      ))}
    </Layout>
  );
};

export default StreamButton;