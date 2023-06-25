import'./studentcourse.less';
import { useState, useEffect } from "react";
import Navbar from "../../component/navbar"
import Footer from "../../component/footer"
import { Input, Button, Modal } from 'antd';
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

let data:any = [
  // {
  //   key: '0', title: '',is_selected: true, id: "111", isenroll: true
  // },
];

const { Search } = Input;
const onSearch = (value: string) => console.log(value);

const fun_list = [
  {
    key: '0', title: 'Outline', is_selected: true, img_link: stu_icon_1
  },
  {
    key: '1', title: 'Materials', is_selected: false, img_link: stu_icon_3
  },
  {
    key: '2', title: 'Assignments', is_selected: false, img_link: stu_icon_6
  },
];
  // {
  //   key: '1', title: 'Join Class', is_selected: false, img_link: stu_icon_2
  // },

  // {
  //   key: '3', title: 'Forums', is_selected: false, img_link: stu_icon_4
  // },
  // {
  //   key: '4', title: 'Quizzes', is_selected: false, img_link: stu_icon_5
  // },

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
  const [isenrollflag, setisenrollflag] = useState(true);
  const [datalist,setdataLists]= useState(data); // tabs course title
  const [funlist,setfunLists]= useState(fun_list);
  const [courseoutline,setcourseoutline]= useState(course_outline); // function to change course outline
  const [materialslist,setmaterialLists]= useState(materials_list); // function to change materials
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  let courseid: any = query.get('courseid');
  // console.log("---------");
  // console.log(courseid);
  // const [count, setCount] = useState(0);
  // useEffect(() => {
  //   setCount(count + 1);
  //   console.log("count");
  //   console.log(count);
  // });
  // 
  const token = getToken(); // todo 
  useEffect(() => {
    // get course outline | true: get all course
    getcourseinfo(courseid.toString(), true);
    // getallcourse -> tabs title

  },[]);
  // get course list -> get all sections
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
      // console.log(res.data.courses);
      let courselist = []
      courselist = res.data.courses;
      data = [];
      let courseidlist: any[] = [];
      courselist.map((item: any, index: number) => {
        courseidlist.push(item.courseId);
      })
      if (courseidlist.indexOf(courseid) == -1) { // no enroll 
        setisenrollflag(false);
        console.log('isenrollflag', isenrollflag); 
        data.push({
          key : '0',
          id: courseid,
          title: viewtitle,
          is_selected: true,
          isenroll: false
        });
        console.log('data', data);
        courselist.map((item: any, index: number) => {
          console.log(item.title, item.courseId);
          data.push({
            key : (index+1).toString(),
            id: item.courseId,
            title: item.title,
            is_selected: false, 
            isenroll: true
          });
        });
        setdataLists([...data]);
        setfunLists([{
          key: '0', title: 'Outline', is_selected: true, img_link: stu_icon_1
        }])
      } else { // all enroll
        setisenrollflag(true);
        console.log('isenrollflag', isenrollflag);
        courselist.map((item: any, index: number) => {
          console.log(item.title, item.courseId);
          data.push({
            key : index.toString(),
            id: item.courseId,
            title: item.title,
            is_selected: courseid == item.courseId ? true : false, 
            isenroll: true
          })
        })
        fun_list.map(item => {
          item.is_selected = false;
        });
        fun_list[0].is_selected = true;
        setfunLists([...fun_list]);
        setdataLists([...data]);
        console.log('++data',data);
        getallsections(courseid.toString()); // get all sections
      }
    })
    .catch(error => {
      console.log(error.message);
    });  
  }
  // get course outline
  const getcourseinfo = (courseid:string, flag:boolean) => {
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
      if (flag) {
        getallcourse(res_data.title);
      }
      
    })
    .catch(error => {
      console.log(error.message);
    });
  };
  // get video url
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
  const onclickcourse = (idx:string, id:string) => {
    // console.log(e.target.outerText);
    console.log('id+++', id);
    data.map((item:any) => {
      item.is_selected = false;
    });
    data[idx].is_selected = true;
    // e.target.className = "selected";
    setdataLists([...data]);
    console.log('isenroll',data[idx].isenroll);
    if (data[idx].isenroll) {
      // updata left list
      setisenrollflag(true);

      fun_list.map(item => {
        item.is_selected = false;
      });
      fun_list[0].is_selected = true;
      setfunLists([...fun_list]);
      console.log('++fun_list', fun_list);
      // get materials
      getallsections(id.toString());
    } else {
      //
      setisenrollflag(false);
      setfunLists([{
        key: '0', title: 'Outline', is_selected: true, img_link: stu_icon_1
      }])
      // console.log('++', funlist);
    }
    // update course outline
    getcourseinfo(id, false);
  };

  // click left list
  const onclicklist = (e:any) => {
    // console.log(e.target.id);
    funlist.map(item => {
      item.is_selected = false;
    });
    funlist[e.target.id].is_selected = true;
    setfunLists([...funlist]);
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
      console.log('getsourcelink', res.data.fileUrl);
      const w:any = window.open("about:blank");  
      w.location.href=res.data.fileUrl
      // window.location.href = res.data.fileUrl; // todo download
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
  // join a class
  const joincourse = () => {
    console.log('joincourse',courseid);
    fetch(`${HOST_STUDENT}/student/${courseid}`, {
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
      } else {
        fun_list.map(item => {
          item.is_selected = false;
        });
        fun_list[0].is_selected = true;
        setfunLists([...fun_list]);
        getcourseinfo(courseid.toString(), true);
      }
    })
  }
  // drop course 1
  const dropcourse = () => {
    console.log('dropdatalist', datalist);
    showModal();

  }
  // drop course 2
  const deletedropcourse = (courseid:string) => {
    fetch(`${HOST_STUDENT}/student/${courseid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (!res.success) {
        throw new Error(res.message)
      } else {
        getcourseinfo(courseid.toString(), true);
        setIsModalOpen(false);
      }
    })
  }
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    
    datalist.map((item:any)=>{
      if (item.is_selected) {
        console.log(item.id);
        deletedropcourse(item.id);
      }
    })
    
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className='stu_wrap'>
      <Navbar />
      <div className='stu_title'>
        <div className='stu_title_list'>
          {datalist.map( (course_item:any)  => 
          <div className='stu_list_header' key={course_item.title}>
            <p key={course_item.id} onClick={() => onclickcourse(course_item.key, course_item.id)} id={course_item.key} className={course_item.is_selected ? "selected": ""}>{course_item.title}</p>
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
            isenrollflag ?           
            <div className='stu_icon_last_list'>
              <img src={stu_icon_7} className="stu_icon_list"/>
              <img src={stu_icon_8} className="stu_icon_list"/>
              <img src={stu_icon_9} className="stu_icon_list" onClick={dropcourse}/>
            </div> : <Button type="primary" className='btn' onClick={joincourse}>Join</Button>
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
          isenrollflag ? 
          <div className={!funlist[1].is_selected && !funlist[2].is_selected ? 'display_non': 'wid100'}>
            <div className={funlist[1].is_selected ? 'stu_right_content': 'display_non'}>
              {
                materialslist.length == 0 ? <div>there is no section now...</div> : ''
              }
              {
                materialslist.map(item => <div className='materials_wrap' key={item.key}>
                <div className='materials_title'>{item.title}</div>
                <div className='materials_time'>{item.time}</div>
                <div className='materials_img'><img src={item.cover}/></div>
                {item.type == 'Text Section' ? <div className='materials_content'>{item.content}</div> : ''}
                { item.file_list.map((itm:any, idx:number) => 
                  <div key={idx.toString()} className="downloadfile_wrap">
                    {itm.type == 'File' ? 
                    <div className='downloadfile' onClick={downLoadMaterial} id={itm.resourceId}>
                      <img src={downloadicon} className="downloadicon"/>Download file : {itm.title}
                    </div> : <div><ReactPlayer controls url={itm.url} id={itm.resourceId} className='react-player' /><p className='video_title'>{itm.title}</p></div>}
                  </div>
                )}
                {item.type == 'Custom Video Section' ? <div className='materials_content'>{item.content}</div> : ''}
                <div className='dashline'></div>

              </div>)
              }
            </div>
            <div className={funlist[2].is_selected ? 'stu_right_content': 'display_non'}>
                <div className='ass_title'>Week1 Assignment: learning system</div>
                <div className='ass_title_second'><img className='stu_timeicon' src={time_icon}/>Left Time: 3 days 1 hour 59 minutes</div>
                <div className='ass_content'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                <div className='downloadfile' onClick={downLoadAss} id="1">Download file
                  <img src={downloadicon} className="downloadicon"/>
                </div>
                <div className='ass_upload'><img src={uploadicon} className='uploadicon'/>Drag files here to upload</div>
            </div>
          </div> : ''
        }
      </div>
      <Modal title="Drop course" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to drop out of the course?</p>
      </Modal>
      <Footer />
    </div>
  );
}
