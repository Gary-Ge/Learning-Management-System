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
    if (value == null || value === '') {
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
// export const HOST_STUDENT = '/service-edu/edu-student'
// export const HOST_COURSE = '/service-edu/edu-course'
export const REGISTER_URL = '/register'
export const LOGIN_URL = '/login'
export const CHANGEFILE_URL = '/user'
export const EMAIL_URL = '/email'
export const CODE_URL = '/code'
export const PASSWORD_URL = '/password'
export const HOST_STUDENT = '/service-edu/edu-student'
export const COURSE_URL = '/courses'
export const HOST_COURSE = '/service-edu/edu-course'
export const COURSE_DETAIL_URL = '/course'
export const HOST_SECTION = '/service-edu/edu-section'
export const HOST_RESOURCE = '/service-edu/edu-resource'
export const HOST_ASSIGNMENT = '/service-edu/edu-assignment'

