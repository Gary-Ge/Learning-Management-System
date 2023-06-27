export function validNotFile(value: any) {
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
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
