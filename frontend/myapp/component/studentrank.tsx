import React, { useState,useEffect } from 'react';
import { CrownOutlined } from '@ant-design/icons';
import { Modal, List,message } from 'antd';
import gold from '../../images/1.gif';
import silver from '../../images/2.gif';
import copper from '../../images/3.gif';
import {HOST_STUDENT,getToken } from '../src/utils/utils';

export default function StudentRank() {
    interface MedalItem {
        title: string;
        medals: string[];
        description?: string[];
    }
    type MedalType = 'gold' | 'silver' | 'copper';

    const medalImages: Record<MedalType, string> = {
        gold: gold,
        silver: silver,
        copper: copper
    };
    const [open, setOpen] = useState(false);
    const query = new URLSearchParams(location.search);
    const token = getToken()
    let courseid: any = query.get('courseid');
    const [medal, setMedal] = useState<MedalItem[]>([]);
    useEffect(() => {
        fetch(`${HOST_STUDENT}/medals/${courseid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": `Bearer ${token}`
              },
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
               message.error(res.message)
               return
            }
            setMedal(res.data.medals)
          })
          .catch(error => {
            message.error(error.message)
          }); 
      }, [courseid, token]);
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
        style={{fontFamily: 'Comic Sans MS'}}
      >
         <List
    itemLayout="horizontal"
    dataSource={medal}
    renderItem={item => (
      <List.Item >
        <List.Item.Meta
          title={item.title}
          description={
            item.medals && item.medals.length > 0 ? (
              <div style={{ display: 'flex',alignItems: 'center',justifyContent:'flex-start' }}>
                {item.medals.map((medal, index) => (
                  <div key={index} style={{ marginRight: '20px' }}>
                    <img src={medalImages[medal as MedalType]} alt="medal" style={{ width: '100px' }} />
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






