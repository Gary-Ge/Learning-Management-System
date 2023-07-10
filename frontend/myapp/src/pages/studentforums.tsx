import './studentforums.less';
import { useState, useEffect } from "react";
import Navbar from "../../component/navbar";
import Footer from "../../component/footer";
import { Input, Button, Modal, message, Upload, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { getToken } from '../utils/utils';
import { useLocation } from 'umi';
import emptyimg from '../../../images/teacher.png';
import defaultimg from '../../../images/defaultimg.png';
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

const plainOptions = ['Private', 'Anonymous'];

export default function studentforums() {
    const [datalist,setdataLists] = useState(data); // tabs course title
    const [leftlist, setLeftList] = useState(left_list);
    const [create_thread_tag_value, setcreate_thread_tag_value] = useState('General');
    const [create_thread_content, set_create_thread_content] = useState('');
    const [create_thread_author, set_create_thread_author] = useState('');
    const [showcontentflag, set_showcontentflag] = useState('0');
    const token = getToken();
    useEffect(() => {
        // getall course 
        // getallcourses_haveforum
    },[]);
    const getallcourses_haveforum = () => {
        // fetch(`${HOST_STUDENT}${COURSE_URL}`, {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/x-www-form-urlencoded",
        //       "Authorization": `Bearer ${token}`
        //     }
        //   })
        //   .then(res => res.json())
        //   .then(res => {
        //     if (res.code !== 20000) {
        //       throw new Error(res.message)
        //     }
        // })
    }

      // click tabs title
    const onclickcourse = (idx:string, id:string) => {
        data.map((item:any) => {
            item.is_selected = false;
        });
        data[idx].is_selected = true;
        setdataLists([...data]);
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
    const create_change_tag = ({ target: { value } }: RadioChangeEvent) => {
        console.log('checked', value);
        setcreate_thread_tag_value(value);
    };

    const createthreadcontent =  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // console.log(e.target.value);
        set_create_thread_content(e.target.value);
        console.log(create_thread_content);
    };
    const onChange1 = ({ target: { value } }: RadioChangeEvent) => {
        console.log('radio1 checked', value);
        set_create_thread_author(value);
    };
    const createthread = () => {
        set_showcontentflag('1');
    }
    const onclickthreadlist = (key: string) => {
        console.log('click thread: ', key);
        set_showcontentflag('2');
    }
    return(
        <div className='forum_wrap'>
            <Navbar />
            <div className='stu_forum_title'>Student Course Forums</div>
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
                <div className='stu_forum_tag tag_blue tag_active'>General</div>
                <div className='stu_forum_tag tag_red'>Quiz</div>
                <div className='stu_forum_tag tag_pink'>Assignment</div>
                <Button type="primary" className='btn_add' onClick={createthread}>+ New Thread</Button>
            </div>
            <div className='stu_forum_content_wrap'>
                <div className={leftlist.length > 3 ? 'stu_forum_list scroll_y': 'stu_forum_list'}>
                    {
                        leftlist.map((_item: any) => {
                            return (
                            <div className='stu_forum_left_list' key={_item.key}>
                                <div></div>
                                <div className='stu_forum_left_list_wrap' onClick={() => onclickthreadlist(_item.key)}>
                                    <div className='list_title'>{_item.title}</div>
                                    <div className='stu_forum_left_list_content'>
                                        <div className='display_flex'>
                                            {
                                                _item.tag == 'General' ? <div className='stu_forum_tag tag_blue'>General</div> : ''
                                            }
                                            {
                                                _item.tag == 'Quiz' ? <div className='stu_forum_tag tag_red'>Quiz</div> : ''
                                            }
                                            {
                                                _item.tag == 'Assignment' ? <div className='stu_forum_tag tag_red tag_pink'>Assignment</div> : ''
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
                <div className={showcontentflag == '0' ? 'empty_thread' : 'display_non'}>
                    <div><img src={emptyimg}/></div>
                    <div className='mt'>Choose a thread ...</div>
                </div>
                <div className={showcontentflag == '1' ? 'stu_forum_content' : 'display_non'}>
                    <div className='create_wrap'>
                        <div className='create_wrap_title'>Create Thread</div>
                        <div className='create_title'>
                            <div className='create_left_title'>Thread Title:</div>
                            <Input placeholder="Input Thread Title" className='create_input'/>
                        </div>
                        <div className='create_title'>
                            <div className='create_left_title'>Choose Category:</div>
                            <div className='create_input'>
                                <Radio.Group
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
                            <div className='create_author_wrap'>
                                <Radio.Group options={plainOptions} onChange={onChange1} value={create_thread_author} />
                            </div>
                            <Button type="primary" className='creat_btn'>Submit</Button>
                        </div>
                    </div>
                </div>
                <div className={showcontentflag == '2' ? 'stu_forum_content' : 'display_non'}>
                    <div className='stu_forum_title'>If there is an issue with your hw1 mark or you want your hw1 mark to be reviewed, please fill the review request form below</div>
                    <div className='forum_avatar_wrap'>
                        <img src={defaultimg} className='forum_default_avatar mrt'/>
                        <div className='forum_thread_avatar_wrap mrt'>
                            <div className='mrt font_large'>Armin Chitizadeh</div>
                            <div className='gray6'>11/06/2023 12:00:00</div>
                        </div>
                        <div className='stu_forum_tag tag_blue height25'>General</div>
                    </div>
                    <div className='stu_forum_thread_wrap'>
                        <div className='line_h'>
                        Dear students,The exam marks are now released. You should be able to view them here:<br/>The project marks should be released very soon. I will let you know once they are released.<br/>Kind regards,<br/>Armin
                        </div>
                        <div className='thread_input_wrap mt'>
                            <Input placeholder="Add a comment" className=''/>
                            <div className='gray6 mlt pointer'>comment</div>
                        </div>
                        <div className='forum_avatar_wrap padding_left'>
                            <img src={defaultimg} className='forum_moment_avatar mrt'/>
                            <div className='forum_thread_avatar_wrap mrt'>
                                <div className='mrt font_large font_small'>Tiffany Tang</div>
                                <div className='gray6 font_small'>11/06/2023 12:00:00</div>
                            </div>
                        </div>
                        <div className='forum_comment'>
                        Hello everyone, I was wondering if the Tue session video was posted under Week 12? I can only find the Mon video and not the Tue video...
                        </div>
                        <div className='gray6 mlt54 pointer'>replay</div>
                    </div>
                    <div className='forum_answer_wrap'>
                        <div className='font_large font_weight'>Answer</div>
                        <div className='forum_avatar_wrap'>
                            <img src={defaultimg} className='forum_default_avatar mrt'/>
                            <div className='forum_thread_avatar_wrap mrt'>
                                <div className='mrt font_large'>Arun Kumar Marndi</div>
                                <div className='gray6'>15/06/2023 12:00:00</div>
                            </div>
                        </div>
                        <div className='mlt90'>Unfortunately no.</div>
                        <div className='gray6 mlt90 pointer mt5'>replay</div>
                    </div>
                    <div className='forum_answer_wrap'>
                        <div className='font_large font_weight'>Your Answer</div>
                        <div className='create_textarea'>
                            <TextArea rows={8} allowClear onChange={createthreadcontent} value = {create_thread_content}/>
                        </div>
                        <Button type="primary" className='creat_btn'>Submit</Button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}