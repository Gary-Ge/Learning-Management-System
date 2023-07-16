<center><h1>Development Document</h1></center>

## Update 2023.7.13

- `service-stream/stream-basic/stream/{streamId}/status`接口已弃用，请删除所有的定时器轮询请求
- 新的直播流程如下
  - 教师端
    1. 点击一个stream lesson时，判断该直播是否开始（inProgress是否为true）
    2. 如果直播已经开始，直接进入直播页面
    3. 如果直播未开始，调用`service-stream/stream-basic/stream/{streamId}/pushUrl`获取推流链接，将链接在一个弹窗中显示。该弹窗的确认按钮应该是`开始直播`
    4. 使用OBS推流到指定链接后点击`开始直播`按钮，该按钮点击时调用`service-stream/stream-basic/stream/{streamId}/start`，该接口会判断推流状态，只有在推流已经开始的情况的下才会正确执行，否则报错（现阶段，为了方便调试，该接口暂时不会判断推流状态，一定会执行成功）
    5. 关闭弹窗，进入直播页面，通过`service-stream/stream-basic/stream/{streamId}/play` 获取播放链接，然后直接创建播放器
  - 学生端
    1. 学生点击join class中的一个直播时，首先判断直播是否开始（inProgress是否为true），如果直播已经开始，进入直播页面，获取播放链接，创建播放器
    2. 如果直播没有开始，报错，提示直播未开始

## Update 2023.7.11

- 添加接口`/service-stream/stream-quiz/quiz/{streamId}`，用于在直播时快速创建Quiz

  - 该接口遵循“创建即发布”模式，一旦调用该接口成功，创建的Quiz会立即向所有在直播间内的用户发布，Quiz创建后无法修改，无法删除

  - 该接口的请求体如下

    ```json
    {
      "limitation": 0, // Quiz限制时间，单位为秒，超时无法提交答案
      "questions": [ // 问题列表，里面的每一个对象都是一个问题，格式如下
        {
          "mark": 0, // 该题目的分数，可以没有
          "type": 0, // 该题目的类型，0为单选，1为多选，只有这两种
          "question": "", // 题目内容
          "optionA": "", // 选项A内容
          "optionB": "", // 选项B内容
          "optionC": "", // 选项C内容，可以为空
          "optionD": "", // 选项D内容，可以为空
          "answer": "" // 答案，答案的格式见下面的内容
        }
      ]
    }
    ```

  - 选项的要求：至少存在AB两个选项，至多存在ABCD四个选项，选项需要按顺序创建，即第一个选项必须是A，第二个必须是B，第三个必须是C，第四个必须是D。你不能创建ABD三个选项而将C留空，这样的请求会被拒绝。
  - 答案的格式：答案是由一个非空字符串表示的，字符串中的每一个字符代表一个正确答案，字符串中字符的顺序和大小写不重要，但是不能出现重复的字符，也不能出现除了ABCD(和他们的小写)之外的其他任何字符（如果C和D选项不存在，那么C和D也不能出现）。不满足要求的答案格式会报bad answer format。一些示例如下
    - 正确答案为A，则答案字符串可以为a或A
    - 正确答案为AB，则答案字符串可以为ab，AB或ba，BA，Ba，Ab。但是不可以为AC，因为C选项不存在
  - 在所有需求整数的地方如果传递了非整数，会带来bad format错误
  - 问题会按照在questions列表中的顺序存入数据库，在发布时也会保持这个顺序
  - quizId会被接口返回

- 在创建了quiz之后，quiz会通过websocket长连接被发布，格式如下

  ```json
  {
  	"type": 2, // 这里是事件的type，发布Quiz的事件类型为2
    "streamId": "8a0be1a5317b3b04a96125331f32ddfe",
    "quizId": "457943eabee18a9146503e9dc5166bf4",
    "limitation": 1000,
    "questions": [
      {
        "answer": "A",
        "createdAt": "2023-07-11T18:17:04.074",
        "optionA": "optionA",
        "optionB": "optionB",
        "optionC": "optionC",
        "optionD": "optionD",
        "question": "question1",
        "questionId": "2067143d660c98c227f19859d751bb4f",
        "quizId": "457943eabee18a9146503e9dc5166bf4",
        "sort": 0, // 该问题在这个quiz中的排序
        "type": 0 // 这里是问题的type，不是事件的type
      }
    ]
  }
  ```

- 添加了接口`/service-stream/stream-quiz/quiz/answer/{quizId}`，用于提交一个快速Quiz的答案

  - 同样，该接口遵循“创建即发布”模式，答案只能成功提交一次，提交后无法修改，无法删除。

  - 该接口的请求体如下：

    ```json
    {
      "answers": []
    }
    ```

  - 接受一个answers列表，列表中的每一项都是一个答案字符串，答案字符串的格式要求与创建quiz时的答案字符串格式要求相同。

  - 列表中答案字符串的顺序应与quiz中问题的顺序保持一致（可以参考发布Quiz事件中问题的顺序），后端会认为第一个答案对应第一个问题，以此类推。回答部分问题是不允许的，如果答案列表的长度和问题数量不一致，则请求会被拒绝。

  - 该接口的响应如下

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Answer quick quiz success",
      "data": {
        "fasterThan": "0.5"
      }
    }
    ```

    fasterThan字段返回一个介于0和1之间的值，表示当前用户的提交速度快于多少正在参与直播的用户。例如：0.5意味着当前用户的回答速度快于50%的在线用户

- 在任何一个用户提交了答案之后，一个答案分布统计事件会通过websocket长连接通知所有正在参与直播的用户，事件如下

  ```json
  {
  	"type": 3, // 这里是事件的type，答案分布统计的事件类型为3
    "streamId": "8a0be1a5317b3b04a96125331f32ddfe",
    "quizId": "457943eabee18a9146503e9dc5166bf4",
    // TODO: 这里可能还会返回当前已经回答问题的人数，还没实现，不影响使用
    "questions": [ // 问题列表，顺序与Quiz中问题的顺序相同，列表里的每一个对象都是一个问题的答案分布统计
      {
        "countA": 0, // 答案A的计数，下同
        "countB": 1,
        "countC": 0,
        "countD": 0,
        "distA": 0, // 答案A的占比，是一个介于0和1之间的值，意味着在所有提交的答案中有多少百分比的学生在这一道题中选择了A，下同
        "distB": 1,
        "distC": 0,
        "distD": 0,
        "questionId": "2067143d660c98c227f19859d751bb4f",
      }
    ]
  }
  ```

## Update 2023.7.10

- 添加接口`service-edu/edu-assignment/submit/{submitId}`，用于教师下载学生的提交文件

- 添加接口`service-edu/edu-staff/coursesWithForum`，用于获取所有自己教授的且有论坛的课程

- 添加接口`service-forum/forum-post/posts/{courseId}/search/{keyword}`，用于搜索论坛帖子

  - 响应如下

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Search post success",
      "data": {
        "posts": {
          "inContent": [],
          "inTitle": [
            {
              "createdAt": "2023-07-08 20:41:48",
              "postBy": {
                "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
                "userId": "cd1d8d8914ce34f307449e085428901d",
                "email": "920060768a@qq.com",
                "username": "Bohan Zhang"
              },
              "postId": "4dfccbc944c64f30822946672fe9326c",
              "title": "This is the post 2",
              "category": "Assignment 2",
              "content": "This is the content of post 2",
              "updatedAt": "2023-07-08 20:41:48"
            },
            {
              "createdAt": "2023-07-08 20:41:35",
              "postBy": {
                "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
                "userId": "cd1d8d8914ce34f307449e085428901d",
                "email": "920060768a@qq.com",
                "username": "Bohan Zhang"
              },
              "postId": "64071a53529718d567a5d05659ea4d72",
              "title": "This is the post 1",
              "category": "Assignment 1",
              "content": "This is the content of post 1",
              "updatedAt": "2023-07-08 20:41:35"
            }
          ]
        }
      }
    }
    ```

  - `inTitle`是所有关键词出现在标题中的帖子
  - `inContent`是所有关键词出现在内容中的帖子
  - 在`inTitle`中出现过的帖子不会再次出现在`inContent`中

- **所有获取帖子的接口中的帖子按照创建时间降序排列。获取回复的接口的所有回复按照创建时间升序排列。每一个回复的子回复按照创建时间升序排列**

## Update 2023.7.9#3

- 新的websocket连接方式

  - 安装库

    ```
    npm install --save react-stomp
    ```

  - 连接，使用组件（先导包）

    ```react
    <SockJsClient
              url='http://localhost:10940/ws?streamId=${streamId}&userId=${userId}'
              topics={['/topic/stream/${streamId}']}
              onMessage={(msg) => { // 这里处理事件
                console.log(msg) //这里不用JSON.Parse，据我观察这个msg已经被转换成对象了
              }}
              ref={ (client) => { stompClient.current = client }} // 这行我也不知道有什么用，好像去掉也是可以的 />
    ```

## Update 2023.7.9#2

- 获取一个assignment的所有提交的接口可用，位于`service-edu/edu-assignment/assignment/{assignmentId}/submits`

  - 响应如下

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Get submits files success",
      "data": {
        "assignment": {
          "submits": [ // 所有提交的学生
            {
              "files": [ // 该学生提交的文件列表
                {
                  "createdAt": "2023-07-04 22:14:25",
                  "name": "Homework2 ass test.pdf",
                  "submitId": "0bc13eaac862fa30e9b414bc129398ef"
                }
              ],
              "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/default/default-avatar.svg",
              "userId": "d5d81af3467ac8ba5112e4f6229fb7dc",
              "email": "123@gmail.com",
              "mark": 15.63, // 该学生当前分数，如果这里是-1则说明该学生还没有被评分
              "username": "yung"
            }
          ],
          "createdAt": "2023-07-02 18:46:54",
          "start": "2023-07-02 18:46:01",
          "description": "<p><span style=\"color: rgb(0, 0, 0);\">This course explores machine learning as the algorithmic approach to learning from data. The course also covers key aspects of data mining, which is understood as the application of machine learning tools to obtain insight from data. Algorithms are placed in the context of their theoretical foundations in order to understand their derivation and correct application. Topics include linear models for regression and classification, local methods (nearest neighbor), neural networks, tree learning, kernel machines, unsupervised learning, ensemble learning, computational and statistical learning theory, and Bayesian learning. To expand and extend the development of theory and algorithms presented in lectures, practical applications will be given in tutorials and programming tasks during the project.</span></p><p><span style=\"color: rgb(0, 0, 0);\"><span class=\"ql-cursor\">\ufeff</span>This course is taught to emphasize that theory, algorithms and empirical work are essential inter-dependent components of machine learning. Teaching is mainly focused on lectures and assessed practical work on topics in machine learning, with tutorials to expand and reinforce the lecture content. Assessment is by two marked homework, a project and a final exam. The assignments are aimed at giving students an opportunity for active learning in a structured way with submission deadlines. The purpose is to give students practical experience of machine learning and relate lecture material to real applications. The second assignment has a broad scope and should be treated as a small-scale project with the submission of software and a written report.</span></p>",
          "end": "2023-07-06 18:46:07",
          "title": "comp9417-Assignment2",
          "assignmentId": "175c29115e4bf765cfd0d518502d3349",
          "mark": 30, // 该assignment的分数上限
          "updatedAt": "2023-07-02 18:46:54"
        }
      }
    }
    ```

- 为学生的提交打分的接口已经可用，位于`service-edu/edu-assignment/assignment/{assignmentId}/mark/{userId}`，注意这里的`userId`指的是要打分的学生的userId

  - 该接口的请求体格式为

    ```json
    {
      "mark": 0
    }
    ```

    mark应当为一个整数或浮点数，且大于等于0小于等于该assignment的分数上限，不符合要求的格式会被拒绝

  - 该接口同样可以用于修改学生的分数

## Update 2023.7.9

主要是论坛相关

- 创建/更新/删除POST的接口已经可用

- 获取一门课程论坛中的全部POST的接口为`/service-forum/forum-post/posts/{courseId}`

  - 响应如下，该接口只返回POST的基本信息，不会返回回复

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Get all the posts information success",
      "data": {
        "posts": [
          {
            "createdAt": "2023-07-08 20:41:48",
            "postBy": {
              "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
              "userId": "cd1d8d8914ce34f307449e085428901d",
              "email": "920060768a@qq.com",
              "username": "Bohan Zhang"
            },
            "postId": "4dfccbc944c64f30822946672fe9326c",
            "title": "This is the post 2",
            "category": "Assignment 2",
            "content": "This is the content of post 2",
            "updatedAt": "2023-07-08 20:41:48"
          },
          {
            "createdAt": "2023-07-08 20:41:35",
            "postBy": {
              "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
              "userId": "cd1d8d8914ce34f307449e085428901d",
              "email": "920060768a@qq.com",
              "username": "Bohan Zhang"
            },
            "postId": "64071a53529718d567a5d05659ea4d72",
            "title": "This is the post 1",
            "category": "Assignment 1",
            "content": "This is the content of post 1",
            "updatedAt": "2023-07-08 20:41:35"
          }
        ]
      }
    }
    ```

- 获取一门课程论坛中某一个类别的全部POST的接口为`/service-forum/forum-post/posts/{courseId}/{categoryId}`

  - 响应同上，不会返回回复

- 获取一门课程论坛中某一个POST的接口为`/service-forum/forum-post/post/{postId}`

  - 响应如下，该接口会返回回复

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Get post information success",
      "data": {
        "post": {
          "createdAt": "2023-07-08 20:41:35",
          "replies": [
            {
              "createdAt": "2023-07-08 22:46:39",
              "subReplies": [
                {
                  "createdAt": "2023-07-08 23:01:15",
                  "replyId": "16e1ffb02f9ef54faa201903dd243869",
                  "replyBy": {
                    "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
                    "userId": "cd1d8d8914ce34f307449e085428901d",
                    "email": "920060768a@qq.com",
                    "username": "Bohan Zhang"
                  },
                  "content": "reply reply 1",
                  "updatedAt": "2023-07-08 23:01:15"
                },
                {
                  "createdAt": "2023-07-08 23:02:13",
                  "replyId": "aad1c4c8a4df1e0fba146546d0f2c309",
                  "replyTo": {
                    "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
                    "userId": "cd1d8d8914ce34f307449e085428901d",
                    "email": "920060768a@qq.com",
                    "username": "Bohan Zhang"
                  },
                  "replyBy": {
                    "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
                    "userId": "cd1d8d8914ce34f307449e085428901d",
                    "email": "920060768a@qq.com",
                    "username": "Bohan Zhang"
                  },
                  "content": "reply reply 7",
                  "updatedAt": "2023-07-08 23:02:13"
                },
                {
                  "createdAt": "2023-07-08 23:02:16",
                  "replyId": "6e81832c6f4ce62e2b0c1f76a700de84",
                  "replyTo": {
                    "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
                    "userId": "cd1d8d8914ce34f307449e085428901d",
                    "email": "920060768a@qq.com",
                    "username": "Bohan Zhang"
                  },
                  "replyBy": {
                    "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
                    "userId": "cd1d8d8914ce34f307449e085428901d",
                    "email": "920060768a@qq.com",
                    "username": "Bohan Zhang"
                  },
                  "content": "reply reply 8",
                  "updatedAt": "2023-07-08 23:02:16"
                }
              ],
              "replyId": "7991bf372f237fe9202bb06d2ddde249",
              "replyBy": {
                "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
                "userId": "cd1d8d8914ce34f307449e085428901d",
                "email": "920060768a@qq.com",
                "username": "Bohan Zhang"
              },
              "content": "Reply 1",
              "updatedAt": "2023-07-08 22:46:39"
            }
          ],
          "postBy": {
            "user_id": "cd1d8d8914ce34f307449e085428901d",
            "avatar": "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG",
            "email": "920060768a@qq.com",
            "username": "Bohan Zhang"
          },
          "postId": "64071a53529718d567a5d05659ea4d72",
          "title": "This is the post 1",
          "category": "Assignment 1",
          "content": "This is the content of post 1",
          "updatedAt": "2023-07-08 20:41:35"
        }
      }
    }
    ```

- 更新/删除回复的接口可用
- 回复一个POST的接口为`/service-forum/forum-reply/post/{postId}/reply`
- 回复另一个回复的接口为`/service-forum/forum-reply/reply/{replyId}/reply`
- 创建/更新/删除POST类别的接口可用

## Update 2023.7.6

- 创建/更新/删除stream lesson的接口已经可用

- 获取单个stream lesson信息的接口为`/service-stream/stream-basic/stream/{streamId}`

  - 响应如下，其中inProgress指的是直播课程是否已经开始（inProgress为true仅代表直播课程已经开始，并不代表教师端已经开始推流）

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Get stream lesson info success",
      "data": {
        "stream": {
          "createdAt": "2023-07-03 21:54:43",
          "streamId": "8a0be1a5317b3b04a96125331f32ddfe",
          "inProgress": false,
          "start": "2023-07-04 15:55:31",
          "description": "This is the first stream lesson",
          "end": "2023-07-04 18:55:31",
          "title": "Stream lesson 1.1",
          "updatedAt": "2023-07-06 20:12:14"
        }
      }
    }
    ```

    

- 获取一门课程的所有stream lesson信息的接口为`/service-stream/stream-basic/streams/{courseId}`

  - 响应如下

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Get stream lesson info success",
      "data": {
        "streams": [
          {
            "createdAt": "2023-07-03 21:54:43",
            "streamId": "8a0be1a5317b3b04a96125331f32ddfe",
            "inProgress": false,
            "start": "2023-07-04 15:55:31",
            "description": "This is the first stream lesson",
            "end": "2023-07-04 18:55:31",
            "title": "Stream lesson 1.1",
            "updatedAt": "2023-07-06 20:12:14"
          }
        ]
      }
    }
    ```

- 获取推流状态的接口为`/service-stream/stream-basic/stream/{streamId}/status`

  - 响应如下，isPushing为true代表教师端已经开始推流，可以创建播放器

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Get stream status success",
      "data": {
        "isPushing": false
      }
    }
    ```

- 开始直播课程的接口为`/service-stream/stream-basic/stream/{streamId}/start`

  - 响应如下，pushUrl为OBS的推流目标地址，调用该接口会将该streamId的直播课程的inProgress置为true

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Start stream lesson success",
      "data": {
        "pushUrl": "rtmp://stream.keyl1meqaq.xyz/brainoverflow/8a0be1a5317b3b04a96125331f32ddfe?auth_key=1688659374-0-0-4f70bc2549a5627b76551c41c6ac9060"
      }
    }
    ```

- 结束直播课程的接口为`/service-stream/stream-basic/stream/{streamId}/finish`

  - 响应如下，这个接口会将inProgress置为false。该接口其实没什么用，因为即使不调用该接口直播课程也会在它开始后的3小时自动关闭。

  - 当直播课程关闭后，尝试加入直播间的用户将无法获取直播课程的观看地址，但是已经在直播间内观看直播的用户不会受到影响。仍在直播间内的用户依然能够收看直播（如果推流仍在继续），聊天功能也能正常使用。

  - **TODO: 后续可能会在直播课程被结束时通过websocket连接将该事件通知前端**

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Finish stream lesson success",
      "data": {}
    }
    ```

- 获取直播播放地址的接口为`/service-stream/stream-basic/stream/{streamId}/play`

  - 响应如下，playUrl为播放地址，使用flv.js库即可播放

    ```json
    {
      "success": true,
      "code": 20000,
      "message": "Play stream lesson success",
      "data": {
        "playUrl": "https://playstream.keyl1meqaq.xyz/brainoverflow/8a0be1a5317b3b04a96125331f32ddfe.flv?auth_key=1688660113-0-0-84288c1756f5f5bb3bc4d2b7c2384a46"
      }
    }
    ```

- 在直播间内的聊天室发送消息的接口为`/service-stream/stream-chat/message/{streamId}/{message}`
  - 响应不会携带数据
- 在进入直播间时，需要使用websocket长连接连接服务器，以获得后端向前端推送的消息，示例如下

```react
import { Button } from 'antd';
import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const App = () => {

  const [messages, setMessages] = useState([])
  const stompClient = useRef(null)

  useEffect(() => {
    const socket = new SockJS('http://175.45.180.201:10940/ws?streamId=${streamId}'); // 注意此地址的host部分必须为175.45.180.201:10940，即微服务的真正地址而不是网关地址，因为网关不支持转发websocket连接。streamId=${streamId}是必须的参数，请在连接地址携带streamId，否则连接会失败。
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe('/topic/stream/${streamId}', (message) => {
          const data = JSON.parse(message.body)
          if (data.type === 0) { // 判断事件类型
            setMessages(prevMessages => [...prevMessages, data])
          }
          console.log(data)
        }, {
          id: "${userId}" //由于websocket连接无法携带请求头，token解析不可用，因此必须在这里显式传递userId (可以使用fetch拉接口拿或者从localstorage里拿)
        })
      }
    })

    client.activate();

    stompClient.current = client

    return () => {
      client.deactivate()
    }
  }, [])

  const headers = new Headers();
  headers.append('Authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc5NDkxNzAsImV4cCI6MTY5MDU0MTE3MCwiaWQiOiJjZDFkOGQ4OTE0Y2UzNGYzMDc0NDllMDg1NDI4OTAxZCJ9.H7dvEV9skl-m-xWm4QggrH1oh0M7LIMOchgOhYerEic`); // 这里替换成$token

  const send = () => { // 发送信息
    fetch(`http://175.45.180.201:10900/service-stream/stream-chat/message/${streamId}/${要发送的消息}`, {
      method: 'POST',
      headers: headers
    })
    .then(res => res.json())
    .then(res => console.log(res.data));
  }

  return (
    <>
      <Button onClick={send}>
        Send
      </Button>
      {messages.map((message, index) => (
        <div key={index}>
          <p>{message.message}</p>
          <p>{message.username}</p>
          <p>{message.time}</p>
        </div>
      ))} // 显示自己和其他用户发送的信息
    </>
  );
}
export default App;
```

- **目前**，后端会通知前端的事件有两种：

  - 第一种，`type=0`，代表某个用户（包括自己）发送了一条消息，`JSON.parse(message.body)`之后的格式如下：

    ```json
    {
    	avatar: "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG"
      email: "920060768a@qq.com"
      message: "testMessage"
      streamId: "8a0be1a5317b3b04a96125331f32ddfe"
      time: "2023-07-06 23:27:04"
      type: 0
      userId: "cd1d8d8914ce34f307449e085428901d"
      username: "Bohan Zhang"
    }
    ```

  - 第二种，`type=1`，代表在线用户列表更新（某用户进入直播间/退出直播间），`JSON.parse(message.body)`之后的格式如下：

    ```json
    {
      streamId: "8a0be1a5317b3b04a96125331f32ddfe"
    	type: 1
      userList: [
      	{
          avatar: "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/avatar/cd1d8d8914ce34f307449e085428901d/b214cd3c-9f36-4063-9841-d727c156ef99.JPG"
          email: "920060768a@qq.com"
          user_id: "cd1d8d8914ce34f307449e085428901d" //注意这里是user_id不是userId
          username: "Bohan Zhang"
    		}... // TODO: 后续会按照某个字段排序，这不会对前端调用造成影响
      ]
    }
    ```

  - **同一个用户可以开启多个标签页进入同一个直播间多次，这不会对在线用户列表产生影响（用户列表上仍只会显示一个他）**

  - **后续可能还有更多事件会通过websocket长连接进行通知**

- 如何使用flv.js播放flv直播流

  - 首先安装flv.js（一个B站开源的播放器组件）

    ```perl
    npm install flv.js
    ```

  - 然后建立播放器，示例如下

    ```react
    import { useEffect, useRef, useState } from 'react';
    import FlvJs from 'flv.js';
    
    const App = () => {
      const videoRef = useRef(null);
      const [pushStarted, setPushStarted] = useState(false);
    
      useEffect(() => {
        const headers = new Headers();
        headers.append('Authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicmFpbm92ZXJmbG93LXVzZXIiLCJpYXQiOjE2ODc5NDkxNzAsImV4cCI6MTY5MDU0MTE3MCwiaWQiOiJjZDFkOGQ4OTE0Y2UzNGYzMDc0NDllMDg1NDI4OTAxZCJ9.H7dvEV9skl-m-xWm4QggrH1oh0M7LIMOchgOhYerEic`); //使用${token}代替
    
        const interval = setInterval(() => {
          fetch("http://175.45.180.201:10900/service-stream/stream-basic/stream/${streamId}/status", {
            method: "GET",
            headers: headers
          }).then(res => res.json())
            .then(res => {
              if (res.data.isPushing) {
                setPushStarted(true);
                clearInterval(interval);
              }
            })
        }, 2000); // 使用定时器轮询，判断推流是否开始
      })
    
      useEffect(() => {
        // 如果推流已经开始，创建播放器
        if (pushStarted && FlvJs.isSupported()) {
          const videoElement = videoRef.current;
          videoElement.muted = true; // 必须设置为静音播放，否则自动播放无法开始，用户可以手动打开声音
          const flvPlayer = FlvJs.createPlayer({
            type: 'flv',
            isLive: true,
            url: "https://playstream.keyl1meqaq.xyz/brainoverflow/8a0be1a5317b3b04a96125331f32ddfe.flv?auth_key=1688582908-0-0-818d4f2ada42457a907aeb9a9aae46b7" // 需要调用接口获取播放链接
          });
          flvPlayer.attachMediaElement(videoElement);
          flvPlayer.load();
          flvPlayer.play();
    
          flvPlayer.on('error', (err) => {
            console.log('FLVJS: ', err);
          })
    
          return () => {
            flvPlayer.unload();
            flvPlayer.detachMediaElement();
            flvPlayer.destroy();
            videoElement.src = '';
            videoElement.removeAttribute('src');
          };
        }
      }, [pushStarted]);
    
      return (
        <>
          <video ref={videoRef} controls width={"100%"} height={"100%"}/>;
        </>
      );
    }
    export default App;
    ```

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

