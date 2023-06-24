import'./index.less';
import { useState,useEffect } from "react";
import { useHistory } from 'umi'; 
import Navbar from "../../component/navbar"
import Footer from "../../component/footer"
import { List,ConfigProvider,Avatar,Input,Card,Calendar,Button,Pagination } from 'antd';
import { SmileOutlined} from '@ant-design/icons';
import {  HOST,CHANGEFILE_URL,getToken, HOST_STUDENT,COURSE_URL,HOST_COURSE} from '../utils/utils';
const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <SmileOutlined style={{ fontSize: 20 }} />
    <p>Data Not Found</p>
  </div>
);
const userDataString = localStorage.getItem('userData');
const userDataName = userDataString ? JSON.parse(userDataString) : null;
const StudentDashboardContent: React.FC = () => {
  return (
    <div style={{ margin: '100px',marginTop: '50px',fontFamily: 'Comic Sans MS',fontSize:'20px',color: 'rgb(25,121,254)'}}>
      <div>
      {userDataName ? (
                <>
                    Hi, {userDataName.username}
                    <br />
                    Welcome to our website ~~
                </>
            ) : (
                <>Hi,
                <br />
                Welcome to our website ~~</>
            )}
      </div>
    </div>
  );
};
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
];
const onSearch = (value: string) => console.log(value);
const { Search } = Input;
const { Meta } = Card;


export default function IndexPage() {
  const history = useHistory();
  const gotostudent = (e:any) => {
    // console.log(e.target);
    
    history.push(`/studentcourse?courseid=${e.target.id}`);
    // history.push({pathname: '/studentcourse', search: 'test=22222'});
  }


  const [customize, setCustomize] = useState(true);
  const [userData, setUserData] = useState({});
  const token = getToken()
  const [hovered, setHovered] = useState(false);
  const [curriculum, setCurriculum] = useState([]);
  const [courseId, setCourseId] = useState<string[]>([]);
  const [courseDetails, setCourseDetails] = useState<Array<any>>([]);
  const courses = courseDetails.map(detail => ({
    src: detail.course.cover,
    title: detail.course.title,
    date: detail.course.createdAt,
    id: detail.course.courseId,
  }));


  function updateUserData(newUserData:any) {
    localStorage.setItem('userData', JSON.stringify(newUserData));
  }

  useEffect(() => {
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
        throw new Error(res.message)
      }
      setUserData(res.data.user)
      localStorage.setItem('userData', JSON.stringify(res.data.user));
    })
    .catch(error => {
      alert(error.message);
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
        throw new Error(res.message)
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
      alert(error.message);
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
      throw new Error(data.message);
    }
  };

  const allCourseDetails = courseId.map(id => fetchCourseDetails(id));
  Promise.all(allCourseDetails)
    .then(details => setCourseDetails(details))
    .catch(error => console.error(error));
}, [courseId, token]);


  useEffect(() => {
    console.log(courseDetails);
}, [courseDetails]);

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
      <div className='container_intro'>
      <Meta className='intro-card'
          avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" className="square-avatar"
          style={{  width: '100%', height: '100%', objectFit: 'cover'  }} />}
          title={<span  onClick={gotostudent} id="9fc5ed0e31166ccb19a4d0e7a9f2b1b6" className='card-title' style={{ fontSize: '1.5em' }}>Card title</span>}
          description={<span className='card-description' style={{ fontSize: '1em' }}>This is the description</span>}
        />
      </div>
      <div className='container_timeline'> 
      <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} className="square-avatar" />}
          title={<a href="https://ant.design">{item.title}</a>}
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
      </List.Item>
    )}
  />
  </div>
      </div>
      </ConfigProvider>
      <div className="recently_select_course" style={{ margin: '100px',marginTop: '50px',marginBottom: '50px',fontSize:'20px',color: 'rgb(25,121,254)'}}>
        Recently accessed courses
      </div>
      <div className='course-container'>
      {courses.map((course, index) => (
        <div className='course-card' key={index} onClick={gotostudent} id={course.id} style={{cursor:'pointer'}}>
          <Avatar src={course.src} className="square-avatar-course"></Avatar>
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
    <div className='card'
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}>
     <Card 
        className={`custom-card ${hovered ? 'hovered' : ''}`} 
        style={{ width: '100%', height:'70%', marginTop: '40px',backgroundColor: '#ffffff'}}
      >
        <Meta
          avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" className="square-avatar"
          style={{ width: '40%', height: 'auto' }} />}
          title={<span className='card-title' style={{ fontSize: '1.5em' }}>Card title</span>}
          description={<span className='card-description' style={{ fontSize: '1em' }}>This is the description</span>}
        />
        <div className={`button-container ${hovered ? 'show' : ''}`}>
          <Button type="primary" size="large">Join</Button>
          <Button type="primary"size="large">View</Button>
        </div>
      </Card>
      <Card className="custom-card" style={{ width: '100%', height:'70%', marginTop: '40px'}}>
        <Meta
          avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" className="square-avatar"
          style={{ width: '40%', height: 'auto' }} />}
          title={<span className='card-title' style={{ fontSize: '1.5em' }}>Card title</span>}
          description={<span className='card-description' style={{ fontSize: '1em' }}>This is the description</span>}
        />
      </Card>
      <Card className="custom-card" style={{ width: '100%', height:'70%', marginTop: '40px'}}>
        <Meta
          avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" className="square-avatar"
          style={{ width: '40%', height: 'auto' }} />}
          title={<span className='card-title' style={{ fontSize: '1.5em' }}>Card title</span>}
          description={<span className='card-description' style={{ fontSize: '1em' }}>This is the description</span>}
        />
      </Card>
      <div className='course-Page'>
      <Pagination defaultCurrent={1} defaultPageSize={3} total={1000} />
      </div>
      </div>
    <div className='calendar'>
      <Calendar fullscreen={false}/>
    </div>
    </div>
    <Footer />
    </div>
    </div>
  </div>
  );
}