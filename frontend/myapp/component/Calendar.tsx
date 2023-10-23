import React from 'react';
import { Layout} from 'antd';
import {HeartFilled} from '@ant-design/icons';
import { Calendar } from 'antd';
import { useState,useEffect } from "react";
import { getToken, HOST_STAFF} from '../src/utils/utils';
import { message } from 'antd';
import type { Dayjs } from 'dayjs';
import moment from 'moment';

const { Content, Footer } = Layout;

const Newcalendar: React.FC = () => {

  useEffect(() => {
    getCalendar();
  },[])
  const [allDue,setAllDue] = useState([])
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'))
  const token = getToken()

  const getCalendar = () => {
    fetch(`${HOST_STAFF}/calendar`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        // throw new Error(res.message)
        message.error(res.message);
        return
      }
      let get_all_due = res.data.courses
      let all_due:any = []
      get_all_due.AssignmentList.map((item:any)=> {
        all_due = all_due.concat(item)
      })
      get_all_due.QuizList.map((item:any)=> {
        all_due = all_due.concat(item)
      })
      get_all_due.StreamList.map((item:any)=> {
        all_due = all_due.concat(item)
      })
      all_due.map((item: any)=>{
        if(item.assignment_id){
          item.title = `${item.course_title}, Assignment: ${item.assignment_title}, Time: ${item.assignment_end.substring(11)}`
          item.time = item.assignment_end.substring(0,10)
        }
        if(item.quiz_id){
          item.title = `${item.course_title}, Quiz: ${item.quiz_title}, Time: ${item.quiz_end.substring(11)}`
          item.time = item.quiz_end.substring(0,10)
        }
        if(item.stream_id){
          item.title = `${item.course_title}, Stream Lesson: ${item.stream_title}, Time: ${item.stream_end.substring(11)}`
          item.time = item.stream_end.substring(0,10)
        }
      })
      setAllDue(all_due)
    })
    .catch(error => {
      message.error(error.message)
    });
  }

  const datecellrender = (value: Dayjs) => {
    let listData:any = []
    allDue.map((item:any) => {
      if (item.time.substring(8,9) == '0') {
        if (item.time.substring(9) == value.date().toString() && item.time.substring(5,7) == selectedDate.substring(5,7)) {
          listData.push({content: item.title, type: 'warning'})
        }
      } else {
        if (item.time.substring(8) == value.date().toString() && item.time.substring(5,7) == selectedDate.substring(5,7)) {
          listData.push({content: item.title, type: 'warning'})
        }
      }

    })
    return (
      <ul className="events">
        {listData.map((item:any) => (
        <li key={item.content}>
          <div className='staff_calendar'>
            <span style={{width: '5px', height: '5px', background: 'orange', borderRadius: '50px', display: 'inline-block', marginRight:'5px'}}></span>
            {item.content}</div>
          </li>
        ))}
      </ul>
    );
  };
  return (
    <Layout style={{ backgroundColor: '#EFF1F6' }}>
      <p style={{textAlign:'center', fontSize: '20px', fontWeight: 'bold', fontFamily:  'Comic Sans MS'}}>
        Staff Calendar</p>
      <Content 
      className='fm'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          background: '#FFFFFF',
          borderRadius: '10px',
          maxWidth: '1040px',
          width: '100%',
          margin: '90px auto',
          height: 'auto',
          marginTop: '10px',
          border: '1px solid #B5B5B5'
        }}
      >
        <Calendar onSelect={date => setSelectedDate(date.format('YYYY-MM-DD'))} dateCellRender={datecellrender}/>
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

export default Newcalendar;