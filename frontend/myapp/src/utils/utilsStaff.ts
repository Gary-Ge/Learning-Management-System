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
