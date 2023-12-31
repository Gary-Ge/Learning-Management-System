import'./studentcourse.less';
import { useState, useEffect } from "react";
import Navbar from "../../component/navbar";
import Footer from "../../component/footer";
import Chatbot from "../../component/chatbot";
import { Button, Modal, message, Input } from 'antd';
import { useLocation, useHistory } from 'umi';
import { HOST_STUDENT,COURSE_URL,getToken, HOST_COURSE, COURSE_DETAIL_URL,HOST_SECTION, HOST_RESOURCE } from '../utils/utils';
import stu_icon_1 from '../../../images/stu_icon_1.png';
import stu_icon_7 from '../../../images/stu_icon_7.png';
import gototopicon from '../../../images/gototop.png';

let data:any = [];

const course_outline = [
  { outline_title: '', author: '',
  category: '', coverimg: '', time: '',
  courseid : '',
  outline_content: "",
}];

export default function IndexPage() {
  let fun_list:any = [{
    key: '0', title: 'Outline', is_selected: true, img_link: stu_icon_1
  },{
    key: '1', title: 'Chatbot', is_selected: false, img_link: stu_icon_7
  }]
  const { TextArea } = Input;
  const history = useHistory();
  // const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isjoinModalOpen, setjoinIsModalOpen] = useState(false);
  const [viewbtnshow, setviewbtnshow] = useState(true);
  const [datalist,setdataLists]= useState(data); // tabs course title
  const [funlist,setfunLists]= useState(fun_list);
  const [courseoutline,setcourseoutline]= useState(course_outline); // function to change course outline

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  let courseid: any = query.get('courseid');

  const token = getToken();
  useEffect(() => {
    // get course outline
    getcourseinfo(courseid.toString());
    getallcourse(); // get all course to determin the wrong jump
    window.scrollTo(0, 0);
  },[]);
  // get course list -> wrong jumpings need to go to student course page
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
      let courselist = res.data.courses;
      let courseidlist: any[] = [];
      courselist.map((item: any) => {
        courseidlist.push(item.courseId);
      })
      if (courseidlist.indexOf(courseid) != -1) { // enroll 
        // show modal, enter button to gotostudentcourse
        showModal();
        setviewbtnshow(false);
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
      // tab titles
      setdataLists([{
          key : '0',
          id: res_data.courseId,
          title: res_data.title,
          is_selected: true,
          isenroll: false
      }]);
      // tab content left list
      fun_list.map((item:any)=> {
        item.is_selected = false
        if (item.key == '0') {
          item.is_selected = true
        }
      })
      setfunLists([...fun_list]);
    })
    .catch(error => {
      console.log(error.message);
    });
  };

  // join a class
  const joincourse = () => {
    showjoinModal();
  }
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    history.push(`/studentcourse?courseid=${courseid}&title=`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // join course modal
  const showjoinModal = () => {
    setjoinIsModalOpen(true);
  };

  const joinhandleOk = () => {
    fetch(`${HOST_STUDENT}/student/${courseid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.code == 20000 || res.code == 20001) { 
        setjoinIsModalOpen(false);
        history.push(`/studentcourse?courseid=${courseid}&title=`);
      } else {
        throw new Error(res.message)
      }
    })
  };

  const joinhandleCancel = () => {
    setjoinIsModalOpen(false);
  };
// chatbot message
  const info = (key:string) => {
      fun_list.map((item:any)=> {
        item.is_selected = false
        if (item.key == key) {
          item.is_selected = true
        }
      })
      setfunLists([...fun_list]);
  };
  
  const gotocoursepage = () => {
    history.push(`/studentcourse?courseid=${courseid}&title=`);
  }
  const gototop = () => {
    window.scrollTo(0, 0);
}

  return (
    <div className='stu_wrap'>
      <Navbar />
      {/* tab title */}
      <div className='stu_title'>
        <div className='stu_title_list'>
          {datalist.map( (course_item:any)  => 
          <div className='stu_list_header' key={course_item.title}>
            <p key={course_item.id} id={course_item.key} className={course_item.is_selected ? "selected": ""}>{course_item.title}</p>
          </div> )}
        </div>
      </div>
      {/* tab content */}
      <div className='stu_content'>
        {/* tab content left list */}
        <div className='stu_left_list'>
          {
            funlist.map((item:any) => <div className={item.is_selected ? 'stu_active stu_left_list_title': 'stu_left_list_title'} id={item.key} key={item.key} onClick={() => info(item.key)}>
            <img src={item.img_link} className="stu_icon"/>{item.title}</div>)
          }
          {
            viewbtnshow ? <Button type="primary" className='btn' onClick={joincourse}>Join</Button> : <Button type="primary" className='btn' onClick={gotocoursepage}>course page</Button>
          }
          
        </div>
        {/* tab content right content: outline */}
        {
          funlist[0].is_selected ? <div className='stu_right_content'>
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
        </div>:""
        }
        {
          funlist[1].is_selected ? 
          <Chatbot/> : ""
        }
      </div>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>The course is already registered, please go to the course page.</p>
      </Modal>
      <Modal open={isjoinModalOpen} onOk={joinhandleOk} onCancel={joinhandleCancel}>
        <p>Do you want to join the course?</p>
      </Modal>
      <div><img src={gototopicon} className="gotopicon" onClick={gototop}/></div>
      <Footer />
    </div>
  );
}
