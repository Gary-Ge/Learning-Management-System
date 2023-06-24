import'./studentcourse.less';
import { useState, useEffect } from "react";
import Navbar from "../../component/navbar"
import Footer from "../../component/footer"
import { Input, Button } from 'antd';
import { useLocation } from 'umi';
import ReactPlayer from 'react-player'
import { HOST_STUDENT,COURSE_URL,getToken, HOST_COURSE, COURSE_DETAIL_URL,HOST_SECTION, HOST_RESOURCE } from '../utils/utils';
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

let data = [
  {
    key: '0', title: 'COMP9900',is_selected: true, id: "111"
  },
  {
    key: '1', title: 'COMP9901',is_selected: false, id: "222"
  },
  {
    key: '2', title: 'COMP9902',is_selected: false, id: "333"
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
  { outline_title: '', author: '',
  category: '', coverimg: '', time: '',
  courseid : '',
  outline_content: "",
}];
let materials_list = [
  {
    key: '0', title: '', time: '', content: "",
    file_list: [], cover: '', type:''
  },{
    key: '1', title: '', time: '', content: "",
    file_list: [], cover: '', type:''
  },{
    key: '2', title: '', time: '', content: "",
    file_list: [], cover: '', type:''
  },
];


export default function IndexPage() {
  const [isviewflag, setisviewflag] = useState(true);
  const [datalist,setdataLists]= useState(data); // tabs course title
  const [funlist,setfunLists]= useState(fun_list);
  const [courseoutline,setcourseoutline]= useState(course_outline); // function to change course outline
  const [materialslist,setmaterialLists]= useState(materials_list); // function to change materials

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  let courseid: any = query.get('courseid');
  console.log("---------");
  console.log(courseid);
  // const [count, setCount] = useState(0);
  // useEffect(() => {
  //   setCount(count + 1);
  //   console.log("count");
  //   console.log(count);
  // });
  // 
  const token = getToken(); // todo 
  useEffect(() => {
    getcourseinfo(courseid.toString()); // get course outline
    // getallcourse -> tabs title

  },[]);
  // get course list
  const getallcourse = (viewtitle:any) => {
    fetch(`${HOST_STUDENT}${COURSE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      console.log(res.data.courses);
      let courselist = []
      courselist = res.data.courses;
      data = [];
      let courseidlist: any[] = [];
      courselist.map((item: any, index: number) => {
        courseidlist.push(item.courseId);
      })
      if (courseidlist.indexOf(courseid) == -1) { // no enroll 
        setisviewflag(false);
        console.log('isviewflag', isviewflag); 
        data.push({
          key : '0',
          id: courseid,
          title: viewtitle,
          is_selected: true
        });
        console.log('data', data);
        courselist.map((item: any, index: number) => {
          console.log(item.title, item.courseId);
          data.push({
            key : (index+1).toString(),
            id: item.courseId,
            title: item.title,
            is_selected: false
          });
        });
        setdataLists([...data]);
        setfunLists([{
          key: '0', title: 'Outline', is_selected: true, img_link: stu_icon_1
        }])
      } else {
        courselist.map((item: any, index: number) => {
          console.log(item.title, item.courseId);
          data.push({
            key : index.toString(),
            id: item.courseId,
            title: item.title,
            is_selected: courseid == item.courseId ? true : false
          })
        })
        setdataLists([...data]);
        getallsections(courseid.toString()); // get all sections
      }
    })
    .catch(error => {
      console.log(error.message);
    });  
  }
  // get course outline
  const getcourseinfo = (courseid:string) => {
    fetch(`${HOST_COURSE}${COURSE_DETAIL_URL}/${courseid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      console.log(res.data.course);
      let res_data = res.data.course;
      let outline = course_outline;
      outline[0].outline_title = res_data.title;
      outline[0].author = res_data.creator.username;
      outline[0].category = res_data.category;
      outline[0].coverimg = res_data.cover;
      outline[0].time = res_data.updatedAt;
      outline[0].courseid = res_data.courseId;
      outline[0].outline_content = res_data.description;
      setcourseoutline([...outline]);
      // console.log("setviewtitle",res_data.title);
      getallcourse(res_data.title);
    })
    .catch(error => {
      console.log(error.message);
    });
  };
  //
  const getvideourl = (resourceId:string, inneritem:any)=> {
    fetch(`${HOST_RESOURCE}/video/${resourceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log('res');
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      console.log('video url:',res.data.auth.playURL);
      inneritem.url = res.data.auth.playURL
    });
  }
  // get all sections of a course
  const getallsections = (courseid:string) => {
    fetch(`${HOST_SECTION}/sections/${courseid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log('get all sections');
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      console.log(res.data.sections);
      materials_list = []
      let res_sections = res.data.sections;
      res_sections.map( (item:any, index: string) => {
        materials_list.push({
          key: index.toString(),
          title: item.title,
          time: item.updatedAt,
          content: item.description,
          type: item.type,
          file_list: item.resources, // resources
          cover: item.cover
        });
      });
      materials_list.map(item => {
        if (item.type == 'Custom Video Section') {
          item.file_list.map((inneritem:any) => {
            if (inneritem.type == "Video") {
              // let url_link = getvideourl(inneritem.resourceId);
              let videolink:any
              getvideourl(inneritem.resourceId, inneritem)
              
            }
          })
        }
      });
      setmaterialLists([...materials_list]);
      console.log("materials_list:",materials_list);
      
    })
    .catch(error => {
      console.log(error.message);
    }); 
  };

  // click tabs title
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

  // click left list
  const onclicklist = (e:any) => {
    // console.log(e.target.id);
    fun_list.map(item => {
      item.is_selected = false;
    });
    fun_list[e.target.id].is_selected = true;
    setfunLists([...fun_list]);
  };

 // download materials 2
  const getsourcelink = (resourceid:string) => {
    fetch(`${HOST_RESOURCE}/resource/${resourceid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      console.log('getsourcelink', res);
      // window.location.href="https://baidu.com"; // todo download
    })
  }
  // download materials 1
  const downLoadMaterial = (e:any) => {
    console.log('resourceid',e.target.id);
    getsourcelink(e.target.id);
  };
  // download assignment
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
          {
            isviewflag ?           
            <div className='stu_icon_last_list'>
              <img src={stu_icon_7} className="stu_icon_list"/>
              <img src={stu_icon_8} className="stu_icon_list"/>
              <img src={stu_icon_9} className="stu_icon_list"/>
            </div> : <Button type="primary" className='btn'>Join</Button>
          }

        </div>
        <div className={funlist[0].is_selected ? 'stu_right_content': 'display_non'}>
          <div className='outline_title'>Course Outline : {courseoutline[0].outline_title}</div>
          <div className='outline_img'><img src={courseoutline[0].coverimg}/></div>
          <div className='outline_title_second'>Course Teacher</div>
          <div className='outline_content'>{courseoutline[0].author}</div>
          <div className='outline_title_second'>Category</div>
          <div className='outline_content'>{courseoutline[0].category}</div>
          <div className='outline_title_second'>Updated Time</div>
          <div className='outline_content'>{courseoutline[0].time}</div>
          <div className='outline_title_second'>Course Summary</div>
          <div className='outline_content'>{courseoutline[0].outline_content}</div>
        </div>
        { 
          isviewflag ? 
          <template>
            <div className={funlist[1].is_selected ? 'stu_right_content': 'display_non'}>
              online stream class features are being developed...
            </div>
            <div className={funlist[2].is_selected ? 'stu_right_content': 'display_non'}>
              {
                materialslist.map(item => <div className='materials_wrap' key={item.key}>
                <div className='materials_title'>{item.title}</div>
                <div className='materials_time'>{item.time}</div>
                <div className='materials_img'><img src={item.cover}/></div>
                {item.type == 'Text Section' ? <div className='materials_content'>{item.content}</div> : ''}
                { item.file_list.map((itm:any, idx:number) => 
                  <div key={idx.toString()}>
                    {itm.type == 'File' ? <div className='downloadfile' onClick={downLoadMaterial} id={itm.resourceId}>Download file : {itm.title}
                    <img src={downloadicon} className="downloadicon"/></div> : <div><ReactPlayer controls url={itm.url} id={itm.resourceId} className='react-player' /><p className='video_title'>{itm.title}</p></div>}
                  </div>
                )}
                {item.type == 'Custom Video Section' ? <div className='materials_content'>{item.content}</div> : ''}
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
                  <img src={downloadicon} className="downloadicon"/>
                </div>
                <div className='ass_upload'><img src={uploadicon} className='uploadicon'/>Drag files here to upload</div>
            </div>
          </template> : ''
        }
      </div>
      <Footer />
    </div>
  );
}
