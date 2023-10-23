export function validEmail (email:any) {
    if (email == null || email === '' || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      return false
    }
    return true
  }

export function ValidPassword (password:any) {
  if (password == null || password.length < 8) {
    return false;
  }
  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/
  return regex.test(password);
  }
  
  export function validNotNull (value:any) {
    if (value == null || value === '' || value == -1) {
      return false
    }
    return true
  }
  export function saveToken (token:any) {
    localStorage.setItem('token', token)
  }
  export function getToken () {
    return localStorage.getItem('token')
  }
export const HEADER = { 'Content-Type': 'application/json' }

export const HOST = `/service-ucenter/ucenter`
export const REGISTER_URL = '/register'
export const LOGIN_URL = '/login'
export const CHANGEFILE_URL = '/user'
export const EMAIL_URL = '/email'
export const CODE_URL = '/code'
export const PASSWORD_URL = '/password'
export const HOST_STAFF = '/service-edu/edu-staff'
export const HOST_STUDENT = '/service-edu/edu-student'
export const COURSE_URL = '/courses'
export const HOST_COURSE = '/service-edu/edu-course'
export const HOST_Quiz = '/service-edu/edu-quiz'
export const HOST_Question = '/service-edu/edu-question'
export const COURSE_DETAIL_URL = '/course'
export const HOST_SECTION = '/service-edu/edu-section'
export const HOST_RESOURCE = '/service-edu/edu-resource'
export const HOST_ASSIGNMENT = '/service-edu/edu-assignment'
export const HOST_FORUM_CATEGORY = '/service-forum/forum-category'
export const HOST_FORUM_POST = '/service-forum/forum-post'
export const HOST_FORUM_REPLY = '/service-forum/forum-reply'
export const HOST_CHAT = '/service-chat/chat-bot'
export const HOST_QUIZ = '/service-edu/edu-quiz'
export const HOST_STREAM_QUIZ = '/service-stream/stream-quiz'
export const HOST_STREAM_CHAT = '/service-stream/stream-chat'
export const HOST_STREAM = '/service-stream/stream-basic'
export const HOST_QUESTION = '/service-edu/edu-question'
export const target_stream = 'http://175.45.180.201:10940/';
