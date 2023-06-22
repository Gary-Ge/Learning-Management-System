import'./index.less';
import { useState,useEffect } from "react";
import { useHistory } from 'umi'; 
import Navbar from "../../component/navbar"
import { List,ConfigProvider,Avatar,Input,Card,Calendar,Button} from 'antd';
import { SmileOutlined} from '@ant-design/icons';
import {  HOST,CHANGEFILE_URL,getToken} from '../utils/utils';
const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <SmileOutlined style={{ fontSize: 20 }} />
    <p>Data Not Found</p>
  </div>
);

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
const courses = [
  { 
    src: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1", 
    title: "Computer System", 
    date: "11/01/2022" 
  },
  { 
    src: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1", 
    title: "Computer System", 
    date: "11/01/2022" 
  },{ 
    src: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1", 
    title: "Computer System", 
    date: "11/01/2022" 
  },{ 
    src: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1", 
    title: "Computer System", 
    date: "11/01/2022" 
  },{ 
    src: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1", 
    title: "Computer System", 
    date: "11/01/2022" 
  },{ 
    src: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1", 
    title: "Computer System", 
    date: "11/01/2022" 
  },
];

export default function IndexPage() {
  const history = useHistory();
  const gotostudent = (e:any) => {
    // console.log(e.target);
    
    console.log(e.target.id);
    history.push(`/studentcourse?courseid=${e.target.id}`);
    // history.push({pathname: '/studentcourse', search: 'test=22222'});
  }


  const [customize, setCustomize] = useState(true);
  const [userData, setUserData] = useState({});
  const token = getToken()
  const [hovered, setHovered] = useState(false);

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
      console.log(error.message);
    });  
  },[]);
  updateUserData(userData);

  return (
      <div className='body_user'>
      <Navbar />
      <div>welcome</div>
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
      <div className="recently_select_course" style={{ margin: '100px',fontSize:'20px',color: 'rgb(25,121,254)'}}>
        Recently accessed courses
      </div>
      <div className='course-container'>
      {courses.map((course, index) => (
        <div className='course-card' key={index}>
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
      </div>
    <div className='calendar'>
      <Calendar fullscreen={false}/>
    </div>
    </div>
    </div>
    </div>
  </div>
  );
}