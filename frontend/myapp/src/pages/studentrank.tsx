import React, { useState } from 'react';
import { CrownOutlined } from '@ant-design/icons';
import { Modal, List } from 'antd';
import gold from '../../../images/1.gif';
import silver from '../../../images/2.gif';
import copper from '../../../images/3.gif';

export default function StudentRank() {
    const [open, setOpen] = useState(false);
    const data = [
        {
          title: 'All Grades',
          medals:[]
        },
        {
          title: 'Quiz',
          medals: [gold, silver,copper],
          description: ['Quiz1', 'Quiz2','Quiz3']
        },
        {
          title: 'Assignment',
          medals: [gold, silver,copper],
          description: ['Assignment1', 'Assignment2','Assignment3']
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
        visible={open}
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        style={{fontFamily: 'Comic Sans MS'}}
      >
         <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={item => (
      <List.Item >
        <List.Item.Meta
          title={item.title}
          description={
            item.medals && item.medals.length > 0 ? (
              <div style={{ display: 'flex',alignItems: 'center',justifyContent:'flex-start' }}>
                {item.medals.map((medal, index) => (
                  <div key={index} style={{ marginRight: '20px' }}>
                    <img src={medal} alt="medal" style={{ width: '100px' }} />
                    {item.description && <p style={{marginLeft: item.title === 'Quiz' ? '32px' : '10px'}}>{item.description[index]}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div>Come on!You can do it!</div>
            )
          }
        />
      </List.Item>
      )}
      style={{ marginTop: '-20px', padding: 0 }}
      />
      </Modal>
      </>
    );
}






