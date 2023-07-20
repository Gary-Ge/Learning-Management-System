import'./studentcourse.less';
import LinkBoardStu from "./LinkBoardStu";
import { useState, useEffect } from "react";
import Navbar from "../../component/navbar"
import Footer from "../../component/footer"
import { Input, Button, Modal, message, Upload,Radio,Space,Checkbox,Form } from 'antd';
import type { UploadProps } from 'antd';
import { useLocation, useHistory } from 'umi';
import { ClockCircleOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
import { HOST_STUDENT,COURSE_URL,getToken, HOST_COURSE,
  COURSE_DETAIL_URL,HOST_SECTION, HOST_RESOURCE, HOST_ASSIGNMENT } from '../utils/utils';
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
import gototopicon from '../../../images/gototop.png';


let data:any = [
  // {
  //   key: '0', title: '',is_selected: true, id: "111", isenroll: true
  // },
];




const fun_list = [
  {
    key: '0', title: 'Outline', is_selected: true, img_link: stu_icon_1
  },
  {
    key: '1', title: 'Materials', is_selected: false, img_link: stu_icon_3
  },
  {
    key: '2', title: 'Quizzes', is_selected: false, img_link: stu_icon_5
  },
  {
    key: '3', title: 'Assignments', is_selected: false, img_link: stu_icon_6, 
    ass_list:[{key: '0', id: '', title: 'ass1'},{key: '1', id: '', title: 'ass2'}]
  },
  {
    key: '4', title: 'Join Class', is_selected: false, img_link: stu_icon_2
  },
  {
    key: '5', title: 'Forums', is_selected: false, img_link: stu_icon_4
  },
];
  // {
  //   key: '1', title: 'Join Class', is_selected: false, img_link: stu_icon_2
  // },

  // {
  //   key: '3', title: 'Forums', is_selected: false, img_link: stu_icon_4
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
let quiz_list = [
  {
    key: '0',quizid:'',title:'',start: '',end: '',limitation:'',
    is_selected: false,
	question_list: [
  {
    key: '0',questionid:'',title:'',type:0,cover:'',shortanswer:'',mark:0,
    options: [
      { id: 0, value: '' },
      { id: 1, value: ''},
      { id: 2, value: ''},
      { id: 3, value: ''},
      { id: 4, value: ''},
      { id: 5, value: ''},
    ],
  }
]
  }
]


let assign_list = [
  {
    key: '0', assid: '', title: '', start_time: '', end_time: '',
    content: '', is_selected: false,
    ass_files: []as Array<List>,
    submits:[]as Array<List>,
  }
];
let stream_list = [
  {
    key: '0', streamId: '', title: '', inProgress: '',
    is_selected: false,
  }
];


export default function StudentCoursePage() {
  // const [isenrollflag, setisenrollflag] = useState(true);
  const token = getToken();
  const { Dragger } = Upload;
  const [fileList, setFileList] = useState<any[]>([]);
  const [datalist,setdataLists]= useState(data); // tabs course title
  const [funlist,setfunLists]= useState(fun_list);
  const [courseoutline,setcourseoutline]= useState(course_outline); // function to change course outline
  const [materialslist,setmaterialLists]= useState(materials_list); // function to change materials
  const [assignlist,setassignmentLists]= useState(assign_list);
  const [quizlist,setquizLists]= useState(quiz_list);
  const [streamlist,setstreamLists]= useState(stream_list);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz_left_list_show,set_quiz_left_list_show]= useState(false);
  const [ass_left_list_show,set_ass_left_list_show]= useState(false);
  const [stream_left_list_show,set_stream_left_list_show]= useState(false);
  const [startedQuiz, setStartedQuiz] = useState<string | null>(null);
  const [buttonTexts, setButtonTexts] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<null | number>(null);

  const props = (key:number, id:string) => {
    // console.log('++key', key);
    // console.log('fileList', fileList);
    return {
      onRemove: (file:any) => {
        const index = fileList[key].indexOf(file);
        const newFileList = fileList[key].slice(); 
        newFileList.splice(index, 1); 
        fileList[key] = newFileList;
        setFileList([...fileList]);
      },
      beforeUpload: (file:any) => {
        console.log('++file', file);
        fileList[key].push(file);
        let copyfilelist = fileList.slice();
        console.log('copyfilelist', copyfilelist);
        // setFileList([...fileList, file]);
        setFileList([...copyfilelist]);
        console.log('fileList', fileList);
        return false;
      },
      fileList: fileList[key],
    };
  }
  
  const headers = new Headers();
  headers.append('Authorization',`Bearer ${token}`);
  const upload = (assid:string, key:string) => {
    const formData = new FormData(); 
    console.log('fileList', fileList);
    console.log('fileList upload',fileList);
    fileList[Number(key)].forEach((file:any) => {
      formData.append('files', file); 
    });
    
    // return;
    fetch(`${HOST_STUDENT}/submit/${assid}`, {
    method: 'POST', 
    headers: headers, 
    body: formData
    }) .then(res => res.json()).then(res => {
      if (res.code == 20000) {
        // window.alert(res.message);
        message.success(`files uploaded successfully.`);
        fileList[Number(key)] = []
        setFileList([... fileList]);
        // getallassginment submits
        datalist.map((item:any)=>{
          if (item.is_selected) {
            console.log(item.id);
            getallassignments(item.id, key);
          }
        })
      }
    })
    .catch(err => { console.log(err);}) }

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  let courseid: any = query.get('courseid');

  useEffect(() => {
    // getall course -> tabs title
    getallcourse();
    window.scrollTo(0, 0);
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
        // throw new Error(res.message)
        message.error(res.message);
        return
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
      let currentcourseid = '';
      if (courseidlist.indexOf(courseid) == -1) { // no enroll 
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
        currentcourseid = courselist[0].courseId;

      } else { // all enroll
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
        currentcourseid = courseid.toString();
      }
      getcourseinfo(currentcourseid);
      // getallsections(currentcourseid); // get all sections
      getallquizzes(currentcourseid, '0');
      getallassignments(currentcourseid, '0');// get all assignment
      getallstreams(currentcourseid, '0');// get all assignment
      fun_list.map(item => {
        item.is_selected = false;
      });
      fun_list[0].is_selected = true;
      setfunLists([...fun_list]);
      setdataLists([...data]);
      set_quiz_left_list_show(false);
      set_ass_left_list_show(false);
      set_stream_left_list_show(false);
      // console.log('++data',data);
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
  // const getvideourl = (resourceId:string, inneritem:any)=> {
  //   fetch(`${HOST_RESOURCE}/video/${resourceId}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       "Authorization": `Bearer ${token}`
  //     }
  //   })
  //   .then(res => res.json())
  //   .then(res => {
  //     if (res.code !== 20000) {
  //       // throw new Error(res.message)
  //       message.error(res.message);
  //       return
  //     }
  //     console.log('video url:',res.data.auth.playURL);
  //     inneritem.url = res.data.auth.playURL
  //   });
  // }
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
        // throw new Error(res.message)
        message.error(res.message);
        return
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
              // let videolink:any
              // getvideourl(inneritem.resourceId, inneritem)

              fetch(`${HOST_RESOURCE}/video/${inneritem.resourceId}`, {
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
                console.log('video url:',res.data.auth.playURL);
                inneritem.url = res.data.auth.playURL
                setmaterialLists([...materials_list]);
                console.log("getallsections+++materials_list:", materials_list);
              });
            }
          })
        } else {
          setmaterialLists([...materials_list]);
        }
      });

      
    })
    .catch(error => {
      console.log(error.message);
    }); 
  };
  // get all quizzes
  const getallquizzes = (courseid:string, original_key: string) => {
    fetch(`/service-edu/edu-quiz/quiz/course/${courseid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(async res => {
      console.log('get all quizzes');
      if (res.code !== 20000) {
        throw new Error(res.message)
      }

      let res_quiz = res.data.quizzes;
      let fetchedQuizList = await Promise.all(res_quiz.map(async (item:any, idx:string)=>{
        
        // Fetch the questions for this quiz
        let response = await fetch(`/service-edu/edu-question/questions/${item.quizId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`
          }
        });
        
        let question_list = [];

        if(response.ok) {
          let questionData = await response.json(); 

          question_list = questionData.data.questions.map((question:any,idx:number) => {
            let options = [
              { id: 0, value: question.a },
              { id: 1, value: question.b },
              { id: 2, value: question.c},
              { id: 3, value: question.d },
              { id: 4, value: question.e},
              { id: 5, value: question.f},
            ].filter(option => option.value !== '');
            return {
              key: idx,
              questionid: question.questionId,
              title: question.content, 
              type: question.type,
              cover: question.cover,
              shortanswer: question.shortAnswer,
              mark: question.mark,
              options:options,
            };
          });
        } else {
          console.error(`Error in fetching questions for quizid: ${item.quizId}`);
        }

        return {
          key: idx,
          quizid: item.quizId,
          title: item.title,
          start: item.start,
          end: item.end,
          limitation: item.limitation,
          is_selected: idx == original_key,
          question_list: question_list  // Add the question_list to the quiz object
        };
      }));

      setquizLists(fetchedQuizList);
      console.log('no',fetchedQuizList)
    })
    .catch(error => {
      console.log(error.message);
    }); 
  };

  // get all assignments
  const getallassignments = (courseid:string, original_key: string) => {
    fetch(`${HOST_STUDENT}/assignments/${courseid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log('get all assignments');
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      // if (res.data.assignments.length == 0) {
      //   setassignmentLists([]);
      // } else {
      let  ass_fileList: never[][] = []
      assign_list = []
      let res_ass = res.data.assignments;
      res_ass.map((item:any, idx:string)=>{
        ass_fileList.push([])
        assign_list.push({
          key: idx,
          assid: item.assignmentId,
          title: item.title,
          start_time: item.start,
          end_time: item.end,
          content: item.description,
          ass_files: item.assFiles,
          submits: item.submits,
          is_selected: idx == original_key
        });
      });
      setFileList([...ass_fileList]);
      setassignmentLists([...assign_list]);
      // console.log('assign_list', assign_list);
    })
    .catch(error => {
      console.log(error.message);
    }); 
  };

  // get all streams
  const getallstreams = (courseid:string, original_key: string) => {
    fetch(`http://175.45.180.201:10900/service-stream/stream-basic/streams/${courseid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log('get all streams');
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      // if (res.data.assignments.length == 0) {
      //   setassignmentLists([]);
      // } else {
      stream_list = []
      let res_stream = res.data.streams;
      res_stream.map((item:any, idx:string)=>{
        stream_list.push({
          key: idx,
          streamId: item.streamId,
          title: item.title,
          inProgress: item.inProgress,
          is_selected: idx == original_key
        });
      });
      setstreamLists([...stream_list]);
      // console.log('stream_list', stream_list);
    })
    .catch(error => {
      console.log(error.message);
    }); 
  };

  // get assignment download file
  const getassigndownloadlink = (assFileId:string) => {
    fetch(`${HOST_ASSIGNMENT}/assignment/assFile/${assFileId}`, {
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
      console.log('assurl',res.data.fileUrl);
      const w:any = window.open("about:blank");  
      w.location.href = res.data.fileUrl;
    })
  }

  // click tabs title
  const onclickcourse = (idx:string, id:string) => {
    setIsStreamOpen(false);
    data.map((item:any) => {
      item.is_selected = false;
    });
    data[idx].is_selected = true;
    setdataLists([...data]);
    fun_list.map(item => {
      item.is_selected = false;
    });
    fun_list[0].is_selected = true;
    setfunLists([...fun_list]);
    set_quiz_left_list_show(false);
    set_ass_left_list_show(false);
    set_stream_left_list_show(false);
    // clear materials content
    setmaterialLists([]);
    // getallsections(id); // get materials
    getallquizzes(id, '0');
    getallassignments(id, '0'); // update assignment
    getallstreams(id, '0'); // update stream
    getcourseinfo(id); // update course outline
  };
  const history = useHistory();
  // click left list
  const onclicklist = (e:any) => {
    setIsStreamOpen(false);
    console.log(e.target.id);
    funlist.map(item => {
      item.is_selected = false;
    });
    funlist[e.target.id].is_selected = true;
    setfunLists([...funlist]);
    // get current course id
    let current_course_id = ''
    datalist.map((item:any) => {
      if (item.is_selected){
        current_course_id = item.id
      }
    })
    if (e.target.id == '1') { // materials
      getallsections(current_course_id);
    }
    if(e.target.id == '2'){ // assignment show
      set_quiz_left_list_show(!quiz_left_list_show);
    } else {
      set_quiz_left_list_show(false);
    }
    if(e.target.id == '3'){ // assignment show
      set_ass_left_list_show(!ass_left_list_show);
    } else {
      set_ass_left_list_show(false);
    }
    if(e.target.id == '4'){ // assignment show
      set_stream_left_list_show(!stream_left_list_show);
    } else {
      set_stream_left_list_show(false);
    }
    if(e.target.id == '5'){
      history.push(`/studentforums?courseid=`);
    }
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
    })
  }
  // download materials 1
  const downLoadMaterial = (e:any) => {
    console.log('resourceid',e.target.id);
    getsourcelink(e.target.id);
  };
  // download assignment
  const downLoadAss = (e:any) => {
    console.log('download',e.target.id);
    getassigndownloadlink(e.target.id);
  };
  const downLoaduploadedfile = (e:any) => {
    console.log('download uploadedfile',e.target.id);
    // todo
    getsubmitfile(e.target.id);
  }
  const getsubmitfile = (submitid:string) => {
    fetch(`${HOST_STUDENT}/submit/${submitid}`, {
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
      console.log('submiturl',res.data.fileUrl);
      const w:any = window.open("about:blank");  
      w.location.href = res.data.fileUrl;
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
        getallcourse();
        // getcourseinfo(courseid.toString(), true);
        setIsModalOpen(false);
      }
    })
  }
  const showquizcontent = (e:any) => {
    console.log('hh',e.target.id);
    quizlist.map(item => {
      item.is_selected = false;
    });
    quizlist.map(item => {
      if (item.quizid == e.target.id) {
        item.is_selected = true
      }
    })
    setquizLists([...quizlist]);
    window.scrollTo(0, 0);
  }
  // onclick to show ass content
  const showasscontent = (e:any) => {
    console.log();
    assign_list.map(item => {
      item.is_selected = false;
    });
    assign_list.map(item => {
      if (item.assid == e.target.id) {
        item.is_selected = true
      }
    })
    setassignmentLists([...assign_list]);
    window.scrollTo(0, 0);
  }
  // onclick to show stream content
  const [isStreamOpen, setIsStreamOpen] = useState(false);
  const showstreamcontent = (e:any) => {
    setIsStreamOpen(true);
    let current_course_id = ''
    datalist.map((item:any) => {
      if (item.is_selected){
        current_course_id = item.id
      }
    })
    getallstreams(current_course_id, '0'); // update stream
    console.log(e.target.id);
    console.log();
    stream_list.map(item => {
      item.is_selected = false;
    });
    stream_list.map(item => {
      if (item.streamId == e.target.id) {
        item.is_selected = true
      }
    })
    setstreamLists([...stream_list]);
    window.scrollTo(0, 0);
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
    localStorage.removeItem('timeLeft');
    setStartedQuiz(null);
    setAnswers({});
    setTimeLeft(null);
  };
  const gototop = () => {
    window.scrollTo(0, 0);
  }
  const { Search } = Input;
  const onSearch = (value: string) => {
    // get current course id
    let current_course_id = ''
    datalist.map((item:any) => {
      if (item.is_selected){
        current_course_id = item.id
      }
    })
    console.log(value, current_course_id);
    if (value == '') { // if value == '', interface will get 404
      getallsections(current_course_id);
      return
    }

    fetch(`${HOST_COURSE}${COURSE_URL}/${current_course_id}/materials/${value}`, {
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
      console.log('search:', res.data.sections);
      // update funlist (left list)
      fun_list.map(item => {
        item.is_selected = false;
      });
      fun_list[1].is_selected = true;
      setfunLists([...fun_list]);
      // update right content of materials
      materials_list = []
      if (res.data.sections.length == 0) {
        setmaterialLists([])
        return
      }
      materials_list = []
      setmaterialLists([]);
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
              // let videolink:any
              // getvideourl(inneritem.resourceId, inneritem)
              fetch(`${HOST_RESOURCE}/video/${inneritem.resourceId}`, {
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
                console.log('video url:',res.data.auth.playURL);
                inneritem.url = res.data.auth.playURL
                setmaterialLists([...materials_list]);
                console.log("search--materials_list:", materials_list);
              });
            }
          })
        } else {
          setmaterialLists([...materials_list]);
        }
      });
      // setmaterialLists([...materials_list]);
      // console.log('materialslist', materialslist);
    })
  }
  const handleAnswerChange = (quizId:any, questionId:any, answer:any, questionType = 0) => {
    // 定义选项字母映射
    const optionLetters = ['a', 'b', 'c', 'd'];
  
    switch (questionType) {
      case 0: // 对于单选题
        setAnswers(prevAnswers => ({
          ...prevAnswers,
          [quizId + '_' + questionId]: {
            quizId: quizId,
            questionId: questionId,
            options: [optionLetters[answer]], // 使用选项字母代替索引
            content: ''
          }
        }));
        break;
      case 1: // 对于多选题
        const selectedOptions = answer.map(index => optionLetters[index]); // 使用选项字母代替索引
        setAnswers(prevAnswers => ({
          ...prevAnswers,
          [quizId + '_' + questionId]: {
            quizId: quizId,
            questionId: questionId,
            options: selectedOptions,
            content: ''
          }
        }));
        break;
      case 2: // 对于问答题
        setAnswers(prevAnswers => ({
          ...prevAnswers,
          [quizId + '_' + questionId]: {
            quizId: quizId,
            questionId: questionId,
            options: [],
            content: answer // answer 是用户输入的字符串
          }
        }));
        break;
      default:
        break;
    }
  };
  
    
  const submitQuizAnswers = async (quizId:any) => {
    // 对于对象中的每个属性（即问题）进行迭代
    for (const key in answers) {
        // 如果属性的 key 包含了 quizId
        if (key.startsWith(quizId + '_')) {
            const answer = answers[key];

            // 创建请求参数
            let params = new URLSearchParams();
            if (answer.options.length > 0) {
              params.append('optionIds', answer.options.join(','));
            }
            if (answer.content !== '') {
                params.append('content', answer.content);
            }
            const response = await fetch(`/service-edu/edu-student/submit/question/${answer.questionId}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  "Authorization": `Bearer ${token}`
              },
              body: params.toString()
          });

          const data = await response.json();
          if (data.success) {
              console.log(`Question ${answer.questionId} submitted successfully.`);
          } else {
              console.log(`Failed to submit question ${answer.questionId}. Error: ${data.message}`);
              return;
          }
      }
  }
  setIsSubmitted(true);
  message.success("quiz submit successfully")
};  

  useEffect(() => {
    console.log(answers);  // 每次answers更新时都会打印
  }, [answers]);
  useEffect(() => {
    const storedStartedQuiz = localStorage.getItem("startedQuiz");
    if (storedStartedQuiz) {
      setStartedQuiz(storedStartedQuiz);
    }
  }, []);
  const handleClick = (_item:any) => {
    const now = new Date();
    const start = new Date(_item.start);
    const end = new Date(_item.end);

    if (now < start) {
      message.error('Quiz is not started yet,please join in after'+  _item.start);
      return;
    }

    if (now > end) {
      message.error('Quiz is finished.');
      return;
    }
    localStorage.setItem("quizStarted", "true");
    localStorage.setItem("startedQuiz", _item.quizid);
    setStartedQuiz(_item.quizid);
    setTimeLeft(_item.limitation * 60); 
  };
  const formatTime = (time:any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    if (startedQuiz !== null &&  timeLeft !== null&&timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      // Cleanup function
      return () => clearInterval(timerId);
    }
    else if (timeLeft === 0) {
      submitQuizAnswers(startedQuiz);
      localStorage.removeItem('timeLeft');
        setStartedQuiz(null);
        setAnswers({});
        setTimeLeft(null);
        setIsSubmitted(false)
    }
  }, [startedQuiz, timeLeft]);
  useEffect(() => {
    const storedTimeLeft = localStorage.getItem('timeLeft');
    if (storedTimeLeft !== null) {
      setTimeLeft(Number(storedTimeLeft));
    }
  }, []);
  useEffect(() => {
    if (timeLeft !== null) {
      localStorage.setItem('timeLeft', timeLeft.toString());
    }
  }, [timeLeft]);
  

  return (
    <div className='stu_wrap'>
      <Navbar />
      <div className='stu_title'>
        <div className='stu_title_list'>
          {datalist.map( (course_item:any)  => 
            <div className='stu_list_header' key={course_item.title}>
              <p key={course_item.id} onClick={() => onclickcourse(course_item.key, course_item.id)} id={course_item.key} className={course_item.is_selected ? "selected": ""}>{course_item.title}</p>
              <p className={course_item.key == String(data.length - 1) ? "stu_title_bar": ""}>|</p>
            </div>  
          )}
        </div>
        {
          funlist.length != 0 ? <div><Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }}/></div> : ''
        }
      </div>
      <div className='stu_content'>
        <div className='stu_left_list'>
          {
            funlist.map(item => 
            <div key={item.key}>
              <div className={item.is_selected ? 'stu_active stu_left_list_title': 'stu_left_list_title'} onClick={onclicklist} id={item.key} key={item.key}>
                <img src={item.img_link} className="stu_icon"/>{item.title}
              </div>
              <div className={item.key == '2' && item.is_selected && quiz_left_list_show ? '' : 'display_non'} >
              {
                quizlist.map(_itm => <div key={_itm.title} id={_itm.quizid} className={_itm.is_selected ? 'ass_list_wrap ass_left_list_active' : 'ass_list_wrap'} onClick={showquizcontent}>{_itm.title}</div>)
              }
              </div>
              <div className={item.key == '3' && item.is_selected && ass_left_list_show ? '' : 'display_non'} key={item.title + item.key}>
              {
                assignlist.map(_itm => <div key={_itm.title} id={_itm.assid} className={_itm.is_selected ? 'ass_list_wrap ass_left_list_active' : 'ass_list_wrap'} onClick={showasscontent}>{_itm.title}</div>)
              }
              </div>
              <div className={item.key == '4' && item.is_selected && stream_left_list_show ? '' : 'display_non'}>
              {
                streamlist.map(_itm => <div key={_itm.title} id={_itm.streamId} className={_itm.is_selected ? 'ass_list_wrap ass_left_list_active' : 'ass_list_wrap'} onClick={showstreamcontent}>{_itm.title}</div>)
              }
              </div>
            </div>
            )
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
            <div className={funlist[0].is_selected ? 'display_non': 'wid100'}>
              <div className={funlist[1].is_selected ? 'stu_right_content': 'display_non'}>
                {
                  materialslist.length == 0 ? <div>there is no section now...</div> : ''
                }
                {
                  materialslist.map(item => <div className='materials_wrap' key={item.key}>
                  <div className='materials_title'>{item.title}</div>
                  <div className='materials_time'>{item.time}</div>
                  <div className={item.cover == '' || item.cover == null ? 'display_non':'materials_img'}><img src={item.cover}/></div>
                  {item.type == 'Text Section' ? <div className='materials_content' dangerouslySetInnerHTML={{__html: item.content}}></div> : ''}
                  { item.file_list.map((itm:any, idx:number) => 
                    <div key={idx.toString()} className="downloadfile_wrap">
                      {itm.type == 'File' ? 
                      <div className='downloadfile' onClick={downLoadMaterial} id={itm.resourceId}>
                        <img src={downloadicon} className="downloadicon"/>Download file : {itm.title}
                      </div> : <div><ReactPlayer controls url={itm.url} id={itm.resourceId} className='react-player' /><p className='video_title'>{itm.title}</p></div>}
                    </div>
                  )}
                  {item.type == 'Custom Video Section' ? <div className='materials_content' dangerouslySetInnerHTML={{__html: item.content}}></div> : ''}
                  <div className='dashline'></div>

                </div>)
                }
              </div>
              <div className={funlist[2].is_selected ? 'stu_right_content': 'display_non'}>
               {
                  quizlist.length == 0 ? <div>There is no quiz now.</div> : ''
                }
                {
                  quizlist.map(_item =>
                    <div key={_item.key} id={_item.quizid} className={_item.is_selected ? 'ass_wrap' : 'display_non'}>
                  {startedQuiz === _item.quizid ? (
                  <>
                  <div style={{display: 'flex', justifyContent: 'center',fontSize: '2em'}}>
                    {_item.title} 
                  </div>
                  <div style={{display: 'flex', justifyContent: 'flex-end',fontSize: '1em',marginTop: '20px'}}>
                    <div>
                      <ClockCircleOutlined />
                    </div>
                    <div style={{marginLeft: '20px'}}>
                    Left Time {timeLeft !== null ? formatTime(timeLeft) : 'Not started'}
                    </div>
                  </div>
                  {_item.question_list.map((question) => {
                    if (question.type === 0) {
                      return (
                        <div key={question.key}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
                            <div style={{fontSize: '1.75em'}}>
                              {question.key+1}.{question.title}
                            </div>
                              <div style={{ fontSize: '1em',marginTop:'2%' }}>
                                ({question.mark} {question.mark === 0 || question.mark === 1 ? 'mark' : 'marks'})
                              </div>
                          </div>
                          <div>
                          {question.cover && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
                              <img src={question.cover} alt="Question Cover" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                            </div>
                          )}
                            <div style={{display: 'flex', justifyContent: 'flex-start',fontSize: '1.25em', marginTop: '30px'}}>
                              <div style={{marginTop: '10px'}}>
                              Answer:
                              </div>
                              <Radio.Group name={`radio-${question.questionid}`} disabled={isSubmitted} style={{marginLeft: '50px',marginTop: '5px'}} onChange={e => handleAnswerChange(_item.quizid,question.questionid, e.target.value,question.type)}>
                                <Space direction="vertical">
                                {question.options && Object.values(question.options).map((option) => (
                                  <Radio value={option.id} key={option.id} style={{ marginTop: '10px' }}>
                                    {option.value}
                                  </Radio>
                                ))}
                                </Space>
                              </Radio.Group>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (question.type === 1) {
                      return (
                        <div key={question.key}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
                            <div style={{fontSize: '1.75em'}}>
                            {question.key+1}.{question.title}
                            </div>
                              <div style={{ fontSize: '1em',marginTop:'2%' }}>
                                ({question.mark} {question.mark === 1||question.mark === 0 ? 'mark' : 'marks'})
                              </div>
                          </div>
                          <div>
                          {question.cover && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
                              <img src={question.cover} alt="Question Cover" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                            </div>
                          )}
                            <div style={{display: 'flex', justifyContent: 'flex-start',fontSize: '1.25em', marginTop: '40px'}}>
                            <div style={{marginTop: '10px'}}>
                              Answer:
                              </div>
                              <Checkbox.Group name={`checkbox-${question.questionid}`} disabled={isSubmitted} style={{ marginLeft: '50px', marginTop: '5px' }} onChange={value => handleAnswerChange(_item.quizid,question.questionid, value, question.type)}>
                                <Space direction="vertical">
                                  {question.options && Object.values(question.options).map((option) => (
                                    <Checkbox value={option.id} key={option.id} style={{ marginTop: '10px' }}>
                                      {option.value}
                                    </Checkbox>
                                  ))}
                                </Space>
                              </Checkbox.Group>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (question.type === 2) {
                      return (
                        <div  key={question.key}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
                            <div style={{fontSize: '1.75em'}}>
                            {question.key+1}.{question.title}
                            </div>
                              <div style={{ fontSize: '1em',marginTop:'2%' }}>
                                ({question.mark} {question.mark === 1||question.mark === 0 ? 'mark' : 'marks'})
                              </div>
                          </div>
                          {question.cover && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
                              <img src={question.cover} alt="Question Cover" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                            </div>
                          )}
                          <div style={{display: 'flex', justifyContent: 'flex-start',fontSize: '1.25em', marginTop: '40px'}}>
                            Answer:
                          </div>
                          <Input.TextArea
                              disabled={isSubmitted}
                              onChange={e => handleAnswerChange(_item.quizid,question.questionid, e.target.value,question.type)}
                              placeholder="you can input many words here ..."
                              style={{ fontFamily: 'Comic Sans MS', marginTop: '20px',height: '200px', width: '100%' }}
                          />
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                  <Form.Item style={{display: 'flex', justifyContent: 'flex-end', marginTop: '60px',marginRight: '2%'}}>
                  {
                      !isSubmitted && 
                      <Button type="primary" onClick={() => submitQuizAnswers(_item.quizid)}style={{ fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }}>
                        Submit
                      </Button>
                    }

                    {
                      !isSubmitted &&
                      <Button onClick={handleCancel} style={{ marginLeft: '30px', fontSize: '18px', fontFamily: 'Comic Sans MS', height: '100%' }}>
                        Cancel
                      </Button>
                    }
                  </Form.Item>
                </>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginTop: '20%'
                }}>
                    <div style={{ fontSize: '25px', fontFamily: 'Comic Sans MS', height: '100%' }}>
                        Click below button to start your quiz,you have {_item.limitation} min.
                    </div>
                    <Button type="primary" 
                        key={_item.quizid}
                        onClick={() => handleClick(_item)}
                        style={{ fontSize: '18px', fontFamily: 'Comic Sans MS', height: '50px', width: '120px',marginTop:'7%' }}>
                        {buttonTexts[_item.quizid] || "Begin"}
                    </Button>
                </div>
              )}
                </div>
                )} 
                </div>
              <div className={funlist[3].is_selected ? 'stu_right_content': 'display_non'}>
                {
                  assignlist.length == 0 ? <div>There is no assignment now.</div> : ''
                }
                {
                  assignlist.map(_item =>
                    <div key={_item.key} id={_item.assid} className={_item.is_selected ? 'ass_wrap' : 'display_non'}>
                      <div className='ass_title'>{_item.title}</div>
                      <div className='ass_time_wrap'>
                        <div className='ass_title_second ass_start_time'>
                          <img className='stu_timeicon' src={time_icon}/>
                          start time : {_item.start_time}
                        </div>
                        <div className='ass_title_second'>
                          <img className='stu_timeicon' src={time_icon}/>
                          end time : {_item.end_time}
                        </div>
                      </div>
                      <div className='ass_content' dangerouslySetInnerHTML={{__html: _item.content}}></div>
                      {
                        _item.ass_files.map((initem:any, index:number) => {
                          return(<div key={index} className='downloadfile' onClick={downLoadAss} id={initem.assFileId}>
                            <img src={downloadicon} className="downloadicon"/>
                            Download file : {initem.title}</div>)
                        })
                      }
                      <div>
                        <p className='uploadbtn'>My Uploaded files :</p>
                        {
                          _item.submits.map((initem:any, index:number) => {
                            return (<a key={index} id={initem.submitId} className="mrt" onClick={downLoaduploadedfile}>{initem.title}</a>)
                          })
                        }
                        
                      </div>
                      <Upload.Dragger
                        {...props(Number(_item.key), _item.assid)} id={_item.assid} key={_item.key} className="uploadbtn dragwrap">
                        <img src={uploadicon} className='uploadicon'/>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      </Upload.Dragger>
                      <div className='wrapbtn'>
                        <Button type="primary" className='uploadbtn mrt30' onClick={() => upload(_item.assid, _item.key)} >Upload</Button>
                      </div>
                      
                      {/* <div className='ass_upload'><img src={uploadicon} className='uploadicon'/>Drag files here to upload</div> */}
                    </div>
                  )
                }
              </div>
              <div className={funlist[4].is_selected ? '': 'display_non'}>
                {
                  streamlist.length == 0 ? <div>There is no stream now.</div> : ''
                }
                {isStreamOpen && 
                  streamlist.map(_item =>
                    <>
                    <div key={_item.key} id={_item.streamId} className={_item.is_selected ? '' : 'display_non'}>
                      <LinkBoardStu stream={_item}/>
                    </div>
                    </>
                  )
                }
              </div>
            </div> : <div className='nocoursewrap'>You do not have any course, please enter 'Student Dashboard' to join courses.</div>
        }

      </div>
      <div><img src={gototopicon} className="gotopicon" onClick={gototop}/></div>
      <Modal title="Drop course" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to drop out of the course?</p>
      </Modal>
      <Footer />
    </div>
  );
}
