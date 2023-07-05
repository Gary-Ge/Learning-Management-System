import './studentforums.less';
import { useState, useEffect } from "react";
import Navbar from "../../component/navbar";
import Footer from "../../component/footer";
import { Input, Button, Modal, message, Upload, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useLocation } from 'umi';
let data:any = [
    {
        key: '0', title: 'COMP9417 Machine Learning',is_selected: true, id: "111"
    },
    {
        key: '1', title: 'COMP6080 Machine Learning',is_selected: false, id: "22"
    },
];
let left_list:any = [
    {
        key: '0', id: "111", title: 'what is the result of question 1 in quiz 1 ?',
        is_selected: false, tag: 'General',
        time: '10/04/2023 12:00:00', author: 'Anonymous'
    },
    {
        key: '1', id: "22", title: 'what is the result of question 3 in quiz 2 ?',
        is_selected: false, tag: 'Quiz',
        time: '12/04/2023 12:00:00', author: 'Mikcle W'
    },
    {
        key: '2', id: "33", title: 'what is the result of question 3 in quiz 2 ?',
        is_selected: false, tag: 'Assignment',
        time: '14/05/2023 12:00:00', author: 'Mikcle W'
    },
    {
        key: '3', id: "111", title: 'what is the result of question 1 in quiz 1 ?',
        is_selected: false, tag: 'General',
        time: '10/04/2023 12:00:00', author: 'Anonymous'
    },
    {
        key: '4', id: "22", title: 'what is the result of question 3 in quiz 2 ?',
        is_selected: false, tag: 'Quiz',
        time: '12/04/2023 12:00:00', author: 'Mikcle W'
    },
    {
        key: '5', id: "33", title: 'what is the result of question 3 in quiz 2 ?',
        is_selected: false, tag: 'Assignment',
        time: '14/05/2023 12:00:00', author: 'Mikcle W'
    },
    {
        key: '6', id: "111", title: 'what is the result of question 1 in quiz 1 ?',
        is_selected: false, tag: 'General',
        time: '10/04/2023 12:00:00', author: 'Anonymous'
    },
    {
        key: '7', id: "22", title: 'what is the result of question 3 in quiz 2 ?',
        is_selected: false, tag: 'Quiz',
        time: '12/04/2023 12:00:00', author: 'Mikcle W'
    },
    {
        key: '8', id: "33", title: 'what is the result of question 3 in quiz 2 ?',
        is_selected: false, tag: 'Assignment',
        time: '14/05/2023 12:00:00', author: 'Mikcle W'
    },
]
const options = [
    { label: 'General', value: 'General' },
    { label: 'Quiz', value: 'Quiz' },
    { label: 'Assignment', value: 'Assignment'},
];

const { Search, TextArea } = Input;
const onSearch = (value: string) => console.log(value);
  // click tabs title
const onclickcourse = (idx:string, id:string) => {
    data.map((item:any) => {
        item.is_selected = false;
    });
    data[idx].is_selected = true;
    // setdataLists([...data]);
    // fun_list.map(item => {
    //   item.is_selected = false;
    // });
    // fun_list[0].is_selected = true;
    // setfunLists([...fun_list]);
    // set_ass_left_list_show(false);

    // getallsections(id); // get materials
    // getallassignments(id, '0'); // update assignment
    // getcourseinfo(id); // update course outline
};


export default function studentforums() {
    const [datalist,setdataLists] = useState(data); // tabs course title
    const [leftlist, setLeftList] = useState(left_list);
    const [create_thread_tag_value, setcreate_thread_tag_value] = useState('General');
    const [create_thread_content, set_create_thread_content] = useState('');

    const create_change_tag = ({ target: { value } }: RadioChangeEvent) => {
        console.log('checked', value);
        setcreate_thread_tag_value(value);
    };

    const createthreadcontent =  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // console.log(e.target.value);
        set_create_thread_content(e.target.value);
        console.log(create_thread_content);
      };
    return(
        <div className='forum_wrap'>
            <Navbar />
            <div className='stu_forum_title'>Course Forums</div>
            <div className='stu_title'>
                <div className='stu_title_list'>
                {datalist.map( (course_item:any)  => 
                <div className='stu_list_header' key={course_item.title}>
                    <p key={course_item.id} onClick={() => onclickcourse(course_item.key, course_item.id)} id={course_item.key} className={course_item.is_selected ? "forum_selected": ""}>{course_item.title}</p>
                    <p className={course_item.key == String(data.length - 1) ? "stu_title_bar": ""}>|</p></div>  )}
                </div>
                <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} allowClear/>
            </div>
            <div className='stu_forum_tag_wrap'>
                <div className='stu_forum_tag tag_general tag_active'>General</div>
                <div className='stu_forum_tag tag_quiz'>Quiz</div>
                <div className='stu_forum_tag tag_ass'>Assignment</div>
                <Button type="primary" className='btn_add'>+ New Thread</Button>
            </div>
            <div className='stu_forum_content_wrap'>
                <div className={leftlist.length > 4?'stu_forum_list scroll_y': 'stu_forum_list'}>
                    {
                        leftlist.map((_item: any) => {
                            return (
                            <div className='stu_forum_left_list' key={_item.key}>
                                <div></div>
                                <div className='stu_forum_left_list_wrap'>
                                    <div className='list_title'>{_item.title}</div>
                                    <div className='stu_forum_left_list_content'>
                                        <div className='display_flex'>
                                            {
                                                _item.tag == 'General' ? <div className='stu_forum_tag tag_general'>General</div> : ''
                                            }
                                            {
                                                _item.tag == 'Quiz' ? <div className='stu_forum_tag tag_quiz'>Quiz</div> : ''
                                            }
                                            {
                                                _item.tag == 'Assignment' ? <div className='stu_forum_tag tag_quiz tag_ass'>Assignment</div> : ''
                                            }
                                            <div className='gray6'>{_item.time}</div>
                                        </div>
                                        <div className='gray6'>{_item.author}</div>
                                    </div>
                                </div>
                            </div>
                            )
                        })
                    }

                </div>
                <div className='stu_forum_content'>
                    <div className='create_wrap'>
                        <div className='create_wrap_title'>Create Thread</div>
                        <div className='create_title'>
                            <div className='create_left_title'>Thread Title:</div>
                            <Input placeholder="Input Thread Title" className='create_input'/>
                        </div>
                        <div className='create_title'>
                            <div className='create_left_title'>Choose Category:</div>
                            <div className='create_input'><Radio.Group
                                    options={options}
                                    onChange={create_change_tag}
                                    value={create_thread_tag_value}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                            </div>
                        </div>
                        <div className=''>
                            <div className='create_left_title'>Thread Content:</div>
                            <div className='create_textarea'>
                                <TextArea rows={8} allowClear onChange={createthreadcontent} value = {create_thread_content}/>
                            </div>
                            <Button type="primary" className='creat_btn'>Submit</Button>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}