export class RegisterDTO {
    username: any;
    password: any;
    email: any;
  
    constructor(username: any,password: any,email: any) {
      this.username = username;
      this.password = password;
      this.email = email;
    }
  }
  export class LoginDTO {
    email: any;
    password: any;
    constructor(email: any,password: any) {
      this.password = password;
      this.email = email;
    }
  }
  export class ChangeUserDTO {
    username: any;
    password: any;
    email: any;
    avatar: any;
  
    constructor(username: any,password: any,email: any,avatar: any) {
      this.username = username;
      this.password = password;
      this.email = email;
      this.avatar = avatar;
    }
  }
  export class CaptachaDTO {
    email: any;
    code: any;
    constructor(email: any,code: any) {
      this.email =email;
      this.code = code;
    }
  }
  