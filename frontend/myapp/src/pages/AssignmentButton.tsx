import React, { useState, useEffect } from 'react';
import { Layout, Button } from 'antd';
import './StaffDashboardContent.less';
import {
  CheckCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import {getToken} from '../utils/utils'

const AssignmentButton: React.FC<{ courseId: string; onSingleAssignmentChange: (assignmentData: any) => void; changeFlag: boolean }> = ({ courseId, onSingleAssignmentChange, changeFlag }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const token = getToken();

  const fetchAssignmentSections = async () => {
    try {
      const response = await fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignments/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const fetchedSections = data.data.assignments;
      setAssignments(fetchedSections);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchAssignmentSections(); // 初始加载章节数据
  }, [changeFlag]);

  const handleDeleteClick = (assignmentId: string) => {
    // 处理删除图标点击事件
    // console.log('click delete:', sectionId);
    fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${assignmentId}`, {
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
        throw new Error(res.message)
      }
      fetchAssignmentSections();
    })
    .catch(error => {
      alert(error.message);
    });
  };

  const handleSectionClick = (assignmentId: string) => {
    // 处理菜单项点击事件
    // console.log('click event:', sectionId);
    fetch(`http://175.45.180.201:10900/service-edu/edu-assignment/assignment/${assignmentId}`, {
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
        throw new Error(res.message)
      }
      const assignmentData = res.data.assignment;
      onSingleAssignmentChange(assignmentData);
    })
    .catch(error => {
      alert(error.message);
    });
  };

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (assignmentId: string) => {
    setActiveButton(assignmentId);
    handleSectionClick(assignmentId);
  };
  const handleButtonMouseEnter = (assignmentId: string) => {
    if (activeButton !== assignmentId) {
      setActiveButton(assignmentId);
    }
  };
  const handleButtonMouseLeave = () => {
    setActiveButton(null);
  };
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      {(assignments||[]).map((assignment) => (
        <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
          <Button
            key={assignment.assignmentId}
            onClick={() => handleButtonClick(assignment.assignmentId)}
            onMouseEnter={() => handleButtonMouseEnter(assignment.assignmentId)}
            onMouseLeave={handleButtonMouseLeave}
            style={{ 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              width: '130px',
              backgroundColor: activeButton === assignment.assignmentId ? '#DAE8FC' : 'transparent',
              color: activeButton === assignment.assignmentId ? 'red' : 'black',
              fontFamily: 'Comic Sans MS'
            }}
          >
            <CheckCircleOutlined style={{ color: 'red', margin: '0' }} />
            {/* {assignment.title} */}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
              {assignment.title.length > 12 ? assignment.title.substring(0, 7) + '...' : assignment.title}
            </span>
            <span style={{ flex: '1' }}></span>
          </Button>
          <DeleteOutlined 
            style={{ color: 'red', cursor: 'pointer', width: '30px' }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(assignment.assignmentId);
            }} 
          />
        </div>
        </>
      ))}
    </Layout>
  );
};

export default AssignmentButton;