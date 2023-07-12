import './studentforums.less';
import { useState, useEffect } from "react";
import Navbar from "../../component/navbar";
import Footer from "../../component/footer";
import { Input, Button, Modal, message, Radio, Select, RadioChangeEvent } from 'antd';
import { getToken, HOST_STAFF, HOST_COURSE, HOST_FORUM_CATEGORY, HOST_FORUM_POST, HOST_FORUM_REPLY } from '../utils/utils';
import { useLocation } from 'umi';
import emptyimg from '../../../images/teacher.png';
import defaultimg from '../../../images/defaultimg.png';
import gototopicon from '../../../images/gototop.png';
let tab_list_data_new: { key: string; title: any; id: any; is_selected: boolean; }[] = [];
let course_no_forums:{ value: string; label: string; courseid: string; category: string;
    description: string; cover: string; hasForum: boolean
 }[] = [];
let tag_list:{
    key: string; title: string, is_selected: boolean, color: string, id: string, label: string, value: string
}[] = [];
//     { key: '0', title: 'General', is_selected: true, color: 'Blue', id: '111'}

let left_list:{key: string; id: string; title: string; is_selected: boolean; 
    color: string; tag:string; time: string; author: string}[] = []

let current_post = {
    postId: '', title: '', updatedAt: '', content: '', color: '', category: '', categoryId: '',
    postBy: {
        avatar: defaultimg, email: '', user_id: '', username: ''
    },
    replies:[]
}

const { Search, TextArea } = Input;
const onSearch = (value: string) => console.log(value);
const plainOptions = ['Private', 'Anonymous'];

export default function teacherforums() {
    const token = getToken();
    // course list: tab title
    const [datalist,setdataLists] = useState(tab_list_data_new); // tabs course title
    const [courseflag,set_show_add_course] = useState(false);
    const [coursesnoforum, setcoursesnoforum] = useState(course_no_forums);
    const [defaultselectedcourse, set_select_course] = useState({value: '', courseid: '', hasForum: false});
    const [defaultcourse, setdefaultcourse] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // tab list
    const [taglist, settaglist] = useState(tag_list);
    const tagcss = (color: string) => {
        if (color.toLowerCase() == 'blue') {
            return 'stu_forum_tag tag_blue'
        }
        if (color.toLowerCase() == 'pink') {
            return 'stu_forum_tag tag_pink'
        }
        if (color.toLowerCase() == 'red') {
            return 'stu_forum_tag tag_red'
        }
        return 'stu_forum_tag tag_blue';
    }
    // tag list
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [inputTagName, set_tag_name] = useState('');
    const [colorvalue, setcolorvalue] = useState('Blue');
    // create tag : change tag color
    const changecolorvalue = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setcolorvalue(e.target.value);
    };
    // delete tag
    const [DelTagModalOpen, setDelTagModalOpen] = useState(false);
    const [del_tag_value, setDelTagValue] = useState('');
    const del_change_tag = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target);
        setDelTagValue(e.target.value);
    }
    // thread
    const [createthreadname, setCreateThreadName] = useState('');
    const changecreatethreadname = (event:any) => {
        setCreateThreadName(event.target.value);
    }
    // content: left post list
    const [leftlist, setLeftList] = useState(left_list);
    const [create_thread_tag_value, setcreate_thread_tag_value] = useState('');
    const [create_thread_content, set_create_thread_content] = useState('');
    const [create_thread_author, set_create_thread_author] = useState('');
    const [showcontentflag, set_showcontentflag] = useState('0');
    // post
    const [currentpost, setcurrentpost] = useState(current_post);
    const [DelPostModalOpen, setDelPostModalOpen] = useState(false);
    const [EditPostModalOpen, setEditPostModalOpen] = useState(false);
    const [editpostTitle, seteditpostTitle] = useState('');
    const [edit_thread_tag_value, set_edit_thread_tag_value] = useState('');
    const [edit_thread_content, set_edit_thread_content] = useState('');
    // reply
    const [post_answer, set_post_answer] = useState('');
    const changepostanswer = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        set_post_answer(e.target.value);
    };
    const [ReplyModalOpen, setReplyModalOpen] = useState(false);
    const [currentReplyId, setcurrentReplyId] = useState('');
    const [ReplyToReplyValue, setReplyToReplyValue] = useState(''); // model textarea
    const [replyModaliscreate, setreplyModaliscreate] = useState(true); // true : model for create reply, false: update reply

    useEffect(() => {
        // getall course -> tabs title
        getallcourse_haveforum();

        window.scrollTo(0, 0);
    },[]);
    const getallcourse_haveforum = () => {
        fetch(`${HOST_STAFF}/coursesWithForum`, {
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
            console.log('staff forums',res.data.courses);
            let getcourses = res.data.courses
            tab_list_data_new = []
            getcourses.map((item:any, index: string) => {
                tab_list_data_new.push({
                    key: index,
                    title: item.title,
                    id: item.courseId,
                    is_selected: index == '0' ? true : false
                })
            })
            console.log('tab_list_data', tab_list_data_new);
            setdataLists([...tab_list_data_new]);
            console.log('datalist', tab_list_data_new);
            getallcourse();
            getalltag_a_course(tab_list_data_new[0].id); // id means courseid
          })
    }
    const getallcourse = () => {
        fetch(`${HOST_STAFF}/courses`, {
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
            console.log("get all courses",res.data.courses, tab_list_data_new);
            let getallcourse_data = res.data.courses
            if (getallcourse_data.length > tab_list_data_new.length) {
                set_show_add_course(true);
            } else {
                set_show_add_course(false);
                return
            }
            course_no_forums = []
            getallcourse_data.map((item:any)=> {
                if (!item.hasForum) {
                    course_no_forums.push({
                        value: item.title,
                        label: item.title,
                        courseid: item.courseId,
                        category: item.category,
                        description: item.description,
                        cover: item.cover,
                        hasForum: false
                    })
                }
            })
            setcoursesnoforum([...course_no_forums]);
            set_select_course(course_no_forums[0]);
            // console.log('setdefaultcourse', course_no_forums);
            setdefaultcourse(course_no_forums[0].value);
            // console.log('coursesnoforum', course_no_forums, 
            // 'defaultselectedcourse', course_no_forums[0].value);
        })
    }
      // click tabs title
    const onclickcourse = (idx:string, id:string) => {
        datalist.map((item:any) => {
            item.is_selected = false;
        });
        datalist[Number(idx)].is_selected = true;
        setdataLists([...datalist]);
        console.log(id);
        getalltag_a_course(id); // id means courseid
        set_showcontentflag('0');
    };
    const getalltag_a_course = (id: string) => {
        fetch(`${HOST_FORUM_CATEGORY}/categories/${id}`, {
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
            console.log('category',res.data.categories);
            let categories = res.data.categories
            tag_list = []
            categories.map((item:any, index: string) => {
                tag_list.push({
                    key: index, 
                    title: item.name, 
                    is_selected: index == '0' ? true : false, 
                    color: item.color, 
                    id: item.categoryId,
                    label: item.name,
                    value: item.name
                })
            })
            settaglist([...tag_list]);
            // get all post of course and category
            if (tag_list.length) {
                getallposts(id, tag_list[0].id);
            } else {
                setLeftList([]); // no tags no posts list
            }
            
        })
    }
    // tag function: click tag
    const clicktag = (id: string) => {
        console.log('click tag id: ',id);
        tag_list.map(item => {
            item.is_selected = false
            if (item.id == id) {
                item.is_selected = true
            }
        })
        settaglist([...tag_list]);
        // get_a_tag_info(id); // show back to the tag edit
        // get current courseid
        let current_course_id = ''
        datalist.map((item:any) => { // current course id
            if (item.is_selected) {
                current_course_id = item.id
            }
        });
        getallposts(current_course_id, id);
        // set_showcontentflag('0');
    }
    // tag function: get a tag info
    const get_a_tag_info = (tagid:string) => {
        fetch(`${HOST_FORUM_CATEGORY}/category/${tagid}`, {
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
            console.log('get a tag info', res.data.category);
        })
    }
    // tag function: create tag
    const createtag = () => {
        console.log('inputTagName', inputTagName, 'tagcolor:', colorvalue);
        if (inputTagName == '' || inputTagName == ' ') {
            message.error('Name can not be empty!');
            return
        }
        let current_course_id = ''
        datalist.map((item:any) => { // current course id
            if (item.is_selected) {
                current_course_id = item.id
            }
        });
        console.log('courseid', current_course_id);
        let formdata = { name: inputTagName, color: colorvalue}
        // fetch create a category
        fetch(`${HOST_FORUM_CATEGORY}/category/${current_course_id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formdata)
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
              throw new Error(res.message)
              message.error(res.message);
              return;
            }
            message.success(res.message);
            setIsTagModalOpen(false);
            set_tag_name('');
            getalltag_a_course(current_course_id); // id means courseid
        })

    }
    const changetagname = (event:any) => {
        set_tag_name(event.target.value);
    }

    const TagModalCancel = () => {
        setIsTagModalOpen(false);
    }
    // tag function: delete tag
    const deletetagmodelopen = () => {
        setDelTagModalOpen(true);
    }
    const deltag = () => {
        // delete tag
        console.log('delete category id:', del_tag_value);
        fetch(`${HOST_FORUM_CATEGORY}/category/${del_tag_value}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
            //   throw new Error(res.message)
              message.error(res.message);
            } else {
                message.success(res.message);
                setDelTagModalOpen(false);
                // get all tag list
                let current_course_id = ''
                datalist.map((item:any) => { // current course id
                    if (item.is_selected) {
                        current_course_id = item.id
                    }
                });
                getalltag_a_course(current_course_id); // id means courseid
            }
        })
        
    }
    const DelTagModalCancel = () => {
        setDelTagModalOpen(false);
    }
    // create thread function: creat tag
    const create_change_tag = ({ target: {value} }: RadioChangeEvent) => {
        // value means tagid
        console.log('checked', value);
        // setcreate_thread_tag_id();
        setcreate_thread_tag_value(value);
    };
    // create thread content
    const createthreadcontent =  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        set_create_thread_content(e.target.value);
        console.log(create_thread_content);
    };
    const changeAuthorName = ({ target: { value } }: RadioChangeEvent) => {
        console.log('radio1 checked', value);
        set_create_thread_author(value);
    };
    const showcreatethread = () => {
        set_showcontentflag('1');
        setCreateThreadName('');
        set_create_thread_content('');
        setcreate_thread_tag_value('');
    }
    // creat thread submit button ok
    const createThread = () => {
        console.log('thread name: ', createthreadname);
        console.log('tag id: ', create_thread_tag_value);
        console.log('content: ', create_thread_content);
        // console.log('author name: ', create_thread_author);
        let formdata = { categoryId: create_thread_tag_value, title: createthreadname, content: create_thread_content}
        // fetch create a thread
        let current_course_id = ''
        datalist.map((item:any) => { // current course id
            if (item.is_selected) {
                current_course_id = item.id
            }
        });
        fetch(`${HOST_FORUM_POST}/post/${current_course_id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formdata)
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
            //   throw new Error(res.message)
              message.error(res.message);
              return;
            }
            message.success(res.message);
            // update post list
            getallposts(current_course_id, create_thread_tag_value);
            
            // set_showcontentflag('0');// todo get current post info
            setCreateThreadName('');
            setcreate_thread_tag_value('');
            set_create_thread_content('');
            window.scrollTo(0, 0);
          });
    }
    // left post get all posts of a course & category
    const getallposts = (courseid:string, tagid: string) => {
        fetch(`${HOST_FORUM_POST}/posts/${courseid}/${tagid}`, {
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
            console.log('get all post', res.data.posts)
            left_list = []
            let posts = res.data.posts
            posts.map((item:any, index: string) => {
                left_list.push({
                    key: index,
                    id: item.postId,
                    title: item.title,
                    is_selected: index == '0' ? true : false,
                    color: item.color,
                    time: item.updatedAt,
                    author: item.postBy.username,
                    tag: item.category
                })
            })
            setLeftList([...left_list]); // update left list
            // update tag list
            tag_list.map(item => {
                item.is_selected = false
                if (item.id == tagid) {
                    item.is_selected = true
                }
            })
            settaglist([...tag_list]);
            if(left_list.length != 0){
                getapostinfo(left_list[0].id);
            } else {
                set_showcontentflag('0');
            }
           
        })
    }

    // left post list click
    const onclickthreadlist = (id: string) => {
        console.log('click thread: ', id);
        left_list.map((item:any)=>{
            item.is_selected = false
            if(item.id == id){
                item.is_selected = true
            }
        })
        setLeftList([...left_list]);
        
        // get a post info, id means postid
        getapostinfo(id); 
    }
    const getapostinfo = (postid: string) => {
        fetch(`${HOST_FORUM_POST}/post/${postid}`, {
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
            console.log('get a post info', res.data.post);
            let get_post = res.data.post
            // current_post.category = get_post.category
            // current_post.title = get_post.title

            // console.log("current_post",current_post)
            setcurrentpost({...get_post});
            set_showcontentflag('2');
            set_post_answer('');
        })
    }

    // post function: remove post
    const delpost = () => {
        console.log('postid', currentpost.postId);
        fetch(`${HOST_FORUM_POST}/post/${currentpost.postId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
              throw new Error(res.message)
              message.error(res.message);
            } else {
                message.success(res.message);
                setDelPostModalOpen(false);
                let current_course_id = ''
                datalist.map((item:any) => { // current course id
                    if (item.is_selected) {
                        current_course_id = item.id
                    }
                });
                let current_tag_id = ''
                taglist.map((_item:any)=> {
                    if (_item.is_selected) {
                        current_tag_id = _item.id
                    }
                })
                getallposts(current_course_id, current_tag_id);
                // todo get current post info
                // set_showcontentflag('0');
            }
        })
        
    }
    // post function: open model to remove post
    const toShowRemovePostModal = () => {
        setDelPostModalOpen(true);
    }
    // post function: cancel model to remove post
    const DelPostModalCancel = () => {
        setDelPostModalOpen(false);
    }

    // post function: submit edit post
    const editpost = () => {
        console.log('editpost:', currentpost.postId);
        console.log('editpost category id:', edit_thread_tag_value);
        console.log('editpost title:', editpostTitle);
        console.log('editpost content', edit_thread_content);
        let formdata = {
            'categoryId': edit_thread_tag_value,
            'title': editpostTitle,
            'content': edit_thread_content
        }
        // fetch
        fetch(`${HOST_FORUM_POST}/post/${currentpost.postId}`, {
            method: "PUT",
            body: JSON.stringify(formdata),
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
              message.error(res.message);
              return;
            }
            setEditPostModalOpen(false);
            message.success("Edit a thread successfully");
            // getallcourse_haveforum();
            let current_course_id = ''
            datalist.map((item:any) => { // current course id
                if (item.is_selected) {
                    current_course_id = item.id
                }
            });
            getallposts(current_course_id, edit_thread_tag_value);
            window.scrollTo(0, 0);
          })
    }
    // post function: open model to edit post
    const toShowEditPostModal = () => {
        seteditpostTitle(currentpost.title);
        set_edit_thread_tag_value(currentpost.categoryId); // todo categoryid
        set_edit_thread_content(currentpost.content);
        console.log('currentpost', currentpost);
        setEditPostModalOpen(true);
    }
    const EditPostModalCancel = () => {
        setEditPostModalOpen(false);
    }
    // post function: edit post title input change
    const editpostchangevalue = (event:any) => {
        seteditpostTitle(event.target.value);
    }
    // post function: edit post category input change
    const edit_thread_change_tag = (event:any) => {
        set_edit_thread_tag_value(event.target.value);
    }
    const editThreadContentChange = (event:any) => {
        set_edit_thread_content(event.target.value);
    }
    // reply function: reply to a post (click comment)
    const replytoapost = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }
    // reply function: reply to a post (submit button)
    const submitReplyToApost = () => {
        console.log(post_answer);
        // reply to a post
        fetch(`${HOST_FORUM_REPLY}/post/${currentpost.postId}/reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({content: post_answer})
            })
            .then(res => res.json())
            .then(res => {
            if (res.code !== 20000) {
                // throw new Error(res.message)
                message.error(res.message);
                return;
            }
            message.success(res.message);
            getapostinfo(currentpost.postId);
            set_post_answer('');
        })
    }
    // reply to reply model
    const ReplyToReplyValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setReplyToReplyValue(e.target.value);
    }
    const showReplayModal = (replyId: string, content: string)=> {
        setReplyToReplyValue(content);
        setReplyModalOpen(true);
        setcurrentReplyId(replyId);
        if (content == '') {
            setreplyModaliscreate(true);
        } else {
            setreplyModaliscreate(false);
        }
    }
    const ReplyToReplyModalCancel = () => {
        setReplyModalOpen(false);
    }
    // reply to reply submit
    const ReplyToReplyModalChange = () => {
        // fetch
        console.log('current reply id:', currentReplyId);
        console.log('ReplyToReplyValue', ReplyToReplyValue);
        if (replyModaliscreate) {
            // reply to a reply
            fetch(`${HOST_FORUM_REPLY}/reply/${currentReplyId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({content: ReplyToReplyValue})
                })
                .then(res => res.json())
                .then(res => {
                if (res.code !== 20000) {
                    // throw new Error(res.message)
                    message.error(res.message);
                    return;
                }
                message.success(res.message);
                setReplyModalOpen(false);
                getapostinfo(currentpost.postId);
                setReplyToReplyValue('');
            })
        } else { 
            // update a reply
            fetch(`${HOST_FORUM_REPLY}/reply/${currentReplyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({content: ReplyToReplyValue})
                })
                .then(res => res.json())
                .then(res => {
                if (res.code !== 20000) {
                    // throw new Error(res.message)
                    message.error(res.message);
                    return;
                }
                message.success(res.message);
                setReplyModalOpen(false);
                getapostinfo(currentpost.postId);
                setReplyToReplyValue('');
            })

        }
        


    }
    // reply delete
    const DelReply = (replyId: string) => {
        fetch(`${HOST_FORUM_REPLY}/reply/${replyId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
            //   throw new Error(res.message)
              message.error(res.message);
            } else {
                message.success(res.message);
                // update
                getapostinfo(currentpost.postId);
            }
        })
    }

    const gototop = () => {
        window.scrollTo(0, 0);
    }
    // add course model function
    const addcourseModal = () => {
        setIsModalOpen(true);
        // update course no forums
        set_select_course(coursesnoforum[0]);
        setdefaultcourse(coursesnoforum[0].value);
    };
    
    const handleOk = () => {
        console.log('handleOk', defaultselectedcourse);
        let selectedcourse = defaultselectedcourse
        selectedcourse.hasForum = true
        // update course to have forum
        fetch(`${HOST_COURSE}/course/${defaultselectedcourse.courseid}`, {
            method: "PUT",
            body: JSON.stringify(selectedcourse),
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
              throw new Error(res.message)
            }
            setIsModalOpen(false);
            message.success("creat a forum successfully");
            getallcourse_haveforum();
          })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        coursesnoforum.map((item:any)=> {
            if (item.value == value) {
                set_select_course(item);
                setdefaultcourse(item.value);
            }
        })
        
    };

    return(
        <div className='forum_wrap'>
            <Navbar />
            <div className='stu_forum_title'>Teacher Course Forums</div>
            <div className='stu_title'>
                <div className='stu_title_list'>
                    {datalist.map( (course_item:any)  => 
                    <div className='stu_list_header' key={course_item.title}>
                        <p key={course_item.id} onClick={() => onclickcourse(course_item.key, course_item.id)} id={course_item.key} className={course_item.is_selected ? "forum_selected": ""}>{course_item.title}</p>
                        <p className={course_item.key == String(datalist.length - 1) ? "stu_title_bar": ""}>|</p>
                    </div>)}
                    <Button type="primary" className={courseflag ? 'btn_add' : 'display_non' } onClick={addcourseModal}>+ Add Course</Button>
                </div>
                <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} allowClear/>
            </div>
            <div className='stu_forum_tag_wrap'>
                {
                    taglist.map((item:any)=> {
                        return(
                            <div className={item.is_selected ? `${tagcss(item.color)} tag_active` : `${tagcss(item.color)}`}
                            key={item.key} onClick={()=> {clicktag(item.id)}}>{item.title}</div>
                        )
                    })
                }
                <Button type="primary" className='btn_add mrt' onClick={() => {setIsTagModalOpen(true)}} >+</Button>
                <Button type="primary" className={taglist.length == 0 ? 'display_non' : 'btn_add'} onClick={deletetagmodelopen} >-</Button>
            </div>
            <Button type="primary" className='btn_add mlt30 mt' onClick={showcreatethread}>+ New Thread</Button>
            <div className='stu_forum_content_wrap'>
                <div className={leftlist.length > 5 ? 'stu_forum_list scroll_y': 'stu_forum_list'}>
                    {
                        leftlist.map((_item: any) => {
                            return (
                            <div className='stu_forum_left_list' key={_item.key}>
                                {/* <div>last week</div> */}
                                <div className={_item.is_selected ? 'stu_forum_left_list_wrap post_active' : 'stu_forum_left_list_wrap'} onClick={() => onclickthreadlist(_item.id)}>
                                    <div className='list_title'>{_item.title}</div>
                                    <div className='stu_forum_left_list_content'>
                                        <div className='display_flex'>
                                            <div className={tagcss(_item.color)}>{_item.tag}</div>
                                            <div className='gray6'>{_item.time}</div>
                                        </div>
                                        <div className='gray6'>{_item.author}</div>
                                    </div>
                                </div>
                            </div>
                            )
                        })
                    }
                    {
                       leftlist.length == 0 ? <p className='tips'>No Thread now...</p> : <p className='tips'>--The End--</p>
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
                            <Input value={createthreadname} onChange={changecreatethreadname} placeholder="Input Thread Title" className='create_input'/>
                        </div>
                        <div className='create_title'>
                            <div className='create_left_title'>Choose Category:</div>
                            {
                                taglist.length == 0 ? <div>There is no category now. please create a category firstly.</div>:''
                            }
                            <div className='create_input'>
                                <Radio.Group
                                    // options={taglist}
                                    onChange={create_change_tag}
                                    value={create_thread_tag_value}
                                    // optionType="button"
                                    buttonStyle="solid">
                                    {
                                        taglist.map(item => {
                                            return(
                                                <Radio key={item.key} value={item.id}>{item.label}</Radio>
                                            )
                                        })
                                    }
                                </Radio.Group>
                            </div>
                        </div>
                            <div className='create_left_title'>Thread Content:</div>
                            <div className='create_textarea'>
                                <TextArea rows={8} allowClear onChange={createthreadcontent} value = {create_thread_content}/>
                            </div>
                            <div className='create_author_wrap'>
                                <Radio.Group options={plainOptions} onChange={changeAuthorName} value={create_thread_author} />
                            </div>
                            <Button type="primary" className='creat_btn' onClick={createThread}>Submit</Button>
                    </div>
                </div>
                <div className={showcontentflag == '2' ? 'stu_forum_content' : 'display_non'}>
                    <div className='stu_forum_title'>
                        {currentpost.title}
                    </div>
                    <div className='forum_avatar_wrap'>
                        <img src={currentpost.postBy.avatar} className='forum_default_avatar mrt'/>
                        <div className='forum_thread_avatar_wrap mrt'>
                            <div className='mrt font_large fw'>{currentpost.postBy.username}</div>
                            <div className='gray6'>{currentpost.updatedAt}</div>
                        </div>
                        <div className={`stu_forum_tag ${tagcss(currentpost.color)} height25`}>{currentpost.category}</div>
                    </div>
                    <div className='stu_forum_thread_wrap'>
                        <div className='line_h'>
                            {currentpost.content}
                        </div>
                        <div className='gray6 mt'>
                            <span className='mrt pointer' onClick={replytoapost}>comment</span>|
                            <span className='mrt mlt10 pointer' onClick={toShowEditPostModal}>edit</span>|
                            <span className='mlt10 pointer' onClick={toShowRemovePostModal}>remove</span>
                        </div>
                        {
                            currentpost.replies.map((item:any, index:number)=> {
                                return(
                                    <div key={index.toString()}>
                                        <div className='forum_avatar_wrap padding_left'>
                                            <img src={item.replyBy.avatar} className='forum_moment_avatar mrt'/>
                                            <div className='forum_thread_avatar_wrap mrt'>
                                                <div className='mrt font_large font_small fw'>{item.replyBy.username}</div>
                                                <div className='gray6 font_small12'>{item.updatedAt}</div>
                                            </div>
                                        </div>
                                        <div className='forum_comment'>{item.content}</div>
                                        <div className='replytopost'>
                                            <span className='mrt pointer' onClick={() => {showReplayModal(item.replyId, '')}}>replay</span>|
                                            <span className='mrt mlt10 pointer' onClick={() => {showReplayModal(item.replyId, item.content)}}>edit</span>|
                                            <span className='mlt10 pointer' onClick={()=> {DelReply(item.replyId)}}>remove</span>
                                        </div>
                                        {
                                            item.subReplies.map((_item:any, index: number)=> {
                                                return(
                                                    <div className='mlt54' key={index.toString()}>
                                                        <div className='forum_avatar_wrap padding_left'>
                                                            <img src={_item.replyBy.avatar} className='forum_second_moment_avatar mrt'/>
                                                            <div className='forum_thread_avatar_wrap mrt'>
                                                                <div className='mrt font_large font_small fw'>{_item.replyBy.username}</div>
                                                                {_item.replyTo ? <div className='reply_name'> replying to {_item.replyTo.username}</div> : ''}
                                                                <div className='gray6 font_small12'>{_item.updatedAt}</div>
                                                            </div>
                                                        </div>
                                                        <div className='forum_second_comment'>{_item.content}</div>
                                                        <div className='reply_btn'>
                                                            <span className='mrt pointer' onClick={() => {showReplayModal(_item.replyId, '')}}>replay</span>|
                                                            <span className='mrt mlt10 pointer' onClick={() => {showReplayModal(_item.replyId, _item.content)}}>edit</span>|
                                                            <span className='mlt10 pointer'  onClick={()=> {DelReply(_item.replyId)}}>remove</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='forum_answer_wrap'>
                        <div className='font_large font_weight'>Your Comment</div>
                        <div className='create_textarea'>
                            <TextArea rows={8} allowClear onChange={changepostanswer} value = {post_answer}/>
                        </div>
                        <Button type="primary" className='creat_btn' onClick={submitReplyToApost}>Submit</Button>
                    </div>
                </div>
            </div>
            <Modal className='fm' title="Create a forum for the course" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Choose a course:</p>
                <Select
                    value={defaultcourse}
                    defaultActiveFirstOption
                    style={{ width: 260 }}
                    // onChange={handleChange}
                    onSelect={handleChange}
                    options={coursesnoforum}
                />
            </Modal>
            <Modal className='fm' title="Create a category" open={isTagModalOpen} onOk={createtag} onCancel={TagModalCancel}>
                <span className='mrt'>Category Name:</span>
                <Input value={inputTagName} onChange={changetagname} style={{ width: '300px' }} />
                <p className='mt'>Select Category Color:</p>
                <Radio.Group onChange={changecolorvalue} value={colorvalue}>
                    <Radio value={'Blue'}>Blue</Radio><br/>
                    <Radio value={'Red'}>Red</Radio><br/>
                    <Radio value={'Pink'}>Pink</Radio>
                </Radio.Group>
            </Modal>
            <Modal className='fm' title="Delete a category" open={DelTagModalOpen} onOk={deltag} onCancel={DelTagModalCancel}>
                <span className='mrt'>Select a Category:</span>
                <Radio.Group
                    // options={taglist}
                    onChange={del_change_tag}
                    value={del_tag_value}
                    // optionType="button"
                    buttonStyle="solid"
                >
                {
                    taglist.map(item => {
                        return(
                            <Radio key={item.key} value={item.id}>{item.label}</Radio>
                        )
                    })
                }
                </Radio.Group>
            </Modal>
            <Modal className='fm' title="Delete a post" open={DelPostModalOpen} onOk={delpost} onCancel={DelPostModalCancel}>
                <p>Do you want to remove the thread ? </p>
            </Modal>
            <Modal className='fm' open={EditPostModalOpen} onOk={editpost} onCancel={EditPostModalCancel}>
                <div className='edit_wrap_title'>Edit Thread</div>
                <div className='create_title fm'>
                    <div className='create_left_title'>Thread Title:</div>
                    <Input value={editpostTitle} onChange={editpostchangevalue} placeholder="Input Thread Title" className='create_input'/>
                </div>
                <div className='edit_post_title fm'>
                    <div className='create_left_title'>Choose Category:</div><br/>
                    {
                        taglist.length == 0 ? <div>There is no category now. please create a category firstly.</div>:''
                    }
                    <div className='create_input'>
                        <Radio.Group
                            onChange={edit_thread_change_tag}
                            value={edit_thread_tag_value}
                            buttonStyle="solid">
                            {
                                taglist.map(item => {
                                    return(
                                        <Radio key={item.key} value={item.id}>{item.label}</Radio>
                                    )
                                })
                            }
                        </Radio.Group>
                    </div>
                </div>
                <div className='create_left_title fm'>Thread Content:</div>
                <div className='create_textarea fm'>
                    <TextArea rows={8} allowClear onChange={editThreadContentChange} value = {edit_thread_content}/>
                </div>
                {/* <div className='create_author_wrap'>
                    <Radio.Group options={plainOptions} onChange={changeAuthorName} value={create_thread_author} />
                </div> */}
                {/* <Button type="primary" className='creat_btn' onClick={createThread}>Submit</Button> */}
            </Modal>
            <Modal className='fm' open={ReplyModalOpen} onOk={ReplyToReplyModalChange} onCancel={ReplyToReplyModalCancel}>
                <p> Reply to :</p>
                <TextArea rows={8} allowClear onChange={ReplyToReplyValueChange} value = {ReplyToReplyValue}/>
            </Modal>
            <div><img src={gototopicon} className="gotopicon" onClick={gototop}/></div>
            <Footer/>
        </div>
    )
}