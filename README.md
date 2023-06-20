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
          "videoId": "0d0a12100eb471eebfd186c6360c0102",
          "playAuth": "eyJTZWN1cml0eVRva2VuIjoiQ0FJU2h3TjFxNkZ0NUIyeWZTaklyNWJtQS9MbG1LcFkwNmVNZG12MXZFSVdUK29kaTdEN3NqejJJSDFFZm5sb0FPa2FzUHd6bFd0UjZmd2Vsck1xRjhNZkh4ZWJONWNoc01zUHIxei9KcExGc3QySjZyOEpqc1Zzd3RCRzdrZXBzdlhKYXNEVkVmbDJFNVhFTWlJUi8wMGU2TC8rY2lyWXBUWEhWYlNDbFo5Z2FQa09Rd0M4ZGtBb0xkeEtKd3hrMnQxNFVtWFdPYVNDUHdMU2htUEJMVXhtdldnR2wyUnp1NHV5M3ZPZDVoZlpwMXI4eE80YXhlTDBQb1AyVjgxbExacGxlc3FwM0k0U2M3YmFnaFpVNGdscjhxbHg3c3BCNVN5Vmt0eVdHVWhKL3phTElvaXQ3TnBqZmlCMGVvUUFQb3BGcC9YNmp2QWF3UExVbTliWXhncGhCOFIrWGo3RFpZYXV4N0d6ZW9XVE84MCthS3p3TmxuVXo5bUxMZU9WaVE0L1ptOEJQdzQ0RUxoSWFGMElVRXh6Rm1xQ2QvWDRvZ3lRTzE3eUdwTG9pdjltamNCSHFIeno1c2VQS2xTMVJMR1U3RDBWSUpkVWJUbHphazVNalRTNEsvTllLMUFkS0FvNFhlcVBNYXgzYlFGRHI1M3ZzVGJiWHpaYjBtcHR1UG56ZDFRSUNGZk1sRWVVR29BQk41QU41QkhRaHQycmhzQkVjNUFZNTlRMlcxUmJCWkdjWUpGNlR5TmFBMUVneThzR0x2aVF0WU12TDJGRDhobTNLNVg1eHoyVmNvVHNUaHRYeFpJYzRVVEZRQktDa29xd3NpR1pXMldpQjFhQkNSOFhNV0R1V0FKRC9UTFgvSndVcWsxOWFKQUxRbXM1QitSRUsybmJmV3NTUmNQb2ZqeEc0VWtKYTg5RVlTWT0iLCJBdXRoSW5mbyI6IntcIkNJXCI6XCI1OTFFWmpBODhROUQ3QjYySlFJTytpTkg1cFk5WXhURTJxU1RIMzRJalhDT0gwNjEyNDZlTnBHVTN2R3lBdXNLXCIsXCJDYWxsZXJcIjpcIjNBcVdtK0NyTXJOdHpNaHU2VWxBbFl4V1FZWSs3YTYrZG1CUmlmNXB4TGs9XCIsXCJFeHBpcmVUaW1lXCI6XCIyMDIzLTA2LTIwVDA2OjM4OjAyWlwiLFwiTWVkaWFJZFwiOlwiMGQwYTEyMTAwZWI0NzFlZWJmZDE4NmM2MzYwYzAxMDJcIixcIlNpZ25hdHVyZVwiOlwiMUVXcnVNa3ZLV09XUlVwcm0wa09NZWt5dEI0PVwifSIsIlZpZGVvTWV0YSI6eyJTdGF0dXMiOiJOb3JtYWwiLCJWaWRlb0lkIjoiMGQwYTEyMTAwZWI0NzFlZWJmZDE4NmM2MzYwYzAxMDIiLCJUaXRsZSI6IjYgLSBXaGF0IElmIEkgV2FudCB0byBNb3ZlIEZhc3Rlci5tcDQiLCJDb3ZlclVSTCI6Imh0dHA6Ly9vdXRpbi04N2RlMmUwNjBkYzQxMWVlYjFiYjAwMTYzZTAwMDY3Ny5vc3MtYXAtc291dGhlYXN0LTEuYWxpeXVuY3MuY29tLzBkMGExMjEwMGViNDcxZWViZmQxODZjNjM2MGMwMTAyL3NuYXBzaG90cy8zMTBiOGMwYWE5NTI0YzE5OTI3ZGNmOWI3NDU4YjQ5YS0wMDAwMS5qcGc/RXhwaXJlcz0xNjg3MjQ2NTgyJk9TU0FjY2Vzc0tleUlkPUxUQUkzRGt4dHNiVXlOWVYmU2lnbmF0dXJlPWRKTmR6dDAzNVUlMkI1WUxESyUyRmNXYmUwQm1oWU0lM0QiLCJEdXJhdGlvbiI6MTYuMjc2N30sIkFjY2Vzc0tleUlkIjoiU1RTLk5VU0hIUXV1eWRlZ3RNRFhCQ0NlMWR1UFAiLCJBY2Nlc3NLZXlTZWNyZXQiOiJEWjdDZDdTWGhid3laaVZaZER6MVhtRktpUW1oODl5ZWZxeUJBSFNGYVZaWSIsIlJlZ2lvbiI6ImFwLXNvdXRoZWFzdC0xIiwiQ3VzdG9tZXJJZCI6MTQ0MjIzNzI0OTY3MDY3Nn0="
        }
      }
    }
    ```

    其中videoId为视频ID，playAuth为视频播放凭证

  - 前端需要引入阿里云视频播放器，在react项目的`public/index.html`中引入：

    ```html
    <head>
      <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.15.2/skins/default/aliplayer-min.css" />  //（必须）H5模式播放器，需引用此css文件。
      <script charset="utf-8" type="text/javascript" src="https://g.alicdn.com/de/prismplayer/2.15.2/aliplayer-h5-min.js"></script>  //（必须）引入H5模式的js文件。
    </head>
    ```

  - 将上面的videoId和playAuth两个参数提供给阿里云播放器即可开始播放，示例如下：

    ```react
    import { useEffect, useRef } from 'react';
    const App = () => {
    
      const playerContainerRef = useRef(null);
    
      const headers = new Headers();
      headers.append('Authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODYyMTQ5MzIsImV4cCI6MTY4NzUxMDkzMiwiaWQiOiIzNDFlYjU0ZTI4ZTcxMTYwMjU3YjlmYmNjMzAwMjJmNiJ9.r92a9jku4abEhoNAIETBNaKxlOyQvth4lmt_1Mz9KOY`);
    
      useEffect(() => {
        let player
        fetch('http://localhost:10900/service-edu/edu-resource/video/53584fb5c4261511f0fe5f0e8271f271', {
          method: 'GET',
          headers: headers
        }).then(res => res.json()).then(res => {
          player = new window.Aliplayer({
            id: playerContainerRef.current.id,
            width: '100%',
            height: '500px',
            autoplay: false,
            vid: res.data.auth.videoId,
            playauth: res.data.auth.playAuth
          })
        })
    
        return () => {
          if (player) {
            player.dispose()
          }
        }
      })
    
      return (
        <>
          <div id="J_prismPlayer" ref={playerContainerRef}></div>
        </>
      );
    }
    export default App;
    ```

## Update 2023.6.20

- 创建/更新/删除小节相关的接口可用
- 学生注册和退出课程的接口可用
- 上传文件资源和视频资源的接口可用
- 下载文件资源的接口可用
  - 该接口如果调用成功返回一个文件流（Content-Type=application/octet-stream），该接口如果调用失败返回json数据（Content-Type=application/x-www-form-urlencoded）前端需要首先判断返回类型再做对应处理
  - 返回的文件流不会被浏览器自动下载，需要封装成blob格式再手动生成一个下载链接，模拟点击进行下载
- 上传视频的接口最好限制只上传mp4格式（理论上所有视频格式都受到支持，但我还没测试播放其他格式的视频）
- 不要上传过大的视频（因为有点慢）

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

