import'./studentcourse.less';
import { useState } from "react";
import Navbar from "../../component/navbar"
import { Input } from 'antd';
import stu_icon_1 from '../../../images/stu_icon_1.png';
import stu_icon_2 from '../../../images/stu_icon_2.png';
import stu_icon_3 from '../../../images/stu_icon_3.png';
import stu_icon_4 from '../../../images/stu_icon_4.png';
import stu_icon_5 from '../../../images/stu_icon_5.png';
import stu_icon_6 from '../../../images/stu_icon_6.png';
import stu_icon_7 from '../../../images/stu_icon_7.png';
import stu_icon_8 from '../../../images/stu_icon_8.png';
import stu_icon_9 from '../../../images/stu_icon_9.png';
import downloadicon from '../../../images/download.png';
import time_icon from '../../../images/timeicon.png';
import uploadicon from '../../../images/uploadicon.png';

const data = [
  {
    key: '0', title: 'COMP9900',is_selected: true
  },
  {
    key: '1', title: 'COMP9901',is_selected: false
  },
  {
    key: '2', title: 'COMP9902',is_selected: false
  },
];

const { Search } = Input;
const onSearch = (value: string) => console.log(value);

const fun_list = [
  {
    key: '0', title: 'Outline', is_selected: true, img_link: stu_icon_1
  },
  {
    key: '1', title: 'Join Class', is_selected: false, img_link: stu_icon_2
  },
  {
    key: '2', title: 'Materials', is_selected: false, img_link: stu_icon_3
  },
  {
    key: '3', title: 'Forums', is_selected: false, img_link: stu_icon_4
  },
  {
    key: '4', title: 'Quizzes', is_selected: false, img_link: stu_icon_5
  },
  {
    key: '5', title: 'Assignments', is_selected: false, img_link: stu_icon_6
  },
];
const course_outline = [
  { outline_title: 'Course Outline', author: 'Dr Smith W',
  outline_content: "This is a software project capstone course. Students work in teams of ideally five (5) members to define, implement and evaluate a real-world software system. Most of the work in this course is team-based project work, although there are some introductory lectures on software project management and teamwork strategies. Project teams meet weekly starting from Week 1 with project mentors to report on the progress of the project. Assessment is based on a project proposal, progressive demonstrations and retrospectives, a final project demonstration and report, and on the quality of the software system itself. Students are also required to reflect on their work and to provide peer assessment of their team-mates' contributions to the project.",
}];
const materials_list = [
  {
    key: '0', title: 'Week1 course slide', time: '10/06/2023', content: "project mentors to report on the progress of the project. Assessment is based on a project proposal, progressive demonstrations and retrospectives, a final project demonstration and report, and on the quality of the software system itself. Students are also required to reflect on their work and to provide peer assessment of their team-mates' contributions to the project.",
    file_link:'file_link0'
  },{
    key: '1', title: 'Week2 course slide', time: '10/06/2023', content: "project mentors to report on the progress of the project. Assessment is based on a project proposal, progressive demonstrations and retrospectives, a final project demonstration and report, and on the quality of the software system itself. Students are also required to reflect on their work and to provide peer assessment of their team-mates' contributions to the project.",
    file_link:'file_link1'
  },{
    key: '2', title: 'Week3 course slide', time: '10/06/2023', content: "project mentors to report on the progress of the project. Assessment is based on a project proposal, progressive demonstrations and retrospectives, a final project demonstration and report, and on the quality of the software system itself. Students are also required to reflect on their work and to provide peer assessment of their team-mates' contributions to the project.",
    file_link:'file_link2'
  },
];


export default function IndexPage() {
  // const [customize, setCustomize] = useState(true);
  const [datalist,setdataLists]= useState(data);
  const [funlist,setfunLists]= useState(fun_list);
  const [courseoutline,setcourseoutline]= useState(course_outline); // function to change course outline
  const [materialslist,setmaterialLists]= useState(materials_list); // function to change materials
  const onclickcourse = (e:any) => {
    console.log(e.target.outerText);
    console.log(e.target.id);
    data.map(item => {
      item.is_selected = false;
    });
    data[e.target.id].is_selected = true;
    // e.target.className = "selected";
    setdataLists([...data]);
  };
  const onclicklist = (e:any) => {
    console.log(e.target.id);
    fun_list.map(item => {
      item.is_selected = false;
    });
    fun_list[e.target.id].is_selected = true;
    setfunLists([...fun_list]);
  };
  const downLoadMaterial = (e:any) => {
    console.log(e.target.id);
  };
  const downLoadAss = (e:any) => {
    console.log(e.target.id);
  };
  return (
    <div className='stu_wrap'>
      <Navbar />
      <div className='stu_title'>
        <div className='stu_title_list'>
          {datalist.map( course_item  => 
          <div className='stu_list_header' key={course_item.title}>
            <p key={course_item.title} onClick={onclickcourse} id={course_item.key} className={course_item.is_selected ? "selected": ""}>{course_item.title}</p>
            <p className={course_item.key == String(data.length - 1) ? "stu_title_bar": ""}>|</p></div>  )}
        </div>
        <div><Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} allowClear/></div>
      </div>
      <div className='stu_content'>
        <div className='stu_left_list'>
          {
            funlist.map(item => <div className={item.is_selected ? 'stu_active': ''} onClick={onclicklist} id={item.key} key={item.key}>
            <img src={item.img_link} className="stu_icon"/>{item.title}</div>)
          }
          <div className='stu_icon_last_list'>
            <img src={stu_icon_7} className="stu_icon_list"/>
            <img src={stu_icon_8} className="stu_icon_list"/>
            <img src={stu_icon_9} className="stu_icon_list"/>
          </div>
        </div>
        <div className={funlist[0].is_selected ? 'stu_right_content': 'display_non'}>
          <div className='outline_title'>{courseoutline[0].outline_title}</div>
          <div className='outline_title_second'>Course Teacher</div>
          <div className='outline_content'>{courseoutline[0].author}</div>
          <div className='outline_title_second'>Course Summary</div>
          <div className='outline_content'>{courseoutline[0].outline_content}</div>
        </div>
        <div className={funlist[1].is_selected ? 'stu_right_content': 'display_non'}>
            online stream class features are being developed...
        </div>
        <div className={funlist[2].is_selected ? 'stu_right_content': 'display_non'}>
          {
            materialslist.map(item => <div className='materials_wrap' key={item.key}>
            <div className='materials_title'>{item.title}</div>
            <div className='materials_time'>{item.time}</div>
            <div className='materials_content'>{item.content}</div>
            <div className='downloadfile' onClick={downLoadMaterial} id={item.file_link}>Download file
              <img src={downloadicon} className="downloadicon"/></div>
            <div className='dashline'></div>
          </div>)
          }
        </div>
        <div className={funlist[3].is_selected ? 'stu_right_content': 'display_non'}>
            Forum features are being developed...
        </div>
        <div className={funlist[4].is_selected ? 'stu_right_content': 'display_non'}>
            Online Quiz features are being developed...
        </div>
        <div className={funlist[5].is_selected ? 'stu_right_content': 'display_non'}>
            <div className='ass_title'>Week1 Assignment: learning system</div>
            <div className='ass_title_second'><img className='stu_timeicon' src={time_icon}/>Left Time: 3 days 1 hour 59 minutes</div>
            <div className='ass_content'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            <div className='downloadfile' onClick={downLoadAss} id="1">Download file
              <img src={downloadicon} className="downloadicon"/></div>
            <div className='ass_upload'><img src={uploadicon} className='uploadicon'/>Drag files here to upload</div>
        </div>
      </div>
    </div>
  );
}
