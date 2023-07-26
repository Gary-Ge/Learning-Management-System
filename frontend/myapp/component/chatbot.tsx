
import { useState, useEffect } from 'react';
import { HOST_CHAT, getToken } from '../src/utils/utils';
import { useLocation } from 'umi';
import { Button, message, Input, Spin } from 'antd';
import './chatbot.less'; 
import stu_icon_7 from '../../images/stu_icon_7.png';

let chat_list:any = [
    {
        type: 'chatbot', message: "Dear users, welcome to our system. If you have any questions, you can enter them and I will answer them."
    }
]

export default function chatbot() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    // console.log('query', query, location.pathname);
    let pagetype = 'staff'
    if (location.pathname == '/viewstudentcourse' || location.pathname == '/studentcourse') {
        pagetype = 'student'
    }

    const token = getToken();
    const [pageType, setpageType] = useState(pagetype);
    const [chatlist, setchatlist] = useState(chat_list);
    const [typevalue, settypevalue] = useState('');
    useEffect(() => {
        clickcancel(false)
    },[]);

    const changevalue = (event:any) => {
        settypevalue(event.target.value)
    }
    const submit = () => {
        // console.log(typevalue);
        chat_list.push({
            type: 'user', message: typevalue,
        })
        setchatlist([...chat_list])
        settypevalue('')
        chat_list.push({
            type: 'chatbot', message: '',
        })
        setchatlist([...chat_list])

        setTimeout(() => {
            // console.log(chat_list);
        
            let formData = {
                message: typevalue
            }
            fetch(`${HOST_CHAT}/${pagetype}/message/`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
            .then(res => res.json())
            .then(res => {
                if (res.code !== 20000) {
                    message.error(res.message)
                    return
                }
                // console.log(res.data.response);
                // chat_list.push({
                //     type: 'chatbot', message: res.data.response
                // })
                chat_list[chat_list.length - 1].message = res.data.response
                setchatlist([...chat_list])
            })
            .catch(error => {
                message.error(error.message)
            });
        }, 300);
    }
    const clickword = (word:string)=> {
        settypevalue(word)
    }
    const clickcancel = (flag: boolean) => {
        fetch(`${HOST_CHAT}/${pagetype}/messages/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
              throw new Error(res.message)
            } else {
                chat_list = [
                    {
                        type: 'chatbot', message: "Dear users, welcome to our system. If you have any questions, you can enter them and I will answer them."
                    }
                ]
                setchatlist([...chat_list])
                if (flag) {
                    message.success(res.message);
                }
                
                window.scrollTo(0, 0);
            }
          })
          .catch(error => {
            message.error(error.message)
          });
    }

    return(
        <div className='stu_right_content chatbotbigwrap fm'>
        <p className='chatbottitle'>Your Chatbot Service</p>
        <div className='gray6 chatbothint'>
            Tips: Type in the keyword <span className='chatbotkeyword' onClick={()=>{clickword('myinfo')}}>myinfo</span> to get information about your current users.
            Type <span className='chatbotkeyword' onClick={()=>{clickword('deadlines')}}>deadlines</span> or <span className='chatbotkeyword' onClick={()=>{clickword('deadline')}}>deadline</span> or <span className='chatbotkeyword' onClick={()=>{clickword('due')}}>due</span> to get the deadlines of all the courses you {pageType == 'staff' ? 'teach': 'have'}.
            Type the keyword <span className='chatbotkeyword' onClick={()=>{clickword('update')}}>update</span> to get the latest updated materials for all the courses you {pageType == 'staff' ? 'teach': 'have'}.
            Type the keyword <span className='chatbotkeyword' onClick={()=>{clickword('search')}}>search</span> for the course you want to search. You can search for all the contents of the course. For example, enter search comp and you will find all courses with the word comp in the title.
        </div>
        <div className='chatbotwhitewrap'>
        {
            chatlist.map((item:any, index: string) => {
                return(<div key={index}>
                        {
                            item.type == 'chatbot' ? <div className='chatbotwrap'>
                            <img src={stu_icon_7} className="chatboticon"/>
                            {item.message ? <div className='chatbotcontent' dangerouslySetInnerHTML={{__html: item.message}}></div> : <Spin />}
                            </div> : 
                            <div className='chatbotcustomwrap'>
                                <span className='chatbotcontent'>{item.message}</span>
                                <img src={JSON.parse(localStorage.getItem('userData') || '{}').avatar} className="chatboticon mlt10"/>
                            </div>
                        }
                </div>)
            })
        }
        </div>
        <div className='chatbotcustomwrap'>
        <Input placeholder="Type your question here" value={typevalue} onChange={changevalue} onPressEnter={submit}/>
        <Button type="primary" className='mlt' onClick={submit}>Submit</Button>
        <Button danger className='mlt' onClick={() => {clickcancel(true)}}>Close</Button>
        </div>
      </div>
    )
}