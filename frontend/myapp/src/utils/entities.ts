export class CourseLayoutDTO {
  title: any;
  category: any;
  description: any;
  cover: any;
  hasForum: any;

  constructor(title: any, category: any, description: any, cover: any, hasForum: any) {
    this.title = title;
    this.category = category;
    this.description = description;
    this.cover = cover;
    this.hasForum = hasForum;
  }
}

export class ShowMarkDTO {
  mark: any;
  
  constructor(mark: any) {
    this.mark = mark;
  }
}
export class StreamLessonDTO {
  title: any;
  description: any;
  start: any;
  end: any;
  
  constructor(title: any, description: any, start: any, end: any) {
    this.title = title;
    this.description = description;
    this.start = start;
    this.end = end;
  }
}
export class VideoLessonDTO {
  title: any;
  description: any;
  cover: any;
  youtubeLink: any;
  type: any;

  constructor(title: any, description: any, cover: any, youtubeLink: any, type: any) {
    this.title = title;
    this.description = description;
    this.cover = cover;
    this.youtubeLink = youtubeLink;
    this.type = type;
  }
}
export class FileUploadDTO {
  files: any;

  constructor(files: any) {
    this.files = files;
  }
}
export class TextLessonDTO {
  title: any;
  description: any;

  constructor(title: any, description: any) {
    this.title = title;
    this.description = description;
  }
}
export class AssignmentLessonDTO {
  title: any;
  description: any;
  start: any;
  end: any;
  mark: any;

  constructor(title: any, description: any, start: any, end: any, mark: any) {
    this.title = title;
    this.description = description;
    this.start = start;
    this.end = end;
    this.mark = mark;
  }
}
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
      this.email = email;
      this.code = code;
    }
  }
  export class QuizDTO {
    title: any;
    start :any;
    end : any;
    limitation: any;
  
    constructor(title: any,start: any,end:any,limitation: any) {
      this.title = title;
      this.start = start;
      this.end = end;
      this.limitation = limitation;
    }
  }
  