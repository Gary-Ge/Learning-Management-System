import { useState,useEffect } from "react";
import "./login.less"; 
import { Button, Form, Input, Radio, message } from 'antd';
import { Link,useHistory } from 'umi'; 
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { LoginDTO } from '../utils/entities';
import { validEmail, validNotNull, HOST, LOGIN_URL, saveToken, HEADER } from '../utils/utils';
function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
}

export default function LoginPage() {

  const [form] = Form.useForm();
  const [size, setSize] = useState<SizeType>('small');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  


  const handleEmailChange = (e:any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e:any) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (!validEmail(email)) {
      message.error('please input a valid Email')
      return
    } 
    if (!validNotNull(password)) {
      message.error('please input a password')
      return
    }
    const dto = new LoginDTO(email,password);
    fetch(`${HOST}${LOGIN_URL}`, {
      method: 'POST',
      body: JSON.stringify(dto),
      headers: HEADER
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      saveToken(res.data.token)
      history.push('/'); // redirect to login page, adjust as needed
    })
    .catch(error => {
     message.error(error.message)
    });  
  }
  useEffect(() => {
    clearToken();
  }, []);

  return (
    <div className="body_login_register">
       <div className="icon-container">
                <img src="/assert/logo_l.png" alt="icon" /> 
            </div>
        <div className="container_login_register">
        <Form
      form={form}
      layout="vertical"
      initialValues={{ remember: true }}
      style={{fontFamily: 'Comic Sans MS'}}
    >
      <Form.Item style={{ marginTop: '30px' }}>
        <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
        <Link to="/login">
          <Radio.Button value="small">Login</Radio.Button>
        </Link>
        <Link to="/register">
          <Radio.Button value="signin">Register</Radio.Button>
          </Link>
        </Radio.Group>
      </Form.Item>
      <Form.Item 
      label="Email"
      name="Email"
      rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input placeholder="please input your Email" value={email} onChange={handleEmailChange}/>
      </Form.Item>
      <Form.Item
        label="Password"
        name="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password placeholder="please input your password" value={password} onChange={handlePasswordChange}/>
      </Form.Item>
      <Form.Item>
        <Link to="/forgetpassword">Forgot password?</Link>
      </Form.Item>

      <Form.Item className="Submit">
        <Button type="primary" onClick={handleSubmit}>Submit</Button>
      </Form.Item>
    </Form>
        </div>
    </div>
  );
}



