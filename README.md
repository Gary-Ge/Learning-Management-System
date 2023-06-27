<center><h1>Development Document</h1></center>

## Update 2023.6.27

- Assignment创建时需要提供分数。所有获取Assignment信息的接口也同时返回分数信息
- Assignment创建时现在会判断ass的截止日期是否晚于当前日期

## Update 2023.6.25

- 获取所有课程的接口已经可用，位于`/service-edu/edu-course/courses`，该接口会忽略当前用户创建/教授/注册参与的所有课程，只返回那些与当前用户完全无关的课程，按照创建时间排序
- 搜索课程的接口已经可用，位于`/service-edu/edu-course/courses/{keyword}`，该接口会忽略当前用户创建/教授/注册参与的所有课程，只返回那些与当前用户完全无关的课程，按照创建时间排序。不区分关键词的大小写

## Update 2023.6.24

- **现在所有用于下载文件的接口都返回一个下载链接，使用一个新标签页打开返回的链接，浏览器会根据文件类型决定是预览还是直接下载**
- **图片上传接口会返回一个图片的链接，直接将这个链接用在后续的POST或PUT请求中即可（在请求体中有填链接的地方，例如cover, avatar等），无需任何处理。该链接也可以直接被用在在图片组件上进行展示**

- Assignment相关接口已经可用（包括增删改查）
  - `/service-edu/edu-assignment/assignments/{courseId}`和`/service-edu/edu-assignment/assignment/{assignmentId}`是给Lecturer调用的，用于获取assignment的基本信息和assignment的文件信息
  - `/service-edu/edu-student/assignment/{assignmentId}`和`/service-edu/edu-student/assignments/{courseId}`是给Student调用的，用于获取assignment基本信息，assignment文件信息和该学生自己提交的文件信息
- 学生提交作业的接口可用，后一次提交会覆盖前一次提交的所有内容
- 删除一个Resource的接口可用
- 删除一个Assignment文件的接口可用
- 上传视频的接口更新了，现在对于同一个section多次上传视频的话，后一次上传的内容会覆盖前一次

## Update 2023.6.20 #3

- 关于图片的上传，可以在antd组件的beforeUpload事件里将文件封装为formData对象，并调用接口上传，如下（我也不知道为什么如果在onChange事件里执行上传逻辑会导致上传3次，很怪）

```react
import { useState } from 'react';
import { Upload } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';

const App = () => {

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const headers = new Headers();
  headers.append('Authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODYyMTQ5MzIsImV4cCI6MTY4NzUxMDkzMiwiaWQiOiIzNDFlYjU0ZTI4ZTcxMTYwMjU3YjlmYmNjMzAwMjJmNiJ9.r92a9jku4abEhoNAIETBNaKxlOyQvth4lmt_1Mz9KOY`);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        multiple={false}
        maxCount={1}
        beforeUpload={(file) => {
          console.log(file)
          const formData = new FormData();
          formData.append("file", file);
          setLoading(true);

          fetch('http://175.45.180.201:10900/service-ucenter/ucenter/avatar', {
            method: 'POST',
            headers: headers,
            body: formData
          }).then(res => res.json()).then(res => {
            console.log(res)
            setLoading(false);
            setImageUrl(res.data.avatar);
          })

          return false;
        }}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </>
  );
}
export default App;
```



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

- 在创建视频课程时，需要首先调用创建视频section的接口，获取新创建的视频课程的id，再调用上传视频的接口将视频上传
  - 这是因为视频资源需要关联它所属的sectionID
  - 在创建text lesson时也遵循同样的逻辑，先创建lesson，再上传文件。基于同样的理由。

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

