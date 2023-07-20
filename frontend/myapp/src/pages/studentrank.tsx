import React, { useState } from 'react';
import { CrownOutlined } from '@ant-design/icons';
import { Modal, List } from 'antd';

export default function StudentRank() {
    const [open, setOpen] = useState(false);
    const data = [
        {
          title: 'All Grades',
        },
        {
          title: 'Quiz',
        },
        {
          title: 'Assignment',
        },
      ];
    return (
        <>
        <div onClick={() => setOpen(true)} style={{ position: 'relative', height: '50px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <CrownOutlined style={{ fontSize: '32px' }} />
            <div style={{marginRight: '-3px'}}>Medal</div>
        </div>
        <Modal
        title="My Medal"
        centered
        open={open}
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
         <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          title={item.title}
        />
      </List.Item>
      )}
      style={{ marginTop: '-20px', padding: 0 }}
      />
      </Modal>
      </>
    );
}

