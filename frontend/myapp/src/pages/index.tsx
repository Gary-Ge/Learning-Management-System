import'./index.less';
import { useState,useEffect } from "react";
import { useHistory } from 'umi';
import Navbar from "../../component/navbar"
import Footer from "../../component/footer"
import { List,ConfigProvider,Avatar,Input,Card,Calendar,Button,Pagination,message } from 'antd';
import { SmileOutlined} from '@ant-design/icons';
import {  HOST,CHANGEFILE_URL,getToken, HOST_STUDENT,COURSE_URL,HOST_COURSE} from '../utils/utils';
import moment from 'moment';
import intro from '../../../images/online_course.png';

import type { Dayjs } from 'dayjs';
function checkToken() {
  const token = localStorage.getItem('token');
  if (!token) {
      return false; // Token not found
  }
  return true;
}
const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <SmileOutlined style={{ fontSize: 20 }} />
    <p>Data Not Found</p>
  </div>
);
const StudentDashboardContent: React.FC = () => {

  const userDataString = localStorage.getItem('userData');
  const userDataName = userDataString ? JSON.parse(userDataString) : null;

  return (
    <div style={{ marginLeft: '110px',fontFamily: 'Comic Sans MS',fontSize:'20px',color: 'rgb(25,121,254)'}}>
      <div>
      {/*{userDataName ? (
                <>
                    Hi,
                    <br />
                    Welcome to our website ~~
                </>
            ) : (*/}
                <>Hi,
                <br />
                Welcome to our website ~~</>
            {/* )} */}
      </div>
    </div>
  );
};
const data = [
  {
    title: 'Comp9900',
    description :<div>
    Due time is Thursday, June 29th 2023, <br />
    Don't forget to submit
  </div>
  },
  {
    title: 'Comp9901',
    description :<div>
    Due time is Sunday,July 2nd 2023, <br />
    Don't forget to submit
  </div>
  },
  {
    title: 'Comp9902',
    description :<div>
    Due time is Wednesday,July 5th 2023, <br />
    Don't forget to submit
  </div>
  },
];
const { Search } = Input;
const { Meta } = Card;


export default function IndexPage() {
  const history = useHistory();
  const gotostudent = (id: string,title: string) => {
    history.push(`/studentcourse?courseid=${id}&title=${title}`);
  }
  const gotoviewstudent = (id: string,title: string) => {
    history.push(`/viewstudentcourse?courseid=${id}&title=${title}`);
  }

  const [customize, setCustomize] = useState(true);
  const [userData, setUserData] = useState({});
  const token = getToken()
  const [hoveredId, setHoveredId] = useState("");
  const [curriculum, setCurriculum] = useState([]);
  const [courseId, setCourseId] = useState<string[]>([]);
  const [courseDetails, setCourseDetails] = useState<Array<any>>([]);
  const [allcourseDetails, setAllCourseDetails] = useState<Array<any>>([]);
  const [firstcourseDetails, setFirstCourseDetails] = useState<Array<any>>([{cover: '',title:'',date:'',description:''}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [allDue,setAllDue] = useState([])
  const [nodueflag, setnodueflag] = useState(true)
  const courses = courseDetails.map(detail => ({
    src: detail.course.cover,
    title: detail.course.title,
    date: detail.course.createdAt,
    id: detail.course.courseId,
  }));
  const allcourses = allcourseDetails.map(detail => ({
    src: detail.cover,
    title: detail.title,
    date: detail.createdAt,
    id: detail.courseId,
    description: detail.description,
    author: detail.creator.username
  }));

  function updateUserData(newUserData:any) {
    localStorage.setItem('userData', JSON.stringify(newUserData));
  }

  const dateCellRender = (value: Dayjs) => {
    // const listData = getListData(value);
    let listData:any = []
    allDue.map((item:any) => {
      if (item.time.substring(8,9) == '0') {
        if (item.time.substring(9) == value.date().toString() && item.time.substring(5,7) == selectedDate.substring(5,7)) { // selectedDate.substring(5,7) // moment().format('YYYY-MM-DD').substring(5,7)
          listData = [{content: item.title}]
        }
      } else {
        if (item.time.substring(8) == value.date().toString() && item.time.substring(5,7) == selectedDate.substring(5,7)) { // selectedDate.substring(5,7) // moment().format('YYYY-MM-DD').substring(5,7)
          listData = [{content: item.title}]
        }
      }
    })

    return (
      <ul className="events">
        {listData.map((item:any) => (
          // <li key={item.content}>
            <div key={item.content} className="red"></div> // style={{, width:'25px', height:'5px'}}
        ))}
      </ul>
    );
  };


  // const cellRender = (current: Dayjs, info: CellRenderInfo<Dayjs>) => {
  //   if (info.type === 'date') return dateCellRender(current);
  //   if (info.type === 'month') return monthCellRender(current);
  //   return info.originNode;
  // };
  // get calendar
  const getCalendar = () => {
    fetch(`${HOST_STUDENT}/calendar`, {
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
      console.log('calendar',res.data.courses);
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
      console.log('calendar all_due',all_due);
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
  }
  useEffect(() => {
    getCalendar();
    fetch(`${HOST}${CHANGEFILE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        message.error(res.message)
        return
      }
      setUserData(res.data.user)
      localStorage.setItem('userData', JSON.stringify(res.data.user));
    })
    .catch(error => {
      // alert(error.message);
    });  
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
        message.error(res.message)
        return
      }
      setCurriculum(res.data.courses);
      let courseIds = [];
      if(res.data.courses.length > 0){
        for(let i = 0; i < res.data.courses.length; i++){
          courseIds.push(res.data.courses[i].courseId);
        }
        setCourseId(courseIds);
      }
    })
    .catch(error => {
      console.log(error.message);
    });  
    fetch(`${HOST_COURSE}${COURSE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        message.error(res.message)
        return
      }
      setAllCourseDetails(res.data.courses)
      // console.log('+++',res.data.courses[0]);
      if (res.data.courses.length > 0){
        setFirstCourseDetails([res.data.courses[0]])
      }
      
    })
    .catch(error => {
      console.log(error.message);
    }); 
    
  },[]);
  updateUserData(userData);

// ...

useEffect(() => {
  const fetchCourseDetails = async (id: string) => {
    const response = await fetch(`/service-edu/edu-course/course/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
       message.error(data.message);
       return
    }
  };

  const allCourseDetails = courseId.map(id => fetchCourseDetails(id));
  Promise.all(allCourseDetails)
    .then(details => setCourseDetails(details))
    .catch(error => console.error(error));
}, [courseId, token]);

useEffect(() => {
  console.log(firstcourseDetails);
}, [firstcourseDetails]);

const onSearch = (value: string) => {
  console.log('search', value);
  fetch(`${HOST_COURSE}${COURSE_URL}/${value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(res => {
    if (res.code !== 20000) {
      message.error(res.message)
      return
    }
    console.log('search', res);
    setAllCourseDetails(res.data.courses);
    setCurrentPage(1); // todo
  })
  .catch(error => {
    console.log(error.message);
  });
}
useEffect(() => {
  // Check the token immediately when the component mounts
  if (!checkToken()) {
    message.warning('you are not login')
    history.push('/login');
  }
},[token])

  return (
      <div className='body_user'>
      <Navbar />
      <div className='welcome_div'>
        <div className='welcome_container'>
          <div className='welcome'>
            {<StudentDashboardContent />}
          </div>
        </div>
      </div>
      <div className='biggest-box'  style = {{fontFamily:'Comic Sans MS'}}>
      <ConfigProvider renderEmpty={customize ? customizeRenderEmpty : undefined}>
      <div className='timeline'>
        <div className='container_intro' style={{cursor:'pointer'}} onClick={() => gotoviewstudent(firstcourseDetails[0].courseId,firstcourseDetails[0].title)}>
        <Meta className='intro-card'
          avatar={<Avatar src={ firstcourseDetails.length >0&&firstcourseDetails[0].cover ? firstcourseDetails[0].cover :intro } className="square-avatar"
          style={{  width: '100%', height: '100%', objectFit: 'cover'  }} />}
          title={<span id="" className='card-title' style={{ fontSize: '1.5em' }} >{firstcourseDetails.length&&firstcourseDetails[0].title?firstcourseDetails[0].title: 'No Classes'}</span>}
          description={<span className='card-description' style={{ fontSize: '1em' }}>{firstcourseDetails[0].createdAt}<br />{firstcourseDetails[0].description}</span>
            }
            />
        </div>
        <div className='container_timeline'> 
          <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`data:image/png;base64,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`} className="square-avatar" />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
        </div>
      </div>
      </ConfigProvider>
      <div className={courses.length == 0 ? 'displaynon': ''}>
        <div className="recently_select_course" style={{ margin: '100px',marginTop: '30px',marginBottom: '30px',fontSize:'20px',color: 'rgb(25,121,254)'}}>
          Recently enrolled courses
        </div>
        <div className='course-container'>
          {courses.map((course, index) => (
            <div className='course-card' key={index} onClick={() => gotostudent(course.id,course.title)} style={{cursor:'pointer'}}>
              <Avatar src={course.src} className="square-avatar-course" style={{height:'250px',width:'250px'}}></Avatar>
              {course.title && (
                <div className="overlay">
                  <div className="overlay-content">
                    <span>{course.title}</span>
                    <span>{course.date}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Search
      className="search-component"
      placeholder="input search text"
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
    />
    <div>
    <div className='card_and_calendar'>
    <div className='card'>
    {allcourses
    .slice((currentPage - 1) * 3, currentPage * 3)
    .map((course) => (
      <Card 
        key={course.id}
        className={`custom-card ${hoveredId === course.id ? 'hover' : ''}`}
        style={{ width: '100%', height:'70%', marginTop: '40px',backgroundColor: '#ffffff'}}
        onMouseEnter={() =>  {
          const newHoveredId = course.id;
          setHoveredId(newHoveredId)
        }}
        onMouseLeave={() =>  setHoveredId("")}>
        <Meta
          avatar={
            <Avatar 
              src={course.src} 
              className="square-avatar"
              style={{ width: '200px', height: '130px', marginRight:'20px' }} 
            />
          }
          title={<span className='card-title' style={{ fontSize: '1.5em' }}>{course.title}</span>}
          description={
          <div>
            <p style={{ fontSize: '1em' }}>{course.date}    <span style={{marginLeft: '10px'}}>{course.author}</span></p>
            <p style={{ fontSize: '1em', marginBottom: '0px', wordWrap: 'break-word', textOverflow: 'ellipsis', overflow: 'hidden', height: '45px'}}>{course.description}</p>
          </div>}
        />
        <div className={`button-container ${hoveredId === course.id ? 'show' : ''}`}>
          <Button type="primary" size="large" onClick={() => {
          fetch(`${HOST_STUDENT}/student/${course.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`
          }
        })
        .then(res => res.json()) 
        .then(res => {
          if (res.code !== 20000) {
            message.error(res.message)
            return
          }
          message.success('Join the Class successfully' );
          gotostudent(course.id, course.title);
        })
        .catch(error => {
          message.error(error.message);
        });} 
        }>Join</Button>
          <Button type="primary" size="large" onClick={() => gotoviewstudent(course.id,course.title)}>View</Button>
        </div>
      </Card>
    ))}
  <div className='course-Page'>
    <Pagination 
      current={currentPage}
      defaultPageSize={3} 
      total={allcourses.length} 
      onChange={(page) => setCurrentPage(page)}
      pageSizeOptions={[3]}
    />
   </div>
    </div>
    <div className='calendar_and_exp'>
        <div className='calendar'>
        <Calendar fullscreen={false} onSelect={date => setSelectedDate(date.format('YYYY-MM-DD'))} dateCellRender={dateCellRender}/>  
        {/* dateCellRender={dateCellRender} */}
        </div>
        <div className='exp'>
          <p>{selectedDate}</p>
          {
            allDue.map((item:any, index)=> {
              if(item.time == selectedDate) {
                return(
                  <div key={index}>{item.title}</div>
                )
              }
            })
          }
          {
            <div className='no_more_due'>-No More Dues-</div>
          }
        </div>
      </div>
    </div>
    <Footer />
    </div>
    </div>
  </div>
  );
}