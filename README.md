<center><h1>Development Document</h1></center>

## Update 2023.6.20 #2

- 获取课程信息的所有接口现在都会返回课程的创建和更新时间

- 播放视频的接口可用：`/service-edu/edu-resource/video/{resourceId}`

  - 该接口的返回如下

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Play video success",
      "data": {
        "auth": {
          "playURL": "https://outin-87de2e060dc411eeb1bb00163e000677.oss-ap-southeast-1.aliyuncs.com/sv/5ca632a3-188d4392d8f/5ca632a3-188d4392d8f.mp4?Expires=1687250324&OSSAccessKeyId=LTAI3DkxtsbUyNYV&Signature=JFG9n8pR2IQkRp8Ox9VgZTxIOkg%3D"
        }
      }
    }
    ```
  
  其中playURL为视频播放地址，有效期为两小时，使用任意播放器播放该地址即可

## Update 2023.6.20

- 创建/更新/获取/删除小节相关的接口可用
- 学生注册和退出课程的接口可用
- 上传文件资源和视频资源的接口可用
- 下载文件资源的接口可用
  - 该接口如果调用成功返回一个文件流（Content-Type=application/octet-stream），该接口如果调用失败返回json数据（Content-Type=application/x-www-form-urlencoded）前端需要首先判断返回类型再做对应处理
  - 返回的文件流不会被浏览器自动下载，需要封装成blob格式再手动生成一个下载链接，模拟点击进行下载
- 上传视频的接口最好限制只上传mp4格式（理论上所有视频格式都受到支持，但我还没测试播放其他格式的视频）
- 不要上传过大的视频（因为有点慢）
- 创建/更新/获取课程的接口可用
- 获取Staff教授的所有课程的接口可用
- 获取Student参加的所有的课程的接口可用
- 获取全部Staff列表的接口可用
- 获取全部Student列表的接口可用

## Update 2023.6.18

- 不再使用Redis存储token和userId之间的对应关系，现在token将被直接解析。token现在不会自动续期了，每一个token将在它生成的30天后过期
- 解决了存在的跨域问题，现在所有请求必须通过网关，直连微服务的请求将被拒绝
- 添加了textSection的增删改接口
- 添加了为Section上传文件的接口，该接口允许同时上传多个文件
- **注意，如果要在创建textSection的同时上传文件，请阻止antd上传组件的默认上传事件，并在点击save按钮时先调用创建textSection的接口，再调用上传文件的接口将文件手动上传，示例如下**

````react
import { InboxOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button } from 'antd';
import { useState } from 'react';
const App = () => {
  const [fileList, setFileList] = useState([]);

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const headers = new Headers();
  headers.append('Authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODYyMTQ5MzIsImV4cCI6MTY4NzUxMDkzMiwiaWQiOiIzNDFlYjU0ZTI4ZTcxMTYwMjU3YjlmYmNjMzAwMjJmNiJ9.r92a9jku4abEhoNAIETBNaKxlOyQvth4lmt_1Mz9KOY`);

  const upload = () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files', file);
    });

    fetch('http://localhost:10900/service-edu/edu-resource/resources/a6fd797ffd16def337b20cf0c277487a', {
      method: 'POST',
      headers: headers,
      body: formData
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <>
      <Upload.Dragger
        {...props}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">将文件拖到此处上传</p>
        <p className="ant-upload-hint">
          或点击 <UploadOutlined /> 选择文件
        </p>
      </Upload.Dragger>
      <Button
        type="primary"
        onClick={upload}
      >Upload</Button>
    </>
  );
}
export default App;
````

