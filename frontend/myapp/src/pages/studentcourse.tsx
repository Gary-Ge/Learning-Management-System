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
interface List {
  assFileId: string,
  title: string
}
let assign_list = [  
  {
    key: '0', assid: '', title: '', start_time: '', end_time: '',
    content: '',
    ass_files: []as Array<List>,
  }
];

export default function IndexPage() {
  // const [isenrollflag, setisenrollflag] = useState(true);
  const [datalist,setdataLists]= useState(data); // tabs course title
  const [funlist,setfunLists]= useState(fun_list);
  const [courseoutline,setcourseoutline]= useState(course_outline); // function to change course outline
  const [materialslist,setmaterialLists]= useState(materials_list); // function to change materials
  const [assignlist,setassignmentLists]= useState(assign_list);
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

    // getall course -> tabs title
    getallcourse();
    // get course outline | true: get all course
    

  },[]);
  // get course list -> get all sections
  const getallcourse = () => {
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
      if (courselist.length == 0) {
        setfunLists([]);
        setdataLists([]);
        return;
      }
      if (courseidlist.indexOf(courseid) == -1) { // no enroll 
        // gotoview todo
        // first course in tabs title should be selected
        // window.alert('wrong jump');
        console.log('wrong jump');
        courselist.map((item: any, index: number) => {
          // console.log(item.title, item.courseId);
          data.push({
            key : index.toString(),
            id: item.courseId,
            title: item.title,
            is_selected: index == 0 ? true : false, 
            isenroll: true
          })
        })
        getcourseinfo(courselist[0].courseId);
        getallsections(courselist[0].courseId); // get all sections
        getallassignments(courselist[0].courseId);// get all assignment
      } else { // all enroll
        // setisenrollflag(true);
        // console.log('isenrollflag', isenrollflag);
        courselist.map((item: any, index: number) => {
          // console.log(item.title, item.courseId);
          data.push({
            key : index.toString(),
            id: item.courseId,
            title: item.title,
            is_selected: courseid == item.courseId ? true : false, 
            isenroll: true
          })
        })
        getcourseinfo(courseid.toString());
        getallsections(courseid.toString()); // get all sections
        getallassignments(courseid.toString()); // get all assignment
      }
      fun_list.map(item => {
        item.is_selected = false;
      });
      fun_list[0].is_selected = true;
      setfunLists([...fun_list]);
      setdataLists([...data]);
      console.log('++data',data);
      
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
      // if (flag) {
      //   getallcourse(res_data.title);
      // }
      
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
  // get all assignments
  const getallassignments = (courseid:string) => {
    fetch(`${HOST_STUDENT}/assignments/${courseid}`, {
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
      console.log('getallassignments',res.data.assignments);
      // if (res.data.assignments.length == 0) {
      //   setassignmentLists([]);
      // } else {
        assign_list = []
        let res_ass = res.data.assignments;
        res_ass.map((item:any, idx:string)=>{
          assign_list.push({
            key: idx,
            assid: item.assignmentId,
            title: item.title,
            start_time: item.start,
            end_time: item.end,
            content: item.description,
            ass_files: item.assFiles
          });
        });
        assign_list.map((_item:any, _index: number) => {
          getoneassignment(_item.assid, _item);
          // _item.ass_files.map((assfile:any) => {
          //   console.log("+++++++",assfile.assFileId,assfile.title);
          //   getoneassignment(assfile.assFileId, assfile);
          // })
        });
        
        setassignmentLists([...assign_list]);
        console.log('assign_list', assign_list);
        // console.log('assignlist', assignlist);
      // }
      // assign_list = [  
      //   {
      //     key: '0', assid: '', title: '', start_time: '', end_time: '',
      //     content: '',
      //     ass_files: [],
      //   }
      // ];
      // console.log(res.data.sections);
      // materials_list = []
      // let res_sections = res.data.sections;
      // res_sections.map( (item:any, index: string) => {
      //   materials_list.push({
      //     key: index.toString(),
      //     title: item.title,
      //     time: item.updatedAt,
      //     content: item.description,
      //     type: item.type,
      //     file_list: item.resources, // resources
      //     cover: item.cover
      //   });
      // });
      // materials_list.map(item => {
      //   if (item.type == 'Custom Video Section') {
      //     item.file_list.map((inneritem:any) => {
      //       if (inneritem.type == "Video") {
      //         // let url_link = getvideourl(inneritem.resourceId);
      //         let videolink:any
      //         getvideourl(inneritem.resourceId, inneritem)
              
      //       }
      //     })
      //   }
      // });
      // setmaterialLists([...materials_list]);
      // console.log("materials_list:",materials_list);
      
    })
    .catch(error => {
      console.log(error.message);
    }); 
  };
  // get one assignment info
  const getoneassignment = (ass_id:string, inneritem:any) => {
    fetch(`${HOST_STUDENT}/assignment/${ass_id}`, {
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
      console.log('get one ass:',res.data.assignment.assFiles);
      inneritem.ass_files = res.data.assignment.assFiles
      // inneritem.url = res.data.auth.playURL
    });
  }

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
    // if (data[idx].isenroll) {
      // updata left list initial to outline
      fun_list.map(item => {
        item.is_selected = false;
      });
      fun_list[0].is_selected = true;
      setfunLists([...fun_list]);
      console.log('++fun_list', fun_list);
      // get materials
      getallsections(id.toString());
      getallassignments(id.toString());
    // } 
    // else {
    //   setisenrollflag(false);
    //   setfunLists([{
    //     key: '0', title: 'Outline', is_selected: true, img_link: stu_icon_1
    //   }])
    // }
    // update course outline
    getcourseinfo(id);
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
  // download assignment todo
  const downLoadAss = (e:any) => {
    console.log(e.target.id);
  };
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
        getallcourse();
        // getcourseinfo(courseid.toString(), true);
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
        {
          funlist.length != 0 ? <div><Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} allowClear/></div> : ''
        }
      </div>
      <div className='stu_content'>
        <div className='stu_left_list'>
          {
            funlist.map(item => <div className={item.is_selected ? 'stu_active': ''} onClick={onclicklist} id={item.key} key={item.key}>
            <img src={item.img_link} className="stu_icon"/>{item.title}</div>)
          }
          {
            funlist.length != 0 ?             
            <div className='stu_icon_last_list'>
            <img src={stu_icon_7} className="stu_icon_list"/>
            <img src={stu_icon_8} className="stu_icon_list"/>
            <img src={stu_icon_9} className="stu_icon_list" onClick={dropcourse}/>
            </div> : ''
          }


        </div>

        <div className={funlist.length != 0 && funlist[0].is_selected ? 'stu_right_content': 'display_non'}>
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
          funlist.length != 0 ?         
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
              {
                assignlist.map(_item =>
                  <div key={_item.key} id={_item.assid} className="ass_wrap">
                    <div className='ass_title'>{_item.title}</div>
                    <div className='ass_title_second'>
                      <img className='stu_timeicon' src={time_icon}/>
                      start time : {_item.start_time}
                    </div>
                    <div className='ass_title_second'>
                      <img className='stu_timeicon' src={time_icon}/>
                      end time : {_item.end_time}
                    </div>
                    <div className='ass_content'>{_item.content}</div>
                    {
                      // item.ass_files.length !=0 ? <div key='1111'>{item.ass_files[0].title}{item.ass_files[0].assFileId}</div> :''
                        // item.ass_files.map((interm:any, index:number) => {
                        //   <div key={index}>1111111</div>
                          // <div className='downloadfile' onClick={downLoadAss} id={interm.assFileId} key={index.toString()}>
                          //   <img src={downloadicon} className="downloadicon"/>
                          //   Download file : {interm.title}
                          // </div>
                      //   })
                      //  :''
                    }
                    {
                      _item.ass_files.map((initem:any, index:number) => {
                        return(<div key={index} className="bb" id={initem.assFileId}>{initem.title}</div>)
                      })
                    }
                    
                        {/* <div className='downloadfile' onClick={downLoadAss} id='11' key='1'>
                          <img src={downloadicon} className="downloadicon"/>
                          Download file :
                        </div> */}
                    <div className='ass_upload'><img src={uploadicon} className='uploadicon'/>Drag files here to upload</div>
                  </div>
                )
              }
            </div>
          </div> : <div>You do not have any course, please enter 'Student Dashboard' to join courses.</div>
       }

      </div>
      <Modal title="Drop course" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to drop out of the course?</p>
      </Modal>
      <Footer />
    </div>
  );
}
